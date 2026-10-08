import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePatients } from '../../hooks/usePatients';
import {
  obterProximaConsulta,
  formatarDataBR,
  ordenarPorProximaConsulta,
} from '../../utils/proximaConsulta';
import { Select } from '../Select';
import { ListStatus } from '../ListStatus';
import styles from './styles.module.css';

const FILTROS_INICIAIS = {
  plano: '',
  faixaEtaria: '',
  ordenar: 'proxima-consulta',
};

export function PatientList() {
  const navigate = useNavigate();
  const { pacientes, consultas, loading, error, reload } = usePatients();
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);

  useEffect(() => {
    if (error?.status === 401) navigate('/login');
  }, [error, navigate]);

  const opcoesPlanos = [
    { value: '', label: 'Todos os planos' },
    { value: 'Convênio', label: 'Convênio' },
    { value: 'Particular', label: 'Particular' },
  ];

  const opcoesFaixaEtaria = [
    { value: '', label: 'Todas as faixas etárias' },
    { value: 'infantil', label: 'Infantil (< 12 anos)' },
    { value: 'adulto', label: 'Adulto (12 a 59 anos)' },
    { value: 'idoso', label: 'Idoso (60+ anos)' },
  ];

  const opcoesOrdenacao = [
    { value: 'proxima-consulta', label: 'Consulta mais próxima' },
    { value: 'nome-asc', label: 'Nome (A–Z)' },
    { value: 'nome-desc', label: 'Nome (Z–A)' },
  ];

  const temFiltrosAtivos = Boolean(
    busca ||
      filtros.plano ||
      filtros.faixaEtaria ||
      filtros.ordenar !== 'proxima-consulta',
  );

  const limparFiltros = () => {
    setBusca('');
    setFiltros(FILTROS_INICIAIS);
  };

  const pacientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    const comProxima = pacientes.map((paciente) => {
      const proxima = obterProximaConsulta(consultas, 'pacienteId', paciente.id);

      return {
        ...paciente,
        proximaConsulta: proxima,
      };
    });

    const filtrados = comProxima.filter((paciente) => {
      if (termo && !paciente.nome.toLowerCase().includes(termo)) {
        return false;
      }

      if (filtros.plano && paciente.plano !== filtros.plano) {
        return false;
      }

      if (filtros.faixaEtaria && paciente.idade === null) {
        return false;
      }

      if (filtros.faixaEtaria === 'infantil' && paciente.idade >= 12) {
        return false;
      }

      if (
        filtros.faixaEtaria === 'adulto' &&
        (paciente.idade < 12 || paciente.idade >= 60)
      ) {
        return false;
      }

      if (filtros.faixaEtaria === 'idoso' && paciente.idade < 60) {
        return false;
      }

      return true;
    });

    if (filtros.ordenar === 'nome-asc') {
      return filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    if (filtros.ordenar === 'nome-desc') {
      return filtrados.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    return filtrados.sort(ordenarPorProximaConsulta);
  }, [busca, filtros, pacientes, consultas]);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Lista de Pacientes</h1>

      <section className={styles.container}>
        <header className={styles.header}>
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              className={styles.search}
              placeholder="Buscar Paciente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar paciente"
            />
          </div>
        </header>

        <div className={styles.filtersBar}>
          <div className={styles.filtersGrid}>
            <Select
              label="Convênio"
              options={opcoesPlanos}
              value={filtros.plano}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, plano: e.target.value }))
              }
              aria-label="Filtrar por plano ou convênio"
            />
            <Select
              label="Faixa etária"
              options={opcoesFaixaEtaria}
              value={filtros.faixaEtaria}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, faixaEtaria: e.target.value }))
              }
              aria-label="Filtrar por faixa etária"
            />
            <Select
              label="Ordenar por"
              options={opcoesOrdenacao}
              value={filtros.ordenar}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, ordenar: e.target.value }))
              }
              aria-label="Ordenar pacientes"
            />
          </div>

          {temFiltrosAtivos && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={limparFiltros}
            >
              Limpar filtros
            </button>
          )}
        </div>

        <div className={styles.grid}>
          {pacientesFiltrados.map((paciente) => (
            <Link
              key={paciente.id}
              to={`/pacientes/${paciente.id}`}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardLeft}>
                  <h2 className={styles.patientName}>{paciente.nome}</h2>
                  {paciente.idade !== null && (
                    <span className={styles.ageTag}>{paciente.idade} anos</span>
                  )}
                </div>
                <span className={styles.planTag}>{paciente.plano}</span>
              </div>

              <hr className={styles.divider} />

              <div className={styles.cardBottom}>
                <span className={styles.proximaConsulta}>
                  Próxima consulta:{' '}
                  {paciente.proximaConsulta
                    ? formatarDataBR(paciente.proximaConsulta)
                    : 'Sem consulta agendada'}
                </span>
              </div>
            </Link>
          ))}

          <ListStatus
            loading={loading}
            error={error}
            onRetry={reload}
          />

          {!loading && !error && pacientesFiltrados.length === 0 && (
            <p className={styles.empty}>Nenhum paciente encontrado.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default PatientList;
