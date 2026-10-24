import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  CreditCard,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useDoctors } from '../../hooks/useDoctors';
import { deISO, hojeISO } from '../../utils/datas';
import { formatarTelefone } from '../../utils/formatar';
import {
  obterProximaConsulta,
  formatarDataBR,
  ordenarPorProximaConsulta,
} from '../../utils/proximaConsulta';
import { Select } from '../Select';
import { ListStatus } from '../ListStatus';
import styles from './styles.module.css';

const FILTROS_INICIAIS = {
  especialidade: '',
  status: '',
  pacientesHoje: '',
  ordenar: 'proxima-consulta',
};

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const ORDEM_DIAS = [1, 2, 3, 4, 5, 6, 0];

function iniciaisDoNome(nome) {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return `${primeira}${ultima}`.toUpperCase() || '?';
}

function resumoDiasAtendimento(consultas, dentistaId) {
  const dias = new Set();

  consultas.forEach((consulta) => {
    if (String(consulta.dentistaId) !== String(dentistaId) || !consulta.data) return;
    dias.add(deISO(consulta.data).getDay());
  });

  if (dias.size === 0) return 'Agenda não definida';

  return ORDEM_DIAS.filter((dia) => dias.has(dia))
    .map((dia) => DIAS_SEMANA[dia])
    .join(' - ');
}

export function DoctorList() {
  const navigate = useNavigate();
  const { dentistas, consultas, loading, error, reload } = useDoctors();
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);
  const [menuAbertoId, setMenuAbertoId] = useState(null);

  useEffect(() => {
    if (error?.status === 401) navigate('/login');
  }, [error, navigate]);

  useEffect(() => {
    if (!menuAbertoId) return undefined;

    const fecharAoClicarFora = (evento) => {
      if (!evento.target.closest('[data-doctor-actions]')) {
        setMenuAbertoId(null);
      }
    };

    const fecharAoTeclar = (evento) => {
      if (evento.key === 'Escape') setMenuAbertoId(null);
    };

    document.addEventListener('mousedown', fecharAoClicarFora);
    document.addEventListener('keydown', fecharAoTeclar);

    return () => {
      document.removeEventListener('mousedown', fecharAoClicarFora);
      document.removeEventListener('keydown', fecharAoTeclar);
    };
  }, [menuAbertoId]);

  const opcoesEspecialidades = useMemo(() => {
    const lista = Array.from(new Set(dentistas.map((d) => d.especialidade))).filter(Boolean);
    return [
      { value: '', label: 'Todas as especialidades' },
      ...lista.map((esp) => ({ value: esp, label: esp })),
    ];
  }, [dentistas]);

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

  const chipsMobile = [
    { campo: 'status', valor: '', label: 'Todos' },
    { campo: 'status', valor: 'Ativo', label: 'Ativos' },
    { campo: 'status', valor: 'Inativo', label: 'Inativos' },
    { campo: 'pacientesHoje', valor: 'com', label: 'Com pacientes hoje' },
    { campo: 'pacientesHoje', valor: 'sem', label: 'Sem pacientes hoje' },
    ...opcoesEspecialidades.slice(1).map((opcao) => ({
      campo: 'especialidade',
      valor: opcao.value,
      label: opcao.label,
    })),
  ];

  const chipEstaAtivo = (chip) => {
    if (chip.campo === 'status' && chip.valor === '') {
      return !filtros.status && !filtros.especialidade && !filtros.pacientesHoje;
    }
    return filtros[chip.campo] === chip.valor;
  };

  const alternarChip = (campo, valor) => {
    setFiltros((prev) => {
      if (campo === 'status' && valor === '') {
        return { ...prev, status: '', especialidade: '', pacientesHoje: '' };
      }
      return { ...prev, [campo]: prev[campo] === valor ? '' : valor };
    });
  };

  const dentistasFiltrados = useMemo(() => {
    const hoje = hojeISO();
    const termo = busca.trim().toLowerCase();

    const comProxima = dentistas.map((dentista) => {
      const proxima = obterProximaConsulta(consultas, 'dentistaId', dentista.id);
      const totalHoje = consultas.filter(
        (c) => c.data === hoje && c.dentistaId === dentista.id,
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
  }, [busca, filtros, dentistas, consultas]);

  return (
    <div className={styles.page}>
      <header className={styles.mobileTopo}>
        <h1 className={styles.mobileTitulo}>DENTISTAS</h1>
      </header>

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
              placeholder="Buscar por nome ou CRO..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar dentista por nome ou CRO"
            />
          </div>
        </header>

        <div className={styles.chips} role="group" aria-label="Filtros rápidos">
          {chipsMobile.map((chip) => {
            const ativo = chipEstaAtivo(chip);
            return (
              <button
                key={`${chip.campo}-${chip.valor || 'todos'}-${chip.label}`}
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
          {dentistasFiltrados.map((dentista) => {
            const telefoneLimpo = String(dentista.telefone || '').replace(/\D/g, '');
            const menuAberto = menuAbertoId === dentista.id;
            const resumoDias = resumoDiasAtendimento(consultas, dentista.id);

            return (
              <Fragment key={dentista.id}>
                <Link to={`/dentistas/${dentista.id}`} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardLeft}>
                      <h2 className={styles.dentistName}>{dentista.nome}</h2>
                      {dentista.cro && (
                        <span className={styles.cro}>CRO {dentista.cro}</span>
                      )}
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

                <article className={styles.cardMobile}>
                  <div className={styles.cardMobileCabecalho}>
                    <span className={styles.avatarMobile} aria-hidden="true">
                      {iniciaisDoNome(dentista.nome)}
                    </span>
                    <div className={styles.cardMobileNomes}>
                      <div className={styles.cardMobileNomeLinha}>
                        <h2
                          className={styles.dentistNameMobile}
                          title={dentista.nome}
                        >
                          {dentista.nome}
                        </h2>
                        <span
                          className={`${styles.statusBadgeMobile} ${
                            dentista.status === 'Ativo'
                              ? styles.statusAtivo
                              : styles.statusInativo
                          }`}
                        >
                          {dentista.status}
                        </span>
                      </div>
                      <span className={styles.especialidadeMobile}>
                        {dentista.especialidade || 'Clínica Geral'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardMobileCorpo}>
                    <div className={styles.infoLinhaMobile}>
                      <CreditCard
                        size={16}
                        className={styles.infoIconeMobile}
                        aria-hidden="true"
                      />
                      <span className={styles.infoTextoMobile}>
                        CRO {dentista.cro || 'Não informado'}
                      </span>
                    </div>

                    {telefoneLimpo ? (
                      <button
                        type="button"
                        className={`${styles.infoLinhaMobile} ${styles.infoLinhaBotao}`}
                        onClick={() => {
                          window.open(
                            `https://wa.me/${telefoneLimpo}`,
                            '_blank',
                            'noopener,noreferrer',
                          );
                        }}
                        aria-label={`Contatar ${dentista.nome} pelo WhatsApp`}
                      >
                        <Phone
                          size={16}
                          className={styles.infoIconeMobile}
                          aria-hidden="true"
                        />
                        <span className={styles.infoTextoMobile}>
                          {formatarTelefone(dentista.telefone)}
                        </span>
                      </button>
                    ) : (
                      <div className={styles.infoLinhaMobile}>
                        <Phone
                          size={16}
                          className={styles.infoIconeMobile}
                          aria-hidden="true"
                        />
                        <span className={styles.infoTextoMobile}>
                          Telefone não informado
                        </span>
                      </div>
                    )}

                    <div className={styles.infoLinhaMobile}>
                      <CalendarDays
                        size={16}
                        className={styles.infoIconeMobile}
                        aria-hidden="true"
                      />
                      <span className={styles.infoTextoMobile}>{resumoDias}</span>
                    </div>
                  </div>

                  <div className={styles.cardMobileRodape} data-doctor-actions>
                    <button
                      type="button"
                      className={styles.botaoVerPerfil}
                      onClick={() => navigate(`/dentistas/${dentista.id}`)}
                    >
                      Ver Perfil / Agenda
                    </button>
                    <button
                      type="button"
                      className={styles.botaoMaisAcoes}
                      aria-label={`Mais ações para ${dentista.nome}`}
                      aria-haspopup="menu"
                      aria-expanded={menuAberto}
                      onClick={() =>
                        setMenuAbertoId(menuAberto ? null : dentista.id)
                      }
                    >
                      <MoreVertical size={18} />
                    </button>

                    {menuAberto && (
                      <div className={styles.menuAcoes} role="menu">
                        <button
                          type="button"
                          role="menuitem"
                          className={styles.menuAcao}
                          onClick={() => {
                            setMenuAbertoId(null);
                            navigate(`/dentistas/${dentista.id}`, {
                              state: { abrirEdicao: true },
                            });
                          }}
                        >
                          <Pencil size={16} aria-hidden="true" />
                          Editar Cadastro
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className={styles.menuAcao}
                          onClick={() => {
                            setMenuAbertoId(null);
                            navigate('/permissoes');
                          }}
                        >
                          <ShieldCheck size={16} aria-hidden="true" />
                          Permissões
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className={styles.menuAcao}
                          onClick={() => {
                            setMenuAbertoId(null);
                            navigate('/agenda');
                          }}
                        >
                          <Clock size={16} aria-hidden="true" />
                          Ajustar Horários
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              </Fragment>
            );
          })}

          <ListStatus
            loading={loading}
            error={error}
            onRetry={reload}
            forbiddenMessage="Apenas administradores podem ver a lista de dentistas."
          />

          {!loading && !error && dentistasFiltrados.length === 0 && (
            <p className={styles.empty}>Nenhum dentista encontrado.</p>
          )}
        </div>
      </section>

      <button
        type="button"
        className={styles.fab}
        onClick={() => navigate('/cadastro')}
        aria-label="Cadastrar dentista"
        title="Cadastrar Dentista"
      >
        <Plus size={26} />
      </button>
    </div>
  );
}

export default DoctorList;