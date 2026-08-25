import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles.module.css';

const mockDentists = [
  {
    id: 1,
    name: 'Dr. Carlos Mendes',
    cro: '12345-SP',
    specialty: 'ORTODONTIA',
    phone: '11912345678',
    email: 'carlos.mendes@gmail.com',
    todayPatients: 5,
    authorizations: ['Implantes', 'Extração', 'Próteses', 'Cirurgias'],
  },
  {
    id: 2,
    name: 'Dra. Ana Paula Silva',
    cro: '67890-RJ',
    specialty: 'ENDODONTIA',
    phone: '21987654321',
    email: 'ana.silva@gmail.com',
    todayPatients: 3,
    authorizations: ['Tratamento de Canal', 'Retratamento', 'Cirurgia Endodôntica'],
  },
  {
    id: 3,
    name: 'Dr. Roberto Lima',
    cro: '54321-MG',
    specialty: 'PERIODONTIA',
    phone: '31912345678',
    email: 'roberto.lima@gmail.com',
    todayPatients: 4,
    authorizations: ['Raspagem', 'Cirurgia Periodontal', 'Enxerto Gengival'],
  },
  {
    id: 4,
    name: 'Dra. Juliana Costa',
    cro: '98765-RS',
    specialty: 'IMPLANTODONTIA',
    phone: '51998765432',
    email: 'juliana.costa@gmail.com',
    todayPatients: 6,
    authorizations: ['Implantes Unitários', 'Carga Imediata', 'Enxerto Ósseo', 'Prótese Sobre Implante'],
  },
];

function formatarTelefone(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  if (!resto) return ddd ? `(${ddd}` : '';
  const prefixo = resto.slice(0, resto.length > 8 ? 5 : 4);
  const sufixo = resto.slice(resto.length > 8 ? 5 : 4);
  return `(${ddd}) ${prefixo}-${sufixo}`;
}

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

export function DoctorProfileOverview({ dentist: dentistProp }) {
  const { id } = useParams();
  const [confirmarDesativacao, setConfirmarDesativacao] = useState(false);
  const desativarBotaoRef = useRef(null);
  const cancelarRef = useRef(null);
  const confirmarRef = useRef(null);

  const dentist = dentistProp || mockDentists.find((d) => String(d.id) === String(id)) || mockDentists[0];

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
      <h1 className={styles.pageTitle}>Perfil do Dentista</h1>

      <section className={styles.headerCard}>
        <div className={styles.dentistInfo}>
          <h2 className={styles.dentistName}>{dentist.name}</h2>
          <p className={styles.cro}>CRO: {dentist.cro}</p>
          <p className={styles.specialty}>{dentist.specialty}</p>
        </div>

        <div className={styles.headerActions}>
          <button type="button" className={styles.outlineButton}>
            <IconeLapis />
            Editar Perfil
          </button>
          <button
            type="button"
            ref={desativarBotaoRef}
            className={styles.outlineButton}
            onClick={() => setConfirmarDesativacao(true)}
          >
            <IconeDesativar />
            Desativar Perfil
          </button>
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
            <a href="#" className={styles.viewLink}>
              Visualizar agenda →
            </a>
          </header>
          <div className={styles.agendaBox}>
            <p>Total de pacientes hoje:</p>
            <strong className={styles.patientCount}>{dentist.todayPatients}</strong>
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
              <dd className={styles.fieldValue}>{formatarTelefone(dentist.phone)}</dd>
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
            {dentist.authorizations.map((auth, i) => (
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
              O perfil de {dentist.name} ficará inativo. É possível reativá-lo depois.
            </p>
            <div className={styles.modalAcoes}>
              <button
                type="button"
                ref={cancelarRef}
                className={styles.outlineButton}
                onClick={fecharConfirmacao}
              >
                Cancelar
              </button>
              <button
                type="button"
                ref={confirmarRef}
                className={styles.botaoPerigo}
                onClick={desativarPerfil}
              >
                Desativar Perfil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorProfileOverview;