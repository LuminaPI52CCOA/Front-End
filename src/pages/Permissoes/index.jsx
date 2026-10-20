
import {
  ShieldCheck,
  CalendarDays,
  Users,
  ClipboardList,
  Check,
} from 'lucide-react';
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

export function ControlePermissoes() {

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
          Regras de Acesso e Restrições do Corpo Clínico — Dentistas
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
    </div>
  );
}

export default ControlePermissoes;
