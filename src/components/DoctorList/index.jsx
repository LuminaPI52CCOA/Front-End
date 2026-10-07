import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DENTISTAS } from '../../data/dentistas';
import { useConsultas } from '../../context/ConsultasContexto';
import { hojeISO } from '../../utils/datas';
import {
  obterProximaConsulta,
  formatarDataBR,
  ordenarPorProximaConsulta,
} from '../../utils/proximaConsulta';
import { Select } from '../Select';
import styles from './styles.module.css';

const FILTROS_INICIAIS = {
  especialidade: '',
  status: '',
  pacientesHoje: '',
  ordenar: 'proxima-consulta',
};

export function DoctorList({ dentists = DENTISTAS }) {
  const { consultas } = useConsultas();
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);

  const opcoesEspecialidades = useMemo(() => {
    const lista = Array.from(new Set(dentists.map((d) => d.especialidade))).filter(Boolean);
    return [
      { value: '', label: 'Todas as especialidades' },
      ...lista.map((esp) => ({ value: esp, label: esp })),
    ];
  }, [dentists]);

  const opcoesStatus = [
    { value: '', label: 'Todos os status' },
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
  ];

  const opcoesPacientesHoje = [
    { value: '', label: 'Todos' },
    { value: 'com', label: 'Com pacientes hoje' },
    { value: 'sem', label: 'Sem pacientes hoje' },
  ];

  const opcoesOrdenacao = [
    { value: 'proxima-consulta', label: 'Consulta mais próxima' },
    { value: 'nome-asc', label: 'Nome (A–Z)' },
    { value: 'nome-desc', label: 'Nome (Z–A)' },
  ];

  const temFiltrosAtivos = Boolean(
    busca ||
      filtros.especialidade ||
      filtros.status ||
      filtros.pacientesHoje ||
      filtros.ordenar !== 'proxima-consulta',
  );

  const limparFiltros = () => {
    setBusca('');
    setFiltros(FILTROS_INICIAIS);
  };

  const dentistasFiltrados = useMemo(() => {
    const hoje = hojeISO();
    const termo = busca.trim().toLowerCase();

    const comProxima = dentists.map((dentista) => {
      const proxima = obterProximaConsulta(consultas, 'dentista', dentista.nome);
      const totalHoje = consultas.filter(
        (c) =>
          c.data === hoje &&
          c.dentista === dentista.nome &&
          c.status !== 'Cancelado',
      ).length;

      return {
        ...dentista,
        status: dentista.status || 'Ativo',
        proximaConsulta: proxima,
        pacientesHoje: totalHoje,
      };
    });

    const filtrados = comProxima.filter((dentista) => {
      if (termo) {
        const correspondeBusca =
          dentista.nome.toLowerCase().includes(termo) ||
          dentista.cro.toLowerCase().includes(termo) ||
          dentista.especialidade.toLowerCase().includes(termo);
        if (!correspondeBusca) return false;
      }

      if (filtros.especialidade && dentista.especialidade !== filtros.especialidade) {
        return false;
      }

      if (filtros.status && dentista.status !== filtros.status) {
        return false;
      }

      if (filtros.pacientesHoje === 'com' && dentista.pacientesHoje === 0) {
        return false;
      }

      if (filtros.pacientesHoje === 'sem' && dentista.pacientesHoje > 0) {
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
  }, [busca, filtros, dentists, consultas]);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Lista de Dentistas</h1>

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
              placeholder="Buscar Dentista..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar dentista"
            />
          </div>
        </header>

        <div className={styles.filtersBar}>
          <div className={styles.filtersGrid}>
            <Select
              label="Especialidade"
              options={opcoesEspecialidades}
              value={filtros.especialidade}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, especialidade: e.target.value }))
              }
              aria-label="Filtrar por especialidade"
            />
            <Select
              label="Status"
              options={opcoesStatus}
              value={filtros.status}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, status: e.target.value }))
              }
              aria-label="Filtrar por status"
            />
            <Select
              label="Pacientes hoje"
              options={opcoesPacientesHoje}
              value={filtros.pacientesHoje}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, pacientesHoje: e.target.value }))
              }
              aria-label="Filtrar por pacientes hoje"
            />
            <Select
              label="Ordenar por"
              options={opcoesOrdenacao}
              value={filtros.ordenar}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, ordenar: e.target.value }))
              }
              aria-label="Ordenar dentistas"
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
          {dentistasFiltrados.map((dentista) => (
            <Link
              key={dentista.id}
              to={`/dentistas/${dentista.id}`}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardLeft}>
                  <h2 className={styles.dentistName}>{dentista.nome}</h2>
                  <span className={styles.cro}>CRO {dentista.cro}</span>
                </div>
                <span className={styles.specialtyTag}>{dentista.especialidade}</span>
              </div>

              <hr className={styles.divider} />

              <div className={styles.cardBottom}>
                <span className={styles.proximaConsulta}>
                  Próxima consulta:{' '}
                  {dentista.proximaConsulta
                    ? formatarDataBR(dentista.proximaConsulta)
                    : 'Sem consulta agendada'}
                </span>
              </div>
            </Link>
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