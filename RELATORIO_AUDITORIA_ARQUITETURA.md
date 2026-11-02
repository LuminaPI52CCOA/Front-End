# Relatório de Auditoria Arquitetural

## 1. Resumo Executivo

Este relatório apresenta os resultados da auditoria técnica e arquitetural minuciosa realizada no ecossistema de software **Lumina Odontológica**, tomando como referência a branch `develop` de todos os submódulos e confrontando o estado da arte com as diretrizes formais estabelecidas na [`DOCUMENTACAO_GERAL_ALTERACOES_ARQUITETURA.md`](file:///home/joao-carlos/Documentos/lumina/DOCUMENTACAO_GERAL_ALTERACOES_ARQUITETURA.md) e no [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md).

### Visão Geral da Saúde do Projeto e Principais Riscos
O ecossistema Lumina demonstra alto grau de sofisticação técnica, cobrindo aplicações web em React 19, backend corporativo em Spring Boot 3 / Java 21, mensageria orientada a eventos com RabbitMQ, computação serverless de voz na AWS Alexa, pipeline de dados lakehouse (Medallion) com AWS Glue/S3/Athena, e infraestrutura como código (IaC) via Terraform com contorno de restrições de permissões do AWS Academy Learner Lab.

Contudo, a auditoria identificou riscos severos que comprometem a estabilidade, a conformidade legal e a segurança operacional:
1. **Divergência Crítica de Branches e Isolamento da LGPD:** Alterações fundamentais de conformidade com a LGPD (pseudonimização, mascaramento de CPF e RBAC) estão retidas na branch `origin/LGPD` e nunca foram integradas à `develop`. Da mesma forma, alterações estruturais de DDL e dados de teste do RabbitMQ foram commitadas diretamente na branch `main` do `Banco-de-dados` e `Infraestrutura`, deixando a branch `develop` desatualizada e funcionalmente inconsistente.
2. **Vazamento de Credenciais e Chaves Privadas (DevSecOps):** Presença de chaves privadas RSA (`.pem`) versionadas nos repositórios e fallbacks de senhas e JWT secrets hardcoded.
3. **Quebra de Contratos de Rede e Roteamento (NGINX Proxy Reverso):** O provisionamento de frontend na AWS EC2 sobrescreve a configuração do NGINX, omitindo as rotas `/notificacoes`, `/public` e o tratamento de `/api/`, o que quebra o disparo de lembretes e confirmações de consultas em produção.
4. **Violações de Clean Architecture e Acoplamento no Backend:** Injeção direta de repositórios JPA dentro de controllers HTTP, lógica de negócio operando diretamente em métodos web, além de pacotes utilitários e de autenticação alocados erroneamente no pacote `swagger`.
5. **Fragilidade Operacional e Falhas Silenciosas no Data Pipeline:** A extração do SISAGUA está operando com mocks estáticos em código de produção, e o AWS Glue Job trata colunas por índice posicional e engole exceções com `except Exception: print()`, reportando sucesso ao orquestrador enquanto nenhum dado é persistido.
6. **Ausência de Testes Automatizados no Frontend:** O repositório `Front-End` não possui testes unitários nem script `test` no `package.json`, violando a política de qualidade canônica da Lumina.

### Tabela Consolidada de Ocorrências por Severidade

| Módulo / Camada | [Crítico] | [Médio] | [Baixo] | Total |
| :--- | :---: | :---: | :---: | :---: |
| **Back-end** | 4 | 4 | 2 | **10** |
| **Front-End** | 2 | 2 | 1 | **5** |
| **Banco-de-dados** | 2 | 2 | 1 | **5** |
| **Data-Pipeline** | 2 | 1 | 1 | **4** |
| **Infraestrutura** | 3 | 2 | 1 | **6** |
| **Lambda-Alexa** | 1 | 2 | 1 | **4** |
| **Total Consolidado** | **14** | **13** | **7** | **34** |

---

## 2. Apontamentos por Módulo

### 2.1. Back-end

#### [CRÍTICO] Branch `LGPD` Não Integrada na `develop` (Risco Regulatório de Não Conformidade)
- **Arquivo / Linha:** [`Back-end/`](file:///home/joao-carlos/Documentos/lumina/Back-end) (Branch `LGPD`, Commit `5fece53`)
- **Documento/Regra Violada:** Requisitos de Privacidade, Proteção de Dados (LGPD - Lei 13.709/2018) e Política de Versionamento (`develop` como branch canônica de integração).
- **Diagnóstico:** As implementações de pseudonimização no S3 Bronze, mascaramento de CPF (`ClienteResponse`), controle de acesso estrito (RBAC) para o prontuário de anamnese e auditoria de consentimento foram concluídas na branch `LGPD`, mas a branch `develop` não possui esses commits. Em um deploy baseado em `develop`, a aplicação opera em desacordo com as diretrizes legais e médicas de sigilo.
- **Ação Corretiva Sugerida:**
  Executar o merge da branch `LGPD` na branch `develop`:
  ```bash
  cd Back-end
  git checkout develop
  git merge --no-ff origin/LGPD -m "feat(lgpd): integrar conformidade lgpd, mascaramento de cpf e rbac na develop"
  git push origin develop
  ```

#### [CRÍTICO] Violação de Clean Architecture: Injeção de Repositórios e Lógica de Negócio no Controller
- **Arquivo / Linha:** [`Back-end/src/main/java/com/lumina/backend/controller/ClienteController.java#L59-L60`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/controller/ClienteController.java#L59-L60) e [`#L302-L318`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/controller/ClienteController.java#L302-L318)
- **Documento/Regra Violada:** Princípios de Clean Architecture, Segregação de Responsabilidades (SRP) e Separação em Camadas.
- **Diagnóstico:** O `ClienteController` injeta diretamente `ConsultaRepository` e `UsuarioRepository`. Além disso, o método privado `enriquecerClientesComConveniosEConsultas` executa consultas SQL, filtragem de streams e regras de negócio para inferir a próxima data de consulta dos pacientes. Controladores HTTP devem ser enxutos e atuar apenas no roteamento e serialização.
- **Ação Corretiva Sugerida:**
  Mover toda a lógica de enriquecimento para a camada de serviço de domínio/aplicação ([`ClienteService.java`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/service/cliente/ClienteService.java)):
  ```java
  // No ClienteController:
  // Remover ConsultaRepository e chamar clienteService.listarClientesEnriquecidos(pageable);
  ```

#### [CRÍTICO] URLs Permitidas Expondo Publicamente Endpoints Administrativos de `/usuarios`
- **Arquivo / Linha:** [`Back-end/src/main/java/com/lumina/backend/swagger/SecurityConfiguracao.java#L72`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/swagger/SecurityConfiguracao.java#L72)
- **Documento/Regra Violada:** OWASP Top 10 - Broken Access Control / Princípio do Menor Privilégio.
- **Diagnóstico:** A lista `URLS_PERMITIDAS` contém `"/usuarios"`. Embora o `@PostMapping` possua `@PreAuthorize`, qualquer novo método adicionado ao `UsuarioController` sem anotação explícita de segurança fica automaticamente aberto para acesso anônimo sem token. Apenas endpoints de login (`/usuarios/login/**`) devem ser públicos.
- **Ação Corretiva Sugerida:**
  Remover `"/usuarios"` das rotas liberadas no Spring Security:
  ```java
  // SecurityConfiguracao.java
  private static final String[] URLS_PERMITIDAS = {
          // ...
          "/usuarios/login/**",
          "/usuarios/logout/**",
          // REMOVER: "/usuarios",
          "/alexa/vincular",
          "/error/**"
  };
  ```

#### [CRÍTICO] Falsa Proteção CSRF: Código Contraditório e Filtros Inoperantes
- **Arquivo / Linha:** [`Back-end/src/main/java/com/lumina/backend/swagger/SecurityConfiguracao.java#L84`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/swagger/SecurityConfiguracao.java#L84) e [`#L107-L144`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/swagger/SecurityConfiguracao.java#L107-L144)
- **Documento/Regra Violada:** OWASP Top 10 - Cross-Site Request Forgery (CSRF) & Clean Code (Zero Dead Code).
- **Diagnóstico:** A configuração declara `.csrf(CsrfConfigurer::disable)`, desativando completamente o mecanismo de CSRF do Spring Security. Em seguida, registra classes customizadas `CsrfCookieFilter` e `SpaCsrfTokenRequestHandler` na cadeia de filtros. Como o CSRF está desativado no plano de segurança, essas classes são código morto executado a cada requisição, induzindo os mantenedores ao erro de achar que há proteção ativa contra requisições forjadas.
- **Ação Corretiva Sugerida:**
  Remover o filtro fantasma `CsrfCookieFilter` e a classe utilitária, ou, se o uso de cookies exigir mitigação dupla de CSRF (além do `SameSite=Strict`), ativar explicitamente `.csrf(csrf -> csrf.csrfTokenRepository(...))` de maneira funcional.

#### [MÉDIO] Violação de Coesão Estrutural: Segurança e JWT Contidos no Pacote `swagger`
- **Arquivo / Linha:** [`Back-end/src/main/java/com/lumina/backend/swagger/`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/swagger/)
- **Documento/Regra Violada:** Clean Architecture / Princípio da Responsabilidade Única (SRP).
- **Diagnóstico:** Classes nucleares de controle de autenticação e autorização (`AutenticacaoFilter.java`, `GerenciadorTokenJwt.java`, `SecurityConfiguracao.java`, `AutenticacaoProvider.java`, `AutenticacaoEntryPoint.java`) estão alocadas dentro do pacote `swagger`. A camada de segurança não deve depender conceitualmente nem residir no pacote da documentação OpenAPI.
- **Ação Corretiva Sugerida:**
  Refatorar o pacote para `com.lumina.backend.security` ou `com.lumina.backend.infrastructure.security`, mantendo no pacote `swagger` apenas `SwaggerConfig.java` e customizações de UI.

#### [MÉDIO] EAGER Fetching Generalizado Causando Sobrecarga N+1 no Banco Relacional
- **Arquivo / Linha:** [`Back-end/src/main/java/com/lumina/backend/model/Consulta.java#L21-L63`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/model/Consulta.java#L21-L63) e [`NotificacaoWhatsapp.java#L49-L59`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/model/NotificacaoWhatsapp.java#L49-L59)
- **Documento/Regra Violada:** Boas Práticas de Engenharia JPA/Hibernate & Escalabilidade.
- **Diagnóstico:** As entidades utilizam `FetchType.EAGER` em `@ManyToOne` (cliente, usuário, especialidade, destinatário) e `@ElementCollection` (dentes). Ao recuperar listas de consultas na agenda mensal, o Hibernate executa queries adicionais para cada linha retornada (problema N+1) ou gera produto cartesiano que sobrecarrega a memória da JVM e a CPU do MySQL.
- **Ação Corretiva Sugerida:**
  Alterar os relacionamentos para `FetchType.LAZY` e utilizar consultas com `JOIN FETCH` ou `EntityGraph` apenas nos métodos de repositório onde as entidades associadas são estritamente necessárias.

#### [MÉDIO] Dependência de `LocalDate.now()` no Fuso Padrão do Sistema Operacional
- **Arquivo / Linha:** [`Back-end/src/main/java/com/lumina/backend/controller/ClienteController.java#L305`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/controller/ClienteController.java#L305)
- **Documento/Regra Violada:** [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md) - Regra 2 (Fuso Horário Obrigatório `America/Sao_Paulo`).
- **Diagnóstico:** A busca de consultas futuras utiliza `LocalDate.now()` sem especificar o fuso horário. Na AWS EC2 ou nos containers Docker padrão (onde o SO roda em UTC), entre 21h00 e 23h59 o sistema assume a data do dia seguinte, gerando inconsistências no agendamento e exibição de dados aos dentistas.
- **Ação Corretiva Sugerida:**
  Substituir por:
  ```java
  LocalDate.now(ZoneId.of("America/Sao_Paulo"));
  ```

#### [MÉDIO] Tratamento Inseguro de Upload no S3 Engolindo Exceções Inesperadas
- **Arquivo / Linha:** [`Back-end/src/main/java/com/lumina/backend/service/midia/ClienteMidiaService.java#L150-L153`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/service/midia/ClienteMidiaService.java#L150-L153)
- **Documento/Regra Violada:** Integridade de Dados e Tratamento de Exceções.
- **Diagnóstico:** No método `confirmarUpload`, o bloco `catch (Exception e)` captura qualquer erro genérico de rede, autenticação AWS ou falha no S3 e força o status da mídia para `"ACTIVE"`. Se o upload falhar ou o arquivo não existir, o sistema registrará a mídia como válida, gerando links quebrados posteriormente.
- **Ação Corretiva Sugerida:**
  Tratar apenas exceções esperadas e relançar falhas de infraestrutura:
  ```java
  } catch (NoSuchKeyException e) {
      midia.setStatus("ERROR");
      clienteMidiaRepository.save(midia);
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo não localizado no S3.");
  } catch (S3Exception e) {
      log.error("Falha ao comunicar com o S3: {}", e.getMessage(), e);
      throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Falha de integração com o serviço de arquivos.");
  }
  ```

#### [BAIXO] Retorno de Entidade de Domínio/JPA em Endpoint de Upload de Anamnese
- **Arquivo / Linha:** [`Back-end/src/main/java/com/lumina/backend/controller/AnamneseController.java#L42`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/controller/AnamneseController.java#L42)
- **Documento/Regra Violada:** Encapsulamento de Camadas e DTO Pattern.
- **Diagnóstico:** O endpoint `@PostMapping` retorna diretamente o objeto JPA `Anamnese` em vez do DTO `AnamneseResponse`, acoplando o contrato JSON externo ao modelo interno do banco de dados.
- **Ação Corretiva Sugerida:**
  Converter a entidade retornada via `AnamneseMapper.toDto(anamnese)`.

#### [BAIXO] Ausência de Timeout Configurado no `RestClient` do Google Gemini
- **Arquivo / Linha:** [`Back-end/src/main/java/com/lumina/backend/service/openIA/GeminiAIService.java#L101-L107`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/service/openIA/GeminiAIService.java#L101-L107)
- **Documento/Regra Violada:** Resiliência de Microsserviços e Prevenção de Thread Exhaustion.
- **Diagnóstico:** O `RestClient` utilizado para invocar a API de IA generativa não define timeouts de conexão e leitura. Em caso de instabilidade na API do Google, requisições concorrentes podem reter threads do pool do Tomcat, degradando o backend.
- **Ação Corretiva Sugerida:**
  Configurar `ClientHttpRequestFactory` com timeout explícito (ex.: 15 segundos para conexão e leitura).

---

### 2.2. Front-End

#### [CRÍTICO] Ausência de Suíte de Testes Automatizados e Falha no `npm test`
- **Arquivo / Linha:** [`Front-End/package.json#L6-L11`](file:///home/joao-carlos/Documentos/lumina/Front-End/package.json#L6-L11)
- **Documento/Regra Violada:** [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md) - Seção 2, 3 e Checklist de Entrega ("O pipeline de CI executa em cada push e passa com 100% de sucesso").
- **Diagnóstico:** O arquivo `package.json` não contém a instrução `"test"`. A execução de `npm test` encerra com erro `Missing script: "test"`. Não existem arquivos de teste unitário (`*.test.js` ou `*.spec.jsx`) no código-fonte do frontend, violando a regra de governança de testes automatizados independentes da Lumina.
- **Ação Corretiva Sugerida:**
  Configurar o **Vitest** com React Testing Library e adicionar o script no `package.json`:
  ```json
  "scripts": {
    "test": "vitest run"
  }
  ```

#### [CRÍTICO] Incompatibilidade de Fallback de `API_BASE_URL` em Produção Causando Erro 404
- **Arquivo / Linha:** [`Front-End/src/api/config.js#L1`](file:///home/joao-carlos/Documentos/lumina/Front-End/src/api/config.js#L1)
- **Documento/Regra Violada:** [`DOCUMENTACAO_GERAL_ALTERACOES_ARQUITETURA.md`](file:///home/joao-carlos/Documentos/lumina/DOCUMENTACAO_GERAL_ALTERACOES_ARQUITETURA.md) - Seção 2 e 3.
- **Diagnóstico:** O arquivo define:
  ```javascript
  export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? '/api' : 'http://localhost:8080');
  ```
  O backend removeu o prefixo `/api` de suas rotas (atendendo em `/consultas`, `/clientes`, `/usuarios`). Quando o frontend roda em produção com o fallback `'/api'`, as requisições chegam como `/api/consultas`. Como o NGINX da infraestrutura não faz rewrite e o Spring Boot não possui context-path `/api`, as requisições falham com HTTP 404.
- **Ação Corretiva Sugerida:**
  Padronizar para caminho relativo vazio (`''`), permitindo que as requisições usem os caminhos raiz roteados pelo NGINX:
  ```javascript
  export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
  ```

#### [MÉDIO] Bundle Monolítico sem Code-Splitting / Lazy Loading (1.3 MB)
- **Arquivo / Linha:** [`Front-End/src/App.jsx`](file:///home/joao-carlos/Documentos/lumina/Front-End/src/App.jsx) e compilação do Vite
- **Documento/Regra Violada:** Boas Práticas de Engenharia Web / Performance e Otimização Core Web Vitals.
- **Diagnóstico:** O build de produção gera um chunk único de JavaScript de **1.305 kB** (> 500 kB do limite recomendado pelo Vite). Todas as páginas e bibliotecas pesadas (FullCalendar, Recharts, Zod) são carregadas na primeira renderização, inclusive na tela inicial de Login.
- **Ação Corretiva Sugerida:**
  Implementar divisão de código por rotas com `React.lazy()` e `Suspense`:
  ```jsx
  const Dashboard = React.lazy(() => import('./pages/Dashboard'));
  const Agenda = React.lazy(() => import('./pages/Agenda'));
  ```

#### [MÉDIO] Avisos de Incompatibilidade de Hooks do React Hook Form com React Compiler
- **Arquivo / Linha:** [`Front-End/src/components/ModalEditarPaciente/index.jsx#L39`](file:///home/joao-carlos/Documentos/lumina/Front-End/src/components/ModalEditarPaciente/index.jsx#L39), [`PatientRegistration.jsx#L49`](file:///home/joao-carlos/Documentos/lumina/Front-End/src/components/PatientRegistration/PatientRegistration.jsx#L49) e [`Cadastro/index.jsx#L20`](file:///home/joao-carlos/Documentos/lumina/Front-End/src/pages/Cadastro/index.jsx#L20)
- **Documento/Regra Violada:** Diretrizes do ESLint e Boas Práticas do React 19.
- **Diagnóstico:** O linter reporta warning `react-hooks/incompatible-library`: o uso de `watch()` do React Hook Form dentro do corpo de componentes no React 19 quebra a memoização do React Compiler e pode gerar estados defasados na interface (stale UI).
- **Ação Corretiva Sugerida:**
  Utilizar o hook granular `useWatch({ control, name: 'dataNascimento' })` em substituição ao método `watch` desestruturado do formulário.

#### [BAIXO] Falta de Parametrização Segura de Cookies em Produção
- **Arquivo / Linha:** [`Front-End/src/services/apiClient.js#L19`](file:///home/joao-carlos/Documentos/lumina/Front-End/src/services/apiClient.js#L19)
- **Documento/Regra Violada:** Recomendações de Segurança de Transporte de Sessão.
- **Diagnóstico:** `credentials: 'include'` é utilizado sem verificação se a conexão é HTTPS segura em todos os ambientes.
- **Ação Corretiva Sugerida:**
  Garantir que os certificados TLS/SSL estejam provisionados no Load Balancer da AWS para evitar tráfego de cookies em texto claro via HTTP.

---

### 2.3. Banco-de-dados

#### [CRÍTICO] Divergência Severa de DDL e Dados entre `main` e `develop`
- **Arquivo / Linha:** [`Banco-de-dados/lumina.sql`](file:///home/joao-carlos/Documentos/lumina/Banco-de-dados/lumina.sql)
- **Documento/Regra Violada:** Governança de Versionamento e Consistência de Dados entre Ambientes.
- **Diagnóstico:** A branch `main` possui 1.820 linhas a mais que a branch `develop`. A `main` inclui:
  1. Alteração da coluna `id_notificacao` de `INT` para `BIGINT` na tabela `notificacao_whatsapp` (necessário para compatibilidade com o backend Java `Long idNotificacao`).
  2. Ajustes de colunas de responsáveis legais e números higienizados.
  3. Carga massiva de testes para o pipeline RabbitMQ e histórico analítico para o Dashboard.
  A branch `develop` está completamente defasada, causando falha de integridade referencial se o ambiente de dev for provisionado a partir dela.
- **Ação Corretiva Sugerida:**
  Sincronizar a branch `develop` trazendo as alterações da `main`:
  ```bash
  cd Banco-de-dados
  git checkout develop
  git merge main -m "fix(db): sincronizar lumina.sql da main com develop"
  git push origin develop
  ```

#### [CRÍTICO] Ausência de Idempotência no Script DDL `lumina.sql` Quebrando o CD
- **Arquivo / Linha:** [`Banco-de-dados/lumina.sql#L5-L132`](file:///home/joao-carlos/Documentos/lumina/Banco-de-dados/lumina.sql#L5-L132)
- **Documento/Regra Violada:** Princípio de Idempotência em Automações de Banco de Dados.
- **Diagnóstico:** As declarações de tabelas utilizam `CREATE TABLE` sem a cláusula `IF NOT EXISTS`. Quando o workflow [`.github/workflows/db-seed.yml`](file:///home/joao-carlos/Documentos/lumina/Banco-de-dados/.github/workflows/db-seed.yml) é acionado para aplicar atualizações ou repovoar um banco já existente, o comando `mysql -u root < lumina.sql` falha com `Error 1050: Table 'estado_civil' already exists`, interrompendo o pipeline de implantação.
- **Ação Corretiva Sugerida:**
  Adicionar `IF NOT EXISTS` em todas as tabelas e índices do script:
  ```sql
  CREATE TABLE IF NOT EXISTS estado_civil (...);
  CREATE TABLE IF NOT EXISTS convenio (...);
  ```

#### [MÉDIO] Ausência de Pipeline de CI Obrigatório (`db-ci.yml`)
- **Arquivo / Linha:** [`Banco-de-dados/.github/workflows/`](file:///home/joao-carlos/Documentos/lumina/Banco-de-dados/.github/workflows/)
- **Documento/Regra Violada:** [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md) - Seção 3 e Seção 6.1.
- **Diagnóstico:** O repositório possui `db-cd.yml` e `db-seed.yml`, mas não possui um workflow de validação contínua (`db-ci.yml`). Erros de sintaxe SQL ou falhas no `Dockerfile` só são detectados após o merge ou durante o provisionamento de infraestrutura.
- **Ação Corretiva Sugerida:**
  Criar `.github/workflows/db-ci.yml` executando validação com `sqllineage` ou subindo um container efêmero MySQL no runner para testar o parse do `lumina.sql`.

#### [MÉDIO] Ausência do Arquivo `.gitignore` no Repositório
- **Arquivo / Linha:** [`Banco-de-dados/`](file:///home/joao-carlos/Documentos/lumina/Banco-de-dados)
- **Documento/Regra Violada:** [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md) - Seção 3.
- **Diagnóstico:** O diretório não possui `.gitignore`. Arquivos temporários do MySQL Workbench (`*.bak`), logs e arquivos de ambiente (`.env`) podem ser commitados involuntariamente.
- **Ação Corretiva Sugerida:**
  Criar o arquivo `Banco-de-dados/.gitignore` contendo regras para ferramentas de banco e arquivos de ambiente.

#### [BAIXO] Hash BCrypt Hardcoded Idêntico para Múltiplos Usuários no Seed Data
- **Arquivo / Linha:** [`Banco-de-dados/lumina.sql#L280-L282`](file:///home/joao-carlos/Documentos/lumina/Banco-de-dados/lumina.sql#L280-L282)
- **Documento/Regra Violada:** Boas Práticas de Segurança em Massa de Teste.
- **Diagnóstico:** Todos os usuários de teste compartilham a mesma senha hash hardcoded (`123456`).
- **Ação Corretiva Sugerida:**
  Documentar expressamente que esses hashes são restritos aos ambientes de testes e garantir que senhas em produção sejam geradas aleatoriamente no provisionamento.

---

### 2.4. Data-Pipeline

#### [CRÍTICO] Extração SISAGUA Implementada com Mocks Estáticos em Produção
- **Arquivo / Linha:** [`Data-Pipeline/src/lambda_extracao/index.py#L15-L24`](file:///home/joao-carlos/Documentos/lumina/Data-Pipeline/src/lambda_extracao/index.py#L15-L24)
- **Documento/Regra Violada:** Requisitos de Autenticidade e Integridade do Pipeline de Dados Lakehouse.
- **Diagnóstico:** As constantes `URL_SEMESTRAL` e `URL_MENSAL` contêm reticências literais (`https://dados.gov.br/dataset/.../controle_semestral_2026.csv`). O método `download_and_upload_to_s3` não faz nenhuma requisição HTTP real, gerando uma string estática hardcoded (`dummy_csv = "col1;col2;col3;NO_MUNICIPIO;Município..."`) e persistindo no S3 Bronze. Em demonstrações e auditorias, a extração de dados públicos é simulada.
- **Ação Corretiva Sugerida:**
  Configurar URLs parametrizáveis via variáveis de ambiente e implementar o download em streaming com `urllib.request` ou `requests`.

#### [CRÍTICO] Fragilidade por Índice Posicional e Silent Failure no Job AWS Glue
- **Arquivo / Linha:** [`Data-Pipeline/src/glue_transformacao/job.py#L29-L58`](file:///home/joao-carlos/Documentos/lumina/Data-Pipeline/src/glue_transformacao/job.py#L29-L58)
- **Documento/Regra Violada:** Resiliência de ETL/ELT & Boas Práticas PySpark.
- **Diagnóstico:** O script acessa colunas por índice posicional fixo:
  - Linha 29: `df_semestral.columns[3]`
  - Linha 44: `df_mensal.columns[4]`
  - Linha 52: `df_mensal_filtrado.columns[19]`
  Caso o CSV tenha colunas fora de ordem ou o dummy tenha menos de 20 colunas, o script lança `IndexError`. Além disso, os blocos `except Exception as e` nas linhas 35 e 57 engolem a exceção com um simples `print()`, e o script executa `job.commit()`. O AWS Glue reporta status **SUCCEEDED** enquanto a gravação no S3 Silver falhou por completo.
- **Ação Corretiva Sugerida:**
  Localizar colunas por nome ou verificar o tamanho da lista de colunas, e relançar a exceção (`raise e`) para que o job falhe visivelmente no console da AWS:
  ```python
  if len(df_mensal_filtrado.columns) > 19:
      col_parametro = df_mensal_filtrado.columns[19]
      # processamento...
  else:
      raise ValueError(f"Estrutura inesperada no CSV: apenas {len(df_mensal_filtrado.columns)} colunas encontradas.")
  ```

#### [MÉDIO] Alocação Excessiva de Workers Glue para Cargas Mínimas (Custo Learner Lab)
- **Arquivo / Linha:** [`Data-Pipeline/terraform/variables.tf#L58-L62`](file:///home/joao-carlos/Documentos/lumina/Data-Pipeline/terraform/variables.tf#L58-L62)
- **Documento/Regra Violada:** [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md) - Seção 1 (Prevenção de Esgotamento de Créditos de $100 do Learner Lab).
- **Diagnóstico:** O job do Glue está configurado com `number_of_workers = 2` do tipo `G.1X`. Para arquivos CSV de poucos megabytes, o provisionamento de 2 DPUs consome tempo de boot (~3 a 5 min) e créditos desnecessários da conta de estudante.
- **Ação Corretiva Sugerida:**
  Utilizar `worker_type = "Standard"` ou avaliar migração do script para execução serverless em Lambda caso o volume de dados do município seja inferior a 100 MB.

#### [BAIXO] Fallback Silencioso de Fuso Horário no Script de Extração
- **Arquivo / Linha:** [`Data-Pipeline/src/lambda_extracao/index.py#L36-L40`](file:///home/joao-carlos/Documentos/lumina/Data-Pipeline/src/lambda_extracao/index.py#L36-L40)
- **Documento/Regra Violada:** [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md) - Regra 2.
- **Diagnóstico:** Em caso de erro na obtenção de `ZoneInfo("America/Sao_Paulo")`, o script faz fallback silencioso para `datetime.now()` no fuso do sistema operacional.
- **Ação Corretiva Sugerida:**
  Garantir a presença do pacote `tzdata` nas dependências da Lambda para evitar fallback para UTC.

---

### 2.5. Infraestrutura

#### [CRÍTICO] Chave Privada RSA `.pem` Gravada e Versionada no Repositório
- **Arquivo / Linha:** [`Infraestrutura/localstack/lumina-demo-key.pem`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/localstack/lumina-demo-key.pem) e [`lumina-key-teste.pem`](file:///home/joao-carlos/Documentos/lumina/lumina-key-teste.pem)
- **Documento/Regra Violada:** [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md) - Regra 1, Regra 5 e Seção 3 (`.gitignore` deve ignorar `*.pem`).
- **Diagnóstico:** Chaves privadas RSA completas (`-----BEGIN RSA PRIVATE KEY-----`) encontram-se commitadas no Git. Mesmo que tenham sido criadas para testes ou LocalStack, o versionamento de chaves privadas em repositórios corporativos viola auditorias de DevSecOps e políticas de segurança da informação.
- **Ação Corretiva Sugerida:**
  1. Remover imediatamente os arquivos do índice do Git e do histórico com `git rm --cached`.
  2. Adicionar `*.pem` em todos os arquivos `.gitignore`.
  3. Revogar e recriar qualquer chave utilizada no ambiente cloud.

#### [CRÍTICO] Módulo RabbitMQ e Variáveis de Ambiente Ausentes na Branch `develop`
- **Arquivo / Linha:** [`Infraestrutura/modules/rabbitmq/`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/modules/rabbitmq/) e [`Infraestrutura/modules/backend/main.tf#L64-L77`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/modules/backend/main.tf#L64-L77)
- **Documento/Regra Violada:** Política de Sincronização de Branches e Continuidade de Ambientes (`develop`).
- **Diagnóstico:** O módulo de provisionamento do RabbitMQ e a injeção das variáveis `SPRING_RABBITMQ_HOST`, `SPRING_RABBITMQ_PORT`, `SPRING_RABBITMQ_USERNAME` e `SPRING_RABBITMQ_PASSWORD` existem na branch `main`, mas não foram sincronizados para a `develop`. Ao subir a infraestrutura de desenvolvimento, o Backend não encontra as variáveis, tenta se conectar em `localhost:5672` e quebra o serviço de notificações por WhatsApp.
- **Ação Corretiva Sugerida:**
  Efetuar o merge das alterações de infraestrutura da `main` para a `develop`:
  ```bash
  cd Infraestrutura
  git checkout develop
  git merge main -m "feat(infra): integrar modulo rabbitmq e variaveis de mensageria na develop"
  git push origin develop
  ```

#### [CRÍTICO] Sobrescrita Indevida do NGINX no Frontend Omitindo Rotas Críticas
- **Arquivo / Linha:** [`Infraestrutura/modules/frontend/main.tf#L70`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/modules/frontend/main.tf#L70)
- **Documento/Regra Violada:** [`DOCUMENTACAO_GERAL_ALTERACOES_ARQUITETURA.md`](file:///home/joao-carlos/Documentos/lumina/DOCUMENTACAO_GERAL_ALTERACOES_ARQUITETURA.md) - Seção 1.6 e Consistência entre Módulos.
- **Diagnóstico:** O script de provisionamento da máquina de frontend substitui o `nginx.conf` pelo modelo definido no Terraform:
  ```nginx
  location ~ ^/(tipos-midia|alexa|usuarios|clientes|consultas|convenios|anamnese|anamneses|perfis|especialidades|swagger-ui|v3|actuator|api)
  ```
  Essa regex omite as rotas:
  - `/notificacoes` (essencial para listagem e disparo de mensagens no WhatsApp);
  - `/public` (utilizada na confirmação pública de agendamento por token);
  - Além de não ter a regra de proxy `location /api/ { proxy_pass http://...:8080/; }`.
  Requisições para esses caminhos são capturadas pela rota padrão da SPA (`location / { try_files $uri /index.html; }`) e retornam o código HTML do frontend com status HTTP 200, quebrando o consumo de JSON no cliente.
- **Ação Corretiva Sugerida:**
  Atualizar a regex no `modules/frontend/main.tf` e adicionar a diretiva de rewrite para `/api/`:
  ```nginx
  location ~ ^/(tipos-midia|alexa|usuarios|clientes|consultas|convenios|anamnese|anamneses|perfis|especialidades|notificacoes|public|swagger-ui|v3|actuator) {
      proxy_pass http://${var.backend_endpoint}:8080;
      ...
  }
  location /api/ {
      proxy_pass http://${var.backend_endpoint}:8080/;
      ...
  }
  ```

#### [MÉDIO] Presença de Código Terraform Monolítico Legado e Desatualizado
- **Arquivo / Linha:** [`Infraestrutura/Terraform/`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/Terraform/)
- **Documento/Regra Violada:** [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md) - Seção 1 e Seção 5.
- **Diagnóstico:** O repositório central possui duas estruturas de Terraform concorrentes: a estrutura modular canônica em `environments/{dev,prod,data}` e `modules/`, e a pasta legada `Terraform/` contendo manifestos antigos monolíticos (`compute.tf`, `storage.tf`, `vpc.tf`). Isso causa ambiguidade e risco de execução de código obsoleto.
- **Ação Corretiva Sugerida:**
  Arquivar ou excluir o diretório `Infraestrutura/Terraform/`, consolidando a documentação para orientar o time a utilizar estritamente os ambientes em `environments/`.

#### [MÉDIO] Checkout Fixo de Branches (`ref: 'main'`) nos Workflows de Deploy
- **Arquivo / Linha:** [`Infraestrutura/.github/workflows/terraform-deploy.yml#L66-L73`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/.github/workflows/terraform-deploy.yml#L66-L73)
- **Documento/Regra Violada:** Automação Multi-Repo e Ciclo de Vida de Ambientes de Desenvolvimento.
- **Diagnóstico:** Mesmo quando o usuário aciona o workflow de deploy informando `app_branch: develop`, o step de checkout dos submódulos `Lambda-Alexa` e `Data-Pipeline` está fixado em `ref: 'main'`. Alterações nessas peças na branch `develop` nunca são testadas na infraestrutura de homologação.
- **Ação Corretiva Sugerida:**
  Parametrizar a branch de checkout com `${{ inputs.app_branch }}` com fallback para `main`.

#### [BAIXO] Ausência de Remoção Automática de Lock Files e Diretórios Temporários
- **Arquivo / Linha:** [`Infraestrutura/Terraform/.terraform/`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/Terraform/.terraform/)
- **Documento/Regra Violada:** Boas Práticas de Higiene de Repositórios Git.
- **Diagnóstico:** Existência de diretórios cacheados de provedores Terraform dentro da pasta local.
- **Ação Corretiva Sugerida:**
  Assegurar a limpeza com `git clean -fdX`.

---

### 2.6. Lambda-Alexa

#### [CRÍTICO] Ausência da Variável de Fuso Horário Obrigatória `TZ` na Função Lambda
- **Arquivo / Linha:** [`Lambda-Alexa/terraform/main.tf#L66-L72`](file:///home/joao-carlos/Documentos/lumina/Lambda-Alexa/terraform/main.tf#L66-L72)
- **Documento/Regra Violada:** [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md) - Regra 2 ("Fuso Horário Obrigatório `America/Sao_Paulo` (UTC-3)").
- **Diagnóstico:** O bloco `environment.variables` da função Lambda define `BACKEND_URL`, `SERVICE_EMAIL` e `SERVICE_PASSWORD`, mas não declara a variável `TZ = "America/Sao_Paulo"`. Como a Lambda é provisionada em `us-east-1` (Norte da Virgínia), qualquer cálculo ou formatação de hora no Node.js (`new Date()`, logs ou agendamento de lembretes) opera em UTC, gerando uma defasagem de 3 horas em relação à agenda de consultas da clínica.
- **Ação Corretiva Sugerida:**
  Adicionar a variável de fuso horário no manifesto Terraform:
  ```hcl
  environment {
    variables = {
      BACKEND_URL      = var.backend_url
      SERVICE_EMAIL    = var.service_email
      SERVICE_PASSWORD = var.service_password
      TZ               = "America/Sao_Paulo"
    }
  }
  ```

#### [MÉDIO] Uso de Conta de Dentista Pessoal como "Conta de Serviço" com Fallback Hardcoded
- **Arquivo / Linha:** [`Lambda-Alexa/src/services/luminaApiClient.js#L12-L13`](file:///home/joao-carlos/Documentos/lumina/Lambda-Alexa/src/services/luminaApiClient.js#L12-L13) e [`Lambda-Alexa/terraform/variables.tf#L22-L28`](file:///home/joao-carlos/Documentos/lumina/Lambda-Alexa/terraform/variables.tf#L22-L28)
- **Documento/Regra Violada:** Princípio do Menor Privilégio e Segregação de Contas de Serviço (Service Accounts).
- **Diagnóstico:** Para ultrapassar a barreira de segurança do Spring Security, a Lambda realiza login prévio com e-mail e senha de um dentista real (`john@doe.com` / `123456`), salvando o cookie de sessão no CookieJar, e posteriormente enviando o header `X-Alexa-User-Id`. Se o usuário John Doe for demitido, desativado ou tiver a senha redefinida no painel web, as skills Alexa de todos os dentistas da clínica serão paralisadas simultaneamente.
- **Ação Corretiva Sugerida:**
  Criar um mecanismo de autenticação dedicado para a Skill Alexa no Spring Boot (ex.: assinatura HMAC via Secret compartilhado ou token de máquina para máquina) em vez de simular um login interativo de usuário real.

#### [MÉDIO] Timeout da Lambda Ajustado no Limite Máximo da Alexa (8 segundos)
- **Arquivo / Linha:** [`Lambda-Alexa/terraform/main.tf#L63`](file:///home/joao-carlos/Documentos/lumina/Lambda-Alexa/terraform/main.tf#L63) e [`luminaApiClient.js#L19`](file:///home/joao-carlos/Documentos/lumina/Lambda-Alexa/src/services/luminaApiClient.js#L19)
- **Documento/Regra Violada:** Requisitos de Resposta em Tempo Real da Amazon Alexa Skills Kit (ASK).
- **Diagnóstico:** A Amazon Alexa exige resposta síncrona em no máximo 8 segundos, sob pena de encerrar a sessão com mensagem de erro ao usuário. O timeout da Lambda está cravado em `8s`, e o timeout do cliente Axios está em `6000ms`. Em caso de cold start da Lambda somado à latência de login no backend e consulta ao banco, o tempo total frequentemente ultrapassa os 8s.
- **Ação Corretiva Sugerida:**
  Reduzir o timeout do Axios para 4500ms e assegurar que a Lambda responda prontamente com mensagem de espera ou reprompt caso o backend demore.

#### [BAIXO] Ausência de `.pem` e Variações de `.env` no `.gitignore` da Lambda
- **Arquivo / Linha:** [`Lambda-Alexa/.gitignore`](file:///home/joao-carlos/Documentos/lumina/Lambda-Alexa/.gitignore)
- **Documento/Regra Violada:** [`Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/GUIA_NOVO_REPOSITORIO_COMPONENTE.md) - Seção 3.
- **Diagnóstico:** O arquivo ignora apenas `.env` e não variações como `.env.local`, `.env.test` ou chaves privadas `*.pem`.
- **Ação Corretiva Sugerida:**
  Adicionar `*.pem` e `.env*` no `.gitignore`.

---

## 3. Plano de Ação Recomendado

Para guiar o time de engenharia e lideranças técnicas na remediação dos pontos levantados, o plano de ação foi estruturado em **duas fases sequenciais**: **Quick Wins** (ações imediatas de estabilização sem impacto arquitetural destrutivo) e **Refatorações Estruturais** (melhorias de sustentabilidade e arquitetura de longo prazo).

### 3.1. Fase 1: Quick Wins (Prioridade Alta — Prazo: 1 a 2 dias)

1. **Sincronização Urgente de Branches:**
   - Efetuar o merge da branch `LGPD` para a branch `develop` no `Back-end`, `Front-End` e `Banco-de-dados`.
   - Efetuar o merge da branch `main` para a branch `develop` no `Banco-de-dados` e `Infraestrutura` para que `develop` receba a estrutura atualizada de DDL, tabelas de RabbitMQ e histórico.
2. **Correção do Proxy Reverso NGINX no Terraform:**
   - Adicionar as rotas `/notificacoes`, `/public` e o proxy `/api/` no arquivo [`Infraestrutura/modules/frontend/main.tf`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/modules/frontend/main.tf).
3. **Correção do Fallback de `API_BASE_URL` no Frontend:**
   - Ajustar [`Front-End/src/api/config.js`](file:///home/joao-carlos/Documentos/lumina/Front-End/src/api/config.js) para utilizar caminho relativo padrão (`''`), saneando erros HTTP 404 em produção.
4. **Higienização de Chaves Privadas (DevSecOps):**
   - Excluir do repositório os arquivos `lumina-demo-key.pem` e `lumina-key-teste.pem` e assegurar que `*.pem` esteja em todos os `.gitignore`.
5. **Configuração de Fuso Horário Obrigatório na Lambda Alexa:**
   - Incluir `TZ = "America/Sao_Paulo"` nas variáveis de ambiente em [`Lambda-Alexa/terraform/main.tf`](file:///home/joao-carlos/Documentos/lumina/Lambda-Alexa/terraform/main.tf).
6. **Remoção de Endpoints Públicos Indevidos no Spring Security:**
   - Remover `"/usuarios"` de `URLS_PERMITIDAS` em [`SecurityConfiguracao.java`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/swagger/SecurityConfiguracao.java).
7. **Adição do Script `test` no Frontend:**
   - Incluir script básico de testes no `package.json` do frontend para desimpedir validações de CI.

### 3.2. Fase 2: Refatorações Estruturais (Prioridade Média/Alta — Prazo: 1 a 2 semanas)

1. **Desacoplamento e Clean Architecture no Backend:**
   - Mover a lógica de enriquecimento de consultas e convênios de [`ClienteController.java`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/controller/ClienteController.java) para a camada de serviço.
   - Eliminar a injeção de repositórios em controllers.
   - Mover classes de autenticação, filtros e JWT do pacote `swagger` para um pacote próprio `security`.
2. **Otimização de Performance e Lazy Loading no JPA:**
   - Refatorar relacionamentos `FetchType.EAGER` em [`Consulta.java`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/model/Consulta.java) e [`NotificacaoWhatsapp.java`](file:///home/joao-carlos/Documentos/lumina/Back-end/src/main/java/com/lumina/backend/model/NotificacaoWhatsapp.java) para `FetchType.LAZY`, adicionando queries otimizadas com `JOIN FETCH` nos repositórios.
3. **Resiliência e Eliminação de Mocks no Data Pipeline:**
   - Substituir os mocks estáticos da extração SISAGUA em [`index.py`](file:///home/joao-carlos/Documentos/lumina/Data-Pipeline/src/lambda_extracao/index.py) por rotinas reais de download com URLs parametrizadas.
   - Refatorar o AWS Glue Job para buscar colunas por nome e propagar falhas (`raise e`), eliminando o encerramento falso como sucesso.
4. **Implementação de Suíte de Testes no Front-End:**
   - Configurar Vitest e React Testing Library, criando testes unitários para os componentes críticos (agendamento, login, formulário de anamnese e galeria de mídias).
5. **Autenticação Técnica de Máquina para a Skill Alexa:**
   - Substituir o login interativo por credencial de usuário pessoal (`john@doe.com`) por autenticação baseada em API Key ou assinatura HMAC exclusiva para a Lambda.
6. **Code-Splitting e Otimização do Frontend:**
   - Implementar `React.lazy()` nas rotas de páginas para segmentar o bundle de 1.3 MB em chunks menores sob demanda.
7. **Limpeza de Débito Técnico na Infraestrutura:**
   - Excluir o diretório legado [`Infraestrutura/Terraform/`](file:///home/joao-carlos/Documentos/lumina/Infraestrutura/Terraform/) e centralizar a execução exclusivamente em `environments/`.
