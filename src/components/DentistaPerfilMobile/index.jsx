import { useNavigate } from 'react-router-dom';
import { BloqueioAgendaCard } from '../BloqueioAgendaCard';
import { Button } from '../Button';
import styles from './styles.module.css';

const IconeVoltar = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const IconeCro = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconeCalendario = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const IconeUsuario = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconeAgenda = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const IconeLapis = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

function iniciaisDoNome(nome) {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return `${primeira}${ultima}`.toUpperCase() || '?';
}

function formatarCro(cro) {
  if (!cro) return 'CRO não informado';
  return String(cro).trim().toUpperCase().startsWith('CRO')
    ? cro
    : `CRO ${cro}`;
}

export function DentistaPerfilMobile({
  dentista,
  onEditar,
  voltarPara = '/agenda',
  mostrarVoltar = true,
}) {
  const navigate = useNavigate();
  const nome = dentista?.nome || 'Dentista';
  const especialidade = dentista?.especialidade || 'Clínica Geral';
  const consultasHoje = dentista?.consultasHoje ?? 0;
  const pacientesVinculados = dentista?.pacientesVinculados ?? 0;

  const editarPerfil = onEditar || (() => navigate('/permissoes'));

  return (
    <div className={styles.dentistaProfileMobile}>
      <header className={styles.dentistaHeader}>
        {mostrarVoltar && (
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(voltarPara)}
            aria-label="Voltar para agenda"
          >
            <IconeVoltar />
          </button>
        )}
        <h1 className={styles.dentistaTitle}>Meu Perfil</h1>
      </header>

      <section className={styles.dentistaCard}>
        <div className={styles.dentistaAvatar}>
          <span className={styles.avatarText}>{iniciaisDoNome(nome)}</span>
        </div>
        <p className={styles.dentistaSaudacao}>Bem-vindo de volta</p>
        <h2 className={styles.dentistaName}>{nome}</h2>
        <div className={styles.dentistaMeta}>
          <span className={styles.dentistaBadge}>
            Dentista / {especialidade}
          </span>
        </div>
        <p className={styles.dentistaCro}>
          <IconeCro />
          {formatarCro(dentista?.cro)}
        </p>
      </section>

      <section className={styles.dentistaMetrics} aria-label="Resumo do perfil">
        <div className={styles.metricCard}>
          <span className={styles.metricIcon} aria-hidden="true">
            <IconeCalendario />
          </span>
          <span className={styles.metricNumber}>{consultasHoje}</span>
          <span className={styles.metricLabel}>Consultas de Hoje</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricIcon} aria-hidden="true">
            <IconeUsuario />
          </span>
          <span className={styles.metricNumber}>{pacientesVinculados}</span>
          <span className={styles.metricLabel}>Meus Pacientes Vinculados</span>
        </div>
      </section>

      <section className={styles.dentistaActions} aria-label="Ações do perfil">
        <Button
          variant="primary"
          type="button"
          full
          onClick={() => navigate('/agenda')}
        >
          <IconeAgenda />
          Acessar Agenda
        </Button>
        <Button
          variant="outline"
          type="button"
          full
          onClick={() => navigate('/pacientes')}
        >
          <IconeUsuario />
          Meus Pacientes
        </Button>
        <Button
          variant="outline"
          type="button"
          full
          onClick={editarPerfil}
        >
          <IconeLapis />
          Editar Informações Profissionais
        </Button>
        <Button
          variant="outline"
          type="button"
          full
          onClick={() => navigate('/agenda')}
        >
          <IconeCalendario />
          Gerenciar Horários de Atendimento
        </Button>
      </section>

      <section className={styles.dentistaBloqueio} aria-label="Bloqueio de agenda">
        <BloqueioAgendaCard dentista={dentista} />
      </section>
    </div>
  );
}

export default DentistaPerfilMobile;
