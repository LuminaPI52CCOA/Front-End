import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const mockDentists = [
  { id: 1, name: 'Dr. Carlos Mendes', cro: 'CRO 12345-SP', specialty: 'Ortodontia' },
  { id: 2, name: 'Dra. Ana Paula Silva', cro: 'CRO 67890-RJ', specialty: 'Endodontia' },
  { id: 3, name: 'Dr. Roberto Lima', cro: 'CRO 54321-MG', specialty: 'Periodontia' },
  { id: 4, name: 'Dra. Juliana Costa', cro: 'CRO 98765-RS', specialty: 'Implantodontia' },
];

export function DoctorList({ dentists = mockDentists, totalAtivos = 25 }) {
  const [busca, setBusca] = useState('');

  const dentistasFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return dentists;
    return dentists.filter((d) =>
      d.name.toLowerCase().includes(termo) ||
      d.cro.toLowerCase().includes(termo) ||
      d.specialty.toLowerCase().includes(termo)
    );
  }, [busca, dentists]);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Lista de Dentistas</h1>

      <section className={styles.container}>
        <header className={styles.header}>
          <div className={styles.activeCard}>
            <span className={styles.activeLabel}>DENTISTAS ATIVOS</span>
            <strong className={styles.activeCount}>{totalAtivos}</strong>
          </div>

          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              className={styles.search}
              placeholder="Buscar Dentista..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar dentista"
            />
          </div>
        </header>

        <div className={styles.grid}>
          {dentistasFiltrados.map((dentista) => (
            <article key={dentista.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardLeft}>
                  <h2 className={styles.dentistName}>{dentista.name}</h2>
                  <span className={styles.cro}>{dentista.cro}</span>
                </div>
                <span className={styles.specialtyTag}>{dentista.specialty}</span>
              </div>

              <hr className={styles.divider} />

              <div className={styles.cardBottom}>
                <Link to={`/dentistas/${dentista.id}`} className={styles.profileLink}>
                  Ver Perfil →
                </Link>
              </div>
            </article>
          ))}

          {dentistasFiltrados.length === 0 && (
            <p className={styles.empty}>Nenhum dentista encontrado.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DoctorList;