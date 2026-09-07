import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../Button';
import { DENTISTAS } from '../../data/dentistas';
import { useConsultas } from '../../context/ConsultasContexto';
import { hojeISO } from '../../utils/datas';
import { formatarTelefone } from '../../utils/formatar';
import styles from './styles.module.css';

const IconeLapis = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IconeDesativar = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="m5.6 5.6 12.8 12.8" />
  </svg>
);

const IconeTelefone = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconeAgenda = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const IconeVoltar = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export function DoctorProfileOverview({ dentist: dentistProp }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmarDesativacao, setConfirmarDesativacao] = useState(false);
  const desativarBotaoRef = useRef(null);
  const cancelarRef = useRef(null);
  const confirmarRef = useRef(null);

  const dentist = dentistProp || DENTISTAS.find((d) => String(d.id) === String(id)) || DENTISTAS[0];

  const { consultas } = useConsultas();

  const pacientesHoje = useMemo(
    () =>
      consultas.filter(
        (consulta) =>
          consulta.data === hojeISO() &&
          consulta.dentista === dentist.nome &&
          consulta.status !== 'Cancelado',
      ).length,
    [consultas, dentist],
  );

  const fecharConfirmacao = useCallback(() => {
    setConfirmarDesativacao(false);
    desativarBotaoRef.current?.focus();
  }, []);

  const desativarPerfil = () => {
    console.log('Perfil desativado (simulado)');
    fecharConfirmacao();
  };

  useEffect(() => {
    if (!confirmarDesativacao) return undefined;

    cancelarRef.current?.focus();

    const aoTeclar = (event) => {
      if (event.key === 'Escape') {
        fecharConfirmacao();
        return;
      }
      if (event.key !== 'Tab') return;
      event.preventDefault();
      if (document.activeElement === confirmarRef.current) {
        cancelarRef.current?.focus();
      } else {
        confirmarRef.current?.focus();
      }
    };

    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [confirmarDesativacao, fecharConfirmacao]);

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate('/dentistas')}
        aria-label="Voltar para lista de dentistas"
      >
        <IconeVoltar />
      </button>
      <h1 className={styles.pageTitle}>Perfil do Dentista</h1>

      <section className={styles.headerCard}>
        <div className={styles.dentistInfo}>
          <h2 className={styles.dentistName}>{dentist.nome}</h2>
          <p className={styles.cro}>CRO: {dentist.cro}</p>
          <p className={styles.specialty}>{dentist.especialidade}</p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="outline" type="button">
            <IconeLapis />
            Editar Perfil
          </Button>
          <Button
            variant="outline"
            type="button"
            ref={desativarBotaoRef}
            onClick={() => setConfirmarDesativacao(true)}
          >
            <IconeDesativar />
            Desativar Perfil
          </Button>
        </div>
      </section>

      <nav className={styles.tabsBar} role="tablist" aria-label="Seções do perfil">
        <button
          type="button"
          role="tab"
          id="aba-visao-geral"
          aria-selected="true"
          aria-controls="painel-visao-geral"
          tabIndex={0}
          className={`${styles.tabButton} ${styles.tabActive}`}
        >
          Visão Geral
        </button>
      </nav>

      <div
        className={styles.contentGrid}
        role="tabpanel"
        id="painel-visao-geral"
        aria-labelledby="aba-visao-geral"
        tabIndex={0}
      >
        <article className={styles.card}>
          <header className={styles.cardTitleRow}>
            <span className={styles.cardIcon}>
              <IconeAgenda />
            </span>
            <h3>Agenda</h3>
            <Link to="/agenda" className={styles.viewLink}>
              Visualizar agenda →
            </Link>
          </header>
          <div className={styles.agendaBox}>
            <p>Total de pacientes hoje:</p>
            <strong className={styles.patientCount}>{pacientesHoje}</strong>
          </div>
        </article>

        <article className={styles.card}>
          <header className={styles.cardTitleRow}>
            <span className={styles.cardIcon}>
              <IconeTelefone />
            </span>
            <h3>Contato do Dentista</h3>
          </header>
          <dl className={styles.contactInfo}>
            <div className={styles.fieldGroup}>
              <dt className={styles.fieldLabel}>Telefone:</dt>
              <dd className={styles.fieldValue}>{formatarTelefone(dentist.telefone)}</dd>
            </div>
            <div className={styles.fieldGroup}>
              <dt className={styles.fieldLabel}>Email:</dt>
              <dd className={styles.fieldValue}>{dentist.email}</dd>
            </div>
          </dl>
        </article>

        <article className={`${styles.card} ${styles.cardFullWidth}`}>
          <h3 className={styles.cardTitle}>Autorizações e Especializações</h3>
          <div className={styles.authGrid}>
            {dentist.autorizacoes.map((auth, i) => (
              <button key={i} type="button" className={styles.authItem}>
                <span className={styles.checkIcon} aria-hidden="true">✓</span>
                {auth}
              </button>
            ))}
          </div>
        </article>
      </div>

      {confirmarDesativacao && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) fecharConfirmacao();
          }}
        >
          <div
            className={styles.modalBox}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-desativar"
            aria-describedby="descricao-desativar"
          >
            <h2 id="titulo-desativar" className={styles.modalTitulo}>
              Desativar Perfil?
            </h2>
            <p id="descricao-desativar" className={styles.modalTexto}>
              O perfil de {dentist.nome} ficará inativo. É possível reativá-lo depois.
            </p>
            <div className={styles.modalAcoes}>
              <Button
                variant="outline"
                type="button"
                ref={cancelarRef}
                onClick={fecharConfirmacao}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                type="button"
                ref={confirmarRef}
                onClick={desativarPerfil}
              >
                Desativar Perfil
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorProfileOverview;