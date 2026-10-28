
import { ShieldCheck, CalendarDays, Users, ClipboardList, Check } from 'lucide-react';
import { useState } from 'react';
import styles from './styles.module.css';

const permissoesTotais = [
  'Todas as Agendas',
  'Upload de Anamneses',
  'Base Geral de Pacientes',
  'Controle Financeiro & Corpo',
];

const regras = [
  {
    id: 'agenda',
    icon: CalendarDays,
    titulo: 'Agenda & Consultas',
    descricao:
      'Acesso restrito ao profissional. O dentista vê apenas a própria agenda e não cria consultas globais para outros profissionais.',
  },
  {
    id: 'pacientes',
    icon: Users,
    titulo: 'Pacientes & Clientes',
    descricao:
      'Vinculado ao histórico. O dentista visualiza apenas as fichas de pacientes com quem tem consulta associada.',
  },
  {
    id: 'prontuarios',
    icon: ClipboardList,
    titulo: 'Prontuários & Anamneses',
    descricao:
      'Histórico clínico restrito aos seus próprios pacientes atendidos.',
  },
];

const dentistasMock = [
  { id: 1, nome: 'Dr. Ana Silva' },
  { id: 2, nome: 'Dr. Carlos Oliveira' },
  { id: 3, nome: 'Dra. Juliana Santos' },
];

const niveisAcesso = [
  {
    id: 'todos',
    titulo: 'Todos os Acessos',
    descricao: 'O dentista terá acesso total a todas as funcionalidades do Lumina',
    ativo: true,
  },
  {
    id: 'restrito',
    titulo: 'Acesso Restrito',
    descricao: 'O dentista terá acesso apenas às funcionalidades liberadas conforme regras definidas',
    ativo: false,
  },
];

export function ControlePermissoes() {
  const [dentistaSelecionado, setDentistaSelecionado] = useState(dentistasMock[0].id);
  const [nivelAcesso, setNivelAcesso] = useState('todos');
  const [showToast, setShowToast] = useState(false);

  const salvarAlteracoes = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Controle de Permissões e Perfis</h1>
      </header>

      <section className={styles.perfilCard}>
        <div className={styles.perfilTop}>
          <span className={styles.perfilIcon}>
            <ShieldCheck size={26} />
          </span>
          <h2 className={styles.perfilNome}>Recepcionista / Administrador</h2>
          <span className={styles.badgeAcesso}>Acesso Total</span>
        </div>

        <p className={styles.perfilDescricao}>
          Controle total sobre o sistema. Permissão para cadastrar, editar,
          reagendar e cancelar qualquer consulta, gerenciar o cadastro completo
          de clientes, convênios e realizar uploads de anamneses sem restrições
          de vínculo médico.
        </p>

        <div className={styles.permissoesGrid}>
          {permissoesTotais.map((permissao) => (
            <div key={permissao} className={styles.permissaoItem}>
              <span className={styles.permissaoIcone}>
                <Check size={14} strokeWidth={3} />
              </span>
              <span className={styles.permissaoTexto}>{permissao}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.regrasSection}>
        <h2 className={styles.sectionTitle}>
          Regras de Acesso e Restrições do Corpo Clínico - Dentistas
        </h2>

        <div className={styles.regrasGrid}>
          {regras.map((regra) => {
            const Icone = regra.icon;

            return (
              <article key={regra.id} className={styles.regraCard}>
                <span className={styles.regraIcon}>
                  <Icone size={20} />
                </span>
                <h3 className={styles.regraTitulo}>{regra.titulo}</h3>
                <p className={styles.regraDescricao}>{regra.descricao}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.permissaoAjusteSection}>
        <div className={styles.ajusteCard}>
          <div className={styles.ajusteHeader}>
            <div>
              <h2 className={styles.ajusteTitle}>Ajuste de Permissões</h2>
              <p className={styles.ajusteSubtitle}>
                Selecione o dentista e altere o nível de acesso
              </p>
            </div>
          </div>

          <div className={styles.ajusteField}>
            <label className={styles.ajusteLabel} htmlFor="dentista-select">
              Dentista
            </label>
            <select
              id="dentista-select"
              className={styles.ajusteSelect}
              value={dentistaSelecionado}
              onChange={(e) => setDentistaSelecionado(Number(e.target.value))}
            >
              {dentistasMock.map((dentista) => (
                <option key={dentista.id} value={dentista.id}>
                  {dentista.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.acessoGlobalSection}>
            <p className={styles.acessoGlobalLabel}>Nível de Acesso</p>
            <div className={styles.acessoGlobalOptions}>
              {niveisAcesso.map((nivel) => {
                const selecionado = nivelAcesso === nivel.id;
                return (
                  <button
                    key={nivel.id}
                    type="button"
                    className={`${styles.acessoGlobalOption} ${
                      selecionado ? styles.acessoGlobalOptionAtivo : ''
                    }`}
                    onClick={() => setNivelAcesso(nivel.id)}
                    aria-pressed={selecionado}
                  >
                    <div className={styles.acessoGlobalOptionHeader}>
                      <span className={styles.acessoGlobalOptionTitle}>
                        {nivel.titulo}
                      </span>
                      {selecionado && (
                        <span className={styles.acessoGlobalCheck}>✓</span>
                      )}
                    </div>
                    <p className={styles.acessoGlobalOptionDescricao}>
                      {nivel.descricao}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className={styles.salvarPermissoesButton}
            onClick={salvarAlteracoes}
          >
            Salvar Permissões
          </button>
        </div>
      </section>

      {showToast && (
        <div className={styles.toast} role="status" aria-live="polite">
          Permissões atualizadas!
        </div>
      )}
    </div>
  );
}

export default ControlePermissoes;
