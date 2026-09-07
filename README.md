# Lumina — Front-End

Sistema de gestão odontológica. Nesta fase, o projeto roda com dados simulados
no cliente (sem backend ou API). Todos os mocks têm uma única fonte de dados,
o que mantém Agenda, Pacientes e Dentistas coerentes entre si.

## Funcionalidades

- **Autenticação simulada** — Cadastro e Login simulam o fluxo no cliente e
  mostram um overlay de sucesso antes de navegar.
- **Dashboard** — métricas e gráficos com o tema visual Lumina.
- **Pacientes** — lista com busca, perfil com contato e agenda (última e
  próxima consulta, derivadas das consultas reais), anamnese e galeria de mídias.
- **Dentistas** — lista com busca, perfil com autorizações e total de pacientes
  do dia (contado das consultas reais).
- **Agenda** — calendário mensal, grade por dia, lista de consultas do dia,
  filtros (especialidade, dentista, paciente) e modal de detalhes com edição e
  mudança de status.
- **Novo Agendamento** — formulário de consulta, calendário, horários
  disponíveis (com verificação de conflito) e odontograma.
- **Cadastro de paciente** — formulário em etapas (stepper) com validação por
  schema e etapa condicional de responsável legal para menores.

## Dependências externas ao React

Tudo que não é React puro e é usado no projeto:

| Camada | Pacote | Uso no projeto |
| --- | --- | --- |
| Bundler / dev server | Vite 8 (+ `@vitejs/plugin-react`) | Executa dev, build e preview; resolve JSX e CSS Modules |
| Roteamento | react-router-dom v7 | Rotas da aplicação, links e navegação em `src/App.jsx` |
| Formulários | react-hook-form | `Cadastro`, `PatientRegistration` (multi-etapa) e `AnamneseForm` |
| Validação | zod + `@hookform/resolvers` | Schemas de validação ligados ao react-hook-form (`patientSchema`, `anamneseSchema`) |
| Máscaras de input | react-imask | Campo CPF do cadastro de paciente (`FormInput`) |
| Ícones | lucide-react | Ícones na Sidebar, Breadcrumbs, Dashboard, MediaGallery e Cadastro de paciente |
| Gráficos | recharts | Gráficos do Dashboard |
| Agenda (grade) | @fullcalendar/core, @fullcalendar/react, @fullcalendar/timegrid | Grade semanal da Agenda |
| Runtime do FullCalendar | preact | Importado em runtime por `@fullcalendar/core` (não usado diretamente) |
| Estilização | CSS Modules (nativo do Vite) | Todos os `styles.module.css` do projeto — não é biblioteca externa |

**DevDependencies**: ESLint 10 + `eslint-plugin-react-hooks` e
`eslint-plugin-react-refresh` para alertas de regras de hooks.

**React 19 em uso**: `ref` como prop (botões dos perfis usam `ref` em
componentes sem `forwardRef`), `useId` (associa labels dos inputs a campos sem
colisão) e automatic JSX transform (não há import padrão de React na maioria dos
arquivos).

## Funcionalidades complexas em detalhe

### Dados mock unificados

Os registros vivem em `src/data/` (`dentistas.js`, `pacientes.js` e `agenda.js`).
As listas, os perfis, os filtros da agenda e o contexto de consultas consomem a
mesma fonte. Consequências:

- Todo dentista e paciente citado em uma consulta existe na lista respectiva.
- A especialidade de cada consulta é igual à especialidade do dentista atendente.
- O telefone da consulta vem do registro do paciente.
- O perfil de paciente e o de dentista resolvem pelo `:id` da rota (com fallback
  para o primeiro registro quando o id não existe).
- A "Agenda do Paciente" (última e próxima consulta) é derivada das consultas
  reais do paciente; a contagem "Total de pacientes hoje" do perfil do dentista
  é contada das consultas do dia (status não cancelado).

O contexto `ConsultasContexto` gera as consultas iniciais relativas à semana
atual (segunda a sexta a partir de `inicioDaSemanaISO`), então a agenda sempre
mostra dados "vivos" na semana em que a aplicação abre.

### Novo Agendamento

A página `NovoAgendamento` combina quatro blocos:

1. **FormulárioAgendamento** — autocomplete de paciente e dentista (mesmas
   listas dos filtros da agenda), especialidade e observações.
2. **CalendarioAgendamento** — seleção da data.
3. **HorariosDisponiveis** — duração do atendimento (15/30/45... minutos) e
   grade de horários. Horários já ocupados pelo dentista no dia são bloqueados
   (`estaOcupado`/`conflita`), inclusive realinhando o horário escolhido quando a
   duração muda.
4. **OdontogramaTratamentos** — mapa de dentes agrupado por tipo, com seleção em
   grupo e opção "pular odontograma".
   A confirmação valida os campos obrigatórios, verifica conflitos e, se tudo
   estiver certo, adiciona a consulta ao contexto e navega para a Agenda.

### Agenda

- **CalendarioGradePrincipal** usa FullCalendar (timeGrid) para a grade semanal.
- **CalendarioSelecao** navega entre meses e seleciona o dia exibido.
- **FiltrosSidebar** filtra por especialidade (Select) e por dentista/paciente
  (AutoComplete), todos com opção "Todos".
- **ListaConsultasDia** lista as consultas do dia ordenadas por horário.
- **ModalDetalhesConsulta** exibe os dados da consulta, permite editar
  telefone/horário/observações e trocar o status com `aria-pressed`.

### Cadastro de paciente em etapas

`PatientRegistration` usa react-hook-form com `FormProvider` e um schema zod
(`patientSchema`) que define os campos de cada etapa (`STEP_FIELDS`). O
`Stepper` permite voltar/avançar com validação do passo atual. Para pacientes
menores, uma etapa extra de responsável legal aparece (`isMinor`) e permite
buscar o responsável por CPF (`LegalGuardianForm`, com `guardianService`).
`FormInput` aplica máscaras via `react-imask`.

### Anamnese

`AnamneseForm` gera o schema de validação dinamicamente a partir de uma lista de
perguntas (com `superRefine` para regras condicionais), ligado ao
react-hook-form.

### Acessibilidade aplicada

- Foco visível padronizado com `:focus-visible` e o token `--foco`.
- `Input`: label ligado via `useId`, `aria-invalid` + `role="alert"` no erro e
  toggle de senha com `aria-label`/`aria-pressed`.
- `ModalDetalhesConsulta` e modais de desativação: `role="dialog"`,
  gerenciamento de foco com `ref`s e fechamento por `Escape`.
- `SuccessOverlay` respeita `prefers-reduced-motion`.

## Estrutura do projeto

```
src/
├── api/                 # Configurações de API (stub)
├── assets/              # Imagens e ícones
├── components/          # Componentes reutilizáveis
│   ├── agenda/          # Subcomponentes da agenda
│   ├── agendamento/     # Subcomponentes do novo agendamento
│   └── PatientRegistration/  # Formulário de paciente em etapas
├── context/             # ConsultasContexto (estado global dos mocks)
├── data/                # Dados mock centralizados (fonte única)
├── pages/               # Páginas (rotas)
├── services/            # Serviços simulados (auth, pacientes, responsável)
└── utils/               # Datas, filtragem e formatação
```

## Rotas

| Rota | Página |
| --- | --- |
| `/` | Redireciona para `/cadastro` |
| `/cadastro` | Cadastro |
| `/login` | Login |
| `/pacientes` | Lista de pacientes |
| `/pacientes/:id` | Perfil do paciente |
| `/pacientes/novo` | Cadastro de paciente |
| `/dentistas` | Lista de dentistas |
| `/dentistas/:id` | Perfil do dentista |
| `/agenda` | Agenda |
| `/novo-agendamento` | Novo agendamento |
| `/dashboard` | Dashboard |

## Design system

A estilização usa CSS Modules puros (sem Tailwind) sobre um camada de design
tokens. Esta seção reúne o conteúdo que antes vivia no `STYLELOG.md`.

### Design tokens

Todos os tokens vivem em `src/index.css`, na pseudo-classe `:root`.

- **Cores de superfície**: `--cor-fundo` (#F5F2EC), `--cor-card` (#FFFFFF),
  `--cor-hover` (#FBF9F5), `--cor-divisao` (#F0F0F0).
- **Dourado (primary)**: `--cor-dourado` (#a97f2b), hover `--cor-dourado-hover`
  (#8E661B), suave `--cor-dourado-suave` (#C9A24B).
- **Bordas**: `--cor-borda` (#D8C696), `--cor-borda-suave` (#EAE0C8),
  `--cor-borda-card` (#F5F2EC).
- **Texto**: `--cor-texto` (#1A1A1A), `--cor-texto-medio` (#444444),
  `--cor-texto-suave` (#666666), `--cor-texto-fraco` (#999999),
  `--cor-placeholder` (#CCCCCC).
- **Semânticas**: erro (#C0392B / hover #A93226 / fundo #FBEAE5), sucesso
  (#2E7D5A, fundo #E4F2E9), atenção (#A9772B, fundo #FBEEDA),
  info (#1A73E8, fundo #E8F0FE).
- **Raios**: `--raio-card` 16px, `--raio-container` 20px, `--raio-controle`
  10px, `--raio-pill` 999px.
- **Espaçamento de formulário**: `--espaco-form` 18px.
- **Sombras**: `--sombra-card` (0px 8px 24px rgba(0,0,0,0.03)),
  `--sombra-container` (0px 10px 30px rgba(0,0,0,0.04)).
- **Foco**: `--foco` (0 0 0 3px rgba(201,162,75,0.35)).
- **Fonte**: `--font-base` (Poppins, via Google Fonts).

### Componentes compartilhados

- **Button** (`src/components/Button`) — variantes `primary | outline | ghost |
  danger`, prop `full`, ícone com `aria-hidden`, `className` extra e `ref`.
- **Input** (`src/components/Input`) — label com `htmlFor` ligado por `useId`,
  erro com `aria-invalid` + `role="alert"`, toggle de senha e máscara de CPF
  embutida.
- **Select** (`src/components/Select`) — label ligado ao campo, seta decorativa
  com `aria-hidden` e `pointer-events: none`.
- **SuccessOverlay** (`src/components/SuccessOverlay`) — overlay de sucesso
  compartilhado entre Login e Cadastro, com `prefers-reduced-motion`.

### Dependências removidas na padronização

| Pacote | Motivo |
| --- | --- |
| tailwindcss | Estilização migrada para CSS Modules + tokens |
| @tailwindcss/vite | Plugin remanescente do Tailwind |
| styled-components | Sem uso no projeto |

> `preact` foi mantido porque `@fullcalendar/core` o importa em runtime.

### Log de padronização visual

Histórico do esforço que unificou o visual do projeto:

- `src/index.css` — tokens criados; import do Tailwind removido; fonte unificada
  (Poppins); regras globais apenas em `body`.
- `Button`, `Input`, `Select` e `SuccessOverlay` — criados/redesenhados e
  adotados nas telas.
- Login e Cadastro — migrados para os componentes compartilhados; `Login.css`
  removido (regras globais eliminadas); `SuccessOverlay` extraído.
- Listas e perfis de Pacientes e Dentistas — CSS tokenizado; botões via
  `Button`; perfis resolvem por `:id`.
- Dashboard — tokenizado; abas de navegação unificadas com os perfis.
- Agenda e Novo Agendamento — integrados ao sistema de tokens (paleta, fonte,
  raios e foco); bug de CSS aninhado corrigido; classes mortas removidas.
- Todos os `styles.module.css` — fonte via `var(--font-base)`.

## Como rodar

Pré-requisito: Node.js.

```bash
npm install      # instala as dependências
npm run dev      # servidor de desenvolvimento (http://localhost:5173)
npm run build    # build de produção
npm run preview  # pré-visualiza o build
npm run lint     # lint do ESLint
```

## Convenções

- Texto de UI, comentários e mensagens de commit em português.
- Componentes compartilhados de UI ficam em `src/components/`.
- Formulários simulam a submissão no cliente (sem integração de API ainda).
- Padrão de foco acessível via `:focus-visible` com tokens.
- CSS Modules em `styles.module.css`; sem Tailwind para estilização.