import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, CalendarDays, CreditCard, MoreVertical } from 'lucide-react';
import { usePatients } from '../../hooks/usePatients';
import {
  obterProximaConsulta,
  formatarDataBR,
  ordenarPorProximaConsulta,
} from '../../utils/proximaConsulta';
import { formatarTelefone, formatarCpf } from '../../utils/formatar';
import { Select } from '../Select';
import { ListStatus } from '../ListStatus';
import { Pagination } from '../Pagination';
import styles from './styles.module.css';

const FILTROS_INICIAIS = {
  plano: '',
  faixaEtaria: '',
  ordenar: 'nome-asc',
};

function iniciaisDoNome(nome) {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return `${primeira}${ultima}`.toUpperCase() || '?';
}

function rotuloStatus(paciente) {
  if (paciente.status) return { texto: paciente.status, tipo: 'acompanhamento' };
  if (paciente.proximaConsulta) return { texto: 'Ativo', tipo: 'ativo' };
  return { texto: 'Sem retorno', tipo: 'inativo' };
}

const OPCOES_TAMANHO_PAGINA = [6, 9, 12];

export function PatientList() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(6);

  const ordenacaoBackend = filtros.ordenar === 'nome-desc' ? 'nome,desc' : 'nome,asc';

  const { pacientes, consultas, pageInfo, loading, error, reload } = usePatients({
    page: paginaAtual,
    size: itensPorPagina,
    sort: ordenacaoBackend,
    nome: busca,
  });

  useEffect(() => {
    if (error?.status === 401) navigate('/login');
  }, [error, navigate]);

  const isForbidden = error?.status === 403;

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
    { value: 'nome-asc', label: 'Nome (A–Z)' },
    { value: 'nome-desc', label: 'Nome (Z–A)' },
    { value: 'proxima-consulta', label: 'Consulta mais próxima' },
  ];

  const chipsMobile = [
    { campo: 'plano', valor: '', label: 'Todos' },
    { campo: 'plano', valor: 'Convênio', label: 'Convênio' },
    { campo: 'plano', valor: 'Particular', label: 'Particular' },
    { campo: 'faixaEtaria', valor: 'infantil', label: 'Infantil' },
    { campo: 'faixaEtaria', valor: 'adulto', label: 'Adulto' },
    { campo: 'faixaEtaria', valor: 'idoso', label: 'Idoso' },
  ];

  const temFiltrosAtivos = Boolean(
    busca ||
      filtros.plano ||
      filtros.faixaEtaria ||
      filtros.ordenar !== 'nome-asc',
  );

  const limparFiltros = () => {
    setBusca('');
    setFiltros(FILTROS_INICIAIS);
    setPaginaAtual(0);
  };

  const alternarChip = (campo, valor) => {
    setFiltros((prev) => {
      const jaAtivo = prev[campo] === valor;
      if (campo === 'plano') {
        return { ...prev, plano: jaAtivo ? '' : valor };
      }
      return { ...prev, faixaEtaria: jaAtivo ? '' : valor };
    });
  };

  const pacientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    const comProxima = pacientes.map((paciente) => {
      const proxima =
        paciente.proximaConsulta ??
        obterProximaConsulta(consultas, 'pacienteId', paciente.id);

      return {
        ...paciente,
        proximaConsulta: proxima,
      };
    });

    const filtrados = comProxima.filter((paciente) => {
      const alvo = `${paciente.nome} ${paciente.cpf || ''} ${paciente.telefone || ''}`.toLowerCase();
      if (termo && !alvo.includes(termo)) {
        return false;
      }

      if (filtros.plano) {
        if (filtros.plano === 'Particular' && paciente.plano !== 'Particular') {
          return false;
        }
        if (filtros.plano === 'Convênio' && paciente.plano === 'Particular') {
          return false;
        }
        if (
          filtros.plano !== 'Particular' &&
          filtros.plano !== 'Convênio' &&
          paciente.plano !== filtros.plano
        ) {
          return false;
        }
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
      <h1 className={styles.mobileTitulo}>PACIENTES</h1>
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
              placeholder="Buscar por nome, CPF ou telefone..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(0);
              }}
              aria-label="Buscar paciente"
            />
          </div>
        </header>

        <div className={styles.chips} role="group" aria-label="Filtros rápidos">
          {chipsMobile.map((chip) => {
            const ativo = filtros[chip.campo] === chip.valor;
            return (
              <button
                key={`${chip.campo}-${chip.valor || 'todos'}`}
                type="button"
                className={`${styles.chip}${ativo ? ` ${styles.chipAtivo}` : ''}`}
                aria-pressed={ativo}
                onClick={() => alternarChip(chip.campo, chip.valor)}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className={styles.filtersBar}>
          <div className={styles.filtersGrid}>
            <Select
              label="Convênio"
              options={opcoesPlanos}
              value={filtros.plano}
              onChange={(e) => {
                setFiltros((prev) => ({ ...prev, plano: e.target.value }));
                setPaginaAtual(0);
              }}
              aria-label="Filtrar por plano ou convênio"
            />
            <Select
              label="Faixa etária"
              options={opcoesFaixaEtaria}
              value={filtros.faixaEtaria}
              onChange={(e) => {
                setFiltros((prev) => ({ ...prev, faixaEtaria: e.target.value }));
                setPaginaAtual(0);
              }}
              aria-label="Filtrar por faixa etária"
            />
            <Select
              label="Ordenar por"
              options={opcoesOrdenacao}
              value={filtros.ordenar}
              onChange={(e) => {
                setFiltros((prev) => ({ ...prev, ordenar: e.target.value }));
                setPaginaAtual(0);
              }}
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
          {pacientesFiltrados.map((paciente) => {
            const status = rotuloStatus(paciente);
            const telefoneLimpo = String(paciente.telefone || '').replace(/\D/g, '');
            const temWhatsApp = Boolean(telefoneLimpo);

            return (
              <div key={paciente.id} className={styles.cardMobile}>
                <div className={styles.cardMobileCabecalho}>
                  <span className={styles.avatarMobile} aria-hidden="true">
                    {iniciaisDoNome(paciente.nome)}
                  </span>
                  <div className={styles.cardMobileNomes}>
                    <div className={styles.cardMobileNomeLinha}>
                      <h2 className={styles.patientNameMobile} title={paciente.nome}>
                        {paciente.nome}
                      </h2>
                      <span className={`${styles.statusBadgeMobile} ${styles[`status_${status.tipo}`]}`}>
                        {status.texto}
                      </span>
                    </div>
                    {paciente.idade !== null && (
                      <span className={styles.ageTagMobile}>{paciente.idade} anos</span>
                    )}
                  </div>
                </div>

                <div className={styles.cardMobileCorpo}>
                  {paciente.telefone && (
                    <button
                      type="button"
                      className={styles.infoLinhaMobile}
                      onClick={(evento) => {
                        evento.preventDefault();
                        evento.stopPropagation();
                        if (temWhatsApp) {
                          window.open(`https://wa.me/${telefoneLimpo}`, '_blank', 'noopener,noreferrer');
                        } else {
                          window.location.href = `tel:${telefoneLimpo}`;
                        }
                      }}
                      aria-label={`Contatar ${paciente.nome} pelo WhatsApp ou telefone`}
                    >
                      <Phone size={16} className={styles.infoIconeMobile} aria-hidden="true" />
                      <span className={styles.infoTextoMobile}>{formatarTelefone(paciente.telefone)}</span>
                    </button>
                  )}
                  <div className={styles.infoLinhaMobile}>
                    <CalendarDays size={16} className={styles.infoIconeMobile} aria-hidden="true" />
                    <span className={styles.infoTextoMobile}>
                      {paciente.proximaConsulta
                        ? formatarDataBR(paciente.proximaConsulta)
                        : 'Sem consulta agendada'}
                    </span>
                  </div>
                  {paciente.cpf && (
                    <div className={styles.infoLinhaMobile}>
                      <CreditCard size={16} className={styles.infoIconeMobile} aria-hidden="true" />
                      <span className={styles.infoTextoMobile}>{formatarCpf(paciente.cpf)}</span>
                    </div>
                  )}
                </div>

                <div className={styles.cardMobileRodape}>
                  <button
                    type="button"
                    className={styles.botaoVerProntuario}
                    onClick={() => navigate(`/pacientes/${paciente.id}`)}
                  >
                    Ver Prontuário
                  </button>
                  <button
                    type="button"
                    className={styles.botaoMaisAcoes}
                    aria-label="Mais ações"
                    onClick={(evento) => {
                      evento.preventDefault();
                      evento.stopPropagation();
                      navigate(`/pacientes/${paciente.id}`);
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          <ListStatus
            loading={loading}
            error={error}
            onRetry={reload}
          />

          {isForbidden && (
            <p className={styles.forbidden} role="alert">
              Acesso restrito à recepção/administração.
            </p>
          )}

          {!loading && !error && !isForbidden && pacientesFiltrados.length === 0 && (
            <p className={styles.empty}>Nenhum paciente encontrado.</p>
          )}
        </div>

        {!loading && !error && !isForbidden && pageInfo.totalElements > 0 && (
          <footer className={styles.paginationBar} aria-label="Paginação de pacientes">
            <div className={styles.paginationInfo}>
              <span>
                Mostrando{' '}
                <strong>
                  {pageInfo.offset + 1}–
                  {Math.min(pageInfo.offset + pacientesFiltrados.length, pageInfo.totalElements)}
                </strong>{' '}
                de <strong>{pageInfo.totalElements}</strong> pacientes
              </span>

              <label className={styles.pageSizeSelector}>
                <span>Por página:</span>
                <select
                  value={itensPorPagina}
                  onChange={(e) => {
                    setItensPorPagina(Number(e.target.value));
                    setPaginaAtual(0);
                  }}
                  aria-label="Quantidade de pacientes por página"
                >
                  {OPCOES_TAMANHO_PAGINA.map((qtd) => (
                    <option key={qtd} value={qtd}>
                      {qtd}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Pagination
              paginaAtual={paginaAtual}
              totalPages={pageInfo.totalPages}
              onChange={setPaginaAtual}
            />
          </footer>
        )}
      </section>
    </div>
  );
}

export default PatientList;
