import { useState } from 'react';
import styles from './styles.module.css';

const pacienteMock = {
  id: 1,
  nome: 'Mariana Souza',
  idade: 32,
  plano: 'Convênio',
  contato: {
    telefone: '11912345678',
    email: 'mariana.souza@gmail.com',
    endereco: {
      rua: 'Rua Nome da Rua, 222',
      bairro: 'Nome do Bairro',
    },
  },
  agenda: {
    ultimaConsulta: {
      data: '15 ABR 2026',
      descricao: 'Consulta de rotina',
    },
    proximaConsulta: {
      data: '01 MAI 2026',
      descricao: 'Limpeza e profilaxia',
      confirmada: true,
    },
  },
};

const abas = [
  { id: 'visao-geral', rotulo: 'Visão Geral' },
  { id: 'anamnese', rotulo: 'Anamnese' },
  { id: 'fotos-midias', rotulo: 'Fotos e Mídias' },
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

export function PatientProfileOverview({ paciente = pacienteMock }) {
  const [abaAtiva, setAbaAtiva] = useState('visao-geral');
  const { contato, agenda } = paciente;

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Perfil do Paciente</h1>

      <section className={styles.headerCard}>
        <div className={styles.patientInfo}>
          <h2 className={styles.patientName}>{paciente.nome}</h2>
          <span className={styles.patientAge}>{paciente.idade} anos</span>
          <span className={styles.planTag}>{paciente.plano}</span>
        </div>

        <div className={styles.headerActions}>
          <button type="button" className={styles.outlineButton}>
            <IconeLapis />
            Editar Perfil
          </button>
          <button type="button" className={styles.outlineButton}>
            <IconeDesativar />
            Desativar Perfil
          </button>
        </div>
      </section>

      <nav className={styles.tabsBar} role="tablist" aria-label="Seções do perfil">
        {abas.map((aba) => (
          <button
            key={aba.id}
            type="button"
            role="tab"
            aria-selected={abaAtiva === aba.id}
            className={`${styles.tabButton} ${abaAtiva === aba.id ? styles.tabActive : ''}`}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {aba.rotulo}
          </button>
        ))}
      </nav>

      {abaAtiva === 'visao-geral' ? (
        <div className={styles.contentGrid}>
          <article className={styles.card}>
            <header className={styles.cardTitleRow}>
              <span className={styles.cardIcon}>
                <IconeTelefone />
              </span>
              <h3>Contato do Paciente</h3>
            </header>

            <dl className={styles.contactList}>
              <div className={styles.fieldGroup}>
                <dt className={styles.fieldLabel}>Telefone:</dt>
                <dd className={styles.fieldValue}>{formatarTelefone(contato.telefone)}</dd>
              </div>

              <div className={styles.fieldGroup}>
                <dt className={styles.fieldLabel}>Email:</dt>
                <dd className={styles.fieldValue}>{contato.email}</dd>
              </div>

              <div className={styles.fieldGroup}>
                <dt className={styles.fieldLabel}>Endereço:</dt>
                <dd className={styles.fieldValue}>{contato.endereco.rua}</dd>
                <dd className={styles.fieldValueSecondary}>{contato.endereco.bairro}</dd>
              </div>
            </dl>
          </article>

          <article className={styles.card}>
            <header className={styles.cardTitleRow}>
              <span className={styles.cardIcon}>
                <IconeAgenda />
              </span>
              <h3>Agenda do Paciente</h3>
            </header>

            <ol className={styles.timeline}>
              <li className={styles.timelineItem}>
                <p className={styles.timelineLabel}>Última consulta</p>
                <div className={`${styles.consultBox} ${styles.consultPast}`}>
                  <strong className={styles.consultDate}>{agenda.ultimaConsulta.data}</strong>
                  <span className={styles.consultDesc}>{agenda.ultimaConsulta.descricao}</span>
                </div>
              </li>

              <li className={styles.timelineItem}>
                <p className={styles.timelineLabel}>Próxima consulta</p>
                <div className={`${styles.consultBox} ${styles.consultNext}`}>
                  <button type="button" className={styles.iconEdit} aria-label={`Editar consulta de ${agenda.proximaConsulta.data}`}>
                    <IconeLapis />
                  </button>
                  <strong className={styles.consultDate}>{agenda.proximaConsulta.data}</strong>
                  <span className={styles.consultDesc}>{agenda.proximaConsulta.descricao}</span>
                  <footer className={styles.consultFooter}>
                    <span className={agenda.proximaConsulta.confirmada ? styles.statusPill : styles.statusPillPending}>
                      {agenda.proximaConsulta.confirmada ? 'Confirmado' : 'Pendente'}
                    </span>
                  </footer>
                </div>
              </li>
            </ol>
          </article>
        </div>
      ) : (
        <section className={styles.emptyPanel}>
          <p className={styles.emptyText}>
            Conteúdo da aba “{abas.find((aba) => aba.id === abaAtiva)?.rotulo}” em breve.
          </p>
        </section>
      )}
    </div>
  );
}

export default PatientProfileOverview;
