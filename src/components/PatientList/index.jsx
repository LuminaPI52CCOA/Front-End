import { useMemo, useState } from 'react';
import styles from './styles.module.css';

const pacientesIniciais = [
  { id: 1, nome: 'Mariana Souza', idade: 32 },
  { id: 2, nome: 'Rafael Almeida', idade: 45 },
  { id: 3, nome: 'Beatriz Lima', idade: 28 },
  { id: 4, nome: 'Carlos Eduardo', idade: 51 },
  { id: 5, nome: 'Fernanda Costa', idade: 37 },
  { id: 6, nome: 'João Pedro Martins', idade: 19 },
];

export function PatientList({
  pacientes = pacientesIniciais,
  totalAtivos = 892,
}) {
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
      <h1 className={styles.pageTitle}>Perfil do Paciente</h1>

      <section className={styles.container}>
        <header className={styles.header}>
          <div className={styles.activeCard}>
            <span className={styles.activeLabel}>Pacientes Ativos</span>
            <strong className={styles.activeCount}>{totalAtivos}</strong>
          </div>

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
                <a
                  href={`/pacientes/${paciente.id}`}
                  className={styles.profileLink}
                >
                  Ver Perfil →
                </a>
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
