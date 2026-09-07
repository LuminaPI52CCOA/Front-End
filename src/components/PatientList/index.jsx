import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PACIENTES } from '../../data/pacientes';
import styles from './styles.module.css';

export function PatientList({ pacientes = PACIENTES }) {
  const [busca, setBusca] = useState('');

  const pacientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return pacientes;
    return pacientes.filter((paciente) =>
      paciente.nome.toLowerCase().includes(termo),
    );
  }, [busca, pacientes]);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Lista de Pacientes</h1>

      <section className={styles.container}>
        <header className={styles.header}>
          <input
            type="search"
            className={styles.search}
            placeholder="Buscar Paciente..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            aria-label="Buscar paciente"
          />
        </header>

        <div className={styles.grid}>
          {pacientesFiltrados.map((paciente) => (
            <article key={paciente.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h2 className={styles.patientName}>{paciente.nome}</h2>
                <span className={styles.ageTag}>{paciente.idade} anos</span>
              </div>

              <div className={styles.cardBottom}>
                <span className={styles.status}>Ativo</span>
                <Link
                  to={`/pacientes/${paciente.id}`}
                  className={styles.profileLink}
                >
                  Ver Perfil →
                </Link>
              </div>
            </article>
          ))}

          {pacientesFiltrados.length === 0 && (
            <p className={styles.empty}>Nenhum paciente encontrado.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default PatientList;
