import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CalendarDays, Clock, Mail, Pencil, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '../Button';
import { useDoctor } from '../../hooks/useDoctor';
import { updateDoctor, deactivateDoctor } from '../../services/doctorService';
import { useConsultas } from '../../context/ConsultasContexto';
import { hojeISO } from '../../utils/datas';
import { formatarTelefone } from '../../utils/formatar';
import { AlexaIntegrationCard } from '../AlexaIntegrationCard';
import { BloqueioAgendaCard } from '../BloqueioAgendaCard';
import { ModalEditarDentista } from '../ModalEditarDentista';
import { ErrorBoundary } from '../ErrorBoundary';
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

function iniciaisDoNome(nome) {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return `${primeira}${ultima}`.toUpperCase() || '?';
}

const ABAS_MOBILE = [
  { id: 'agenda', label: 'Agenda do Dia' },
  { id: 'especialidades', label: 'Especialidades/Procedimentos' },
  { id: 'escala', label: 'Escala & Horários' },
  { id: 'desempenho', label: 'Desempenho/Consultas' },
];

export function DoctorProfileOverview({ dentist: dentistProp }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmarDesativacao, setConfirmarDesativacao] = useState(false);
  const [editandoPerfil, setEditandoPerfil] = useState(
    () => Boolean(location.state?.abrirEdicao),
  );
  const [abaAtivaMobile, setAbaAtivaMobile] = useState('agenda');
  const desativarBotaoRef = useRef(null);
  const cancelarRef = useRef(null);
  const confirmarRef = useRef(null);

  const { dentist: loadedDentist, loading, error, reload } = useDoctor(id);
  const dentist = dentistProp || loadedDentist;

  const { consultas } = useConsultas();

  const pacientesHoje = useMemo(
    () => {
      if (!dentist?.nome) return 0;
      return consultas.filter(
        (consulta) =>
          consulta.data === hojeISO() &&
          consulta.dentista === dentist.nome &&
          consulta.status !== 'Cancelado',
      ).length;
    },
    [consultas, dentist],
  );

  const consultasHojeDentista = useMemo(() => {
    if (!dentist?.nome) return [];
    return consultas
      .filter(
        (consulta) =>
          consulta.data === hojeISO() &&
          consulta.dentista === dentist.nome,
      )
      .sort((a, b) => (a.inicio || '').localeCompare(b.inicio || ''));
  }, [consultas, dentist]);

  const obterNomePaciente = (pacienteId) => {
    if (!pacienteId) return 'Paciente não identificado';
    try {
      const pacientesMod = import.meta.glob('../../data/pacientes.js', { eager: true });
      const mod = pacientesMod['../../data/pacientes.js'];
      if (mod && typeof mod.nomeDoPaciente === 'function') {
        return mod.nomeDoPaciente(pacienteId);
      }
    } catch {
      return `Paciente #${pacienteId}`;
    }
    return `Paciente #${pacienteId}`;
  };

  const fecharConfirmacao = useCallback(() => {
    setConfirmarDesativacao(false);
    desativarBotaoRef.current?.focus();
  }, []);

  const desativarPerfil = async () => {
    try {
      if (dentist?.id) {
        await deactivateDoctor(dentist.id);
        reload();
      }
    } catch (err) {
      console.error('Erro ao desativar perfil:', err);
    } finally {
      fecharConfirmacao();
    }
  };

  const abrirEdicao = () => {
    setEditandoPerfil(true);
  };

  const fecharEdicao = () => {
    setEditandoPerfil(false);
  };

  const salvarEdicao = async (dadosAtualizados) => {
    try {
      if (dentist?.id) {
        await updateDoctor(dentist.id, dadosAtualizados);
        reload();
      }
    } catch (err) {
      console.error('Erro ao salvar dentista:', err);
      alert(err.message || 'Erro ao atualizar dados do dentista');
    } finally {
      fecharEdicao();
    }
  };

  useEffect(() => {
    if (!location.state?.abrirEdicao) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);

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
      <header className={styles.pageHeader}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/dentistas')}
          aria-label="Voltar para lista de dentistas"
        >
          <IconeVoltar />
        </button>
        <h1 className={styles.pageTitle}>Perfil do Dentista</h1>
      </header>

      {loading && <p className={styles.loading}>Carregando perfil do dentista…</p>}
      {error && <p className={styles.error} role="alert">Não foi possível carregar os dados do dentista.</p>}

      {!loading && !error && dentist && (
        <>
          <section className={styles.headerMobileCard}>
            <div className={styles.headerMobileTop}>
              <span className={styles.avatarMobile} aria-hidden="true">
                {iniciaisDoNome(dentist.nome)}
              </span>
              <div className={styles.headerMobileInfo}>
                <div className={styles.headerMobileNomeLinha}>
                  <h2 className={styles.headerMobileNome}>{dentist.nome}</h2>
                  <span
                    className={`${styles.headerMobileBadge} ${
                      dentist.status === 'Ativo'
                        ? styles.headerMobileBadgeAtivo
                        : styles.headerMobileBadgeInativo
                    }`}
                  >
                    {dentist.status}
                  </span>
                </div>
                <div className={styles.headerMobileMeta}>
                  <span>CRO {dentist.cro || 'Não informado'}</span>
                  <span>•</span>
                  <span>{dentist.especialidade || 'Clínica Geral'}</span>
                </div>
                <p className={styles.headerMobileTurno}>
                  <Clock size={14} aria-hidden="true" />
                  Carga horária/Turno: conforme agenda
                </p>
              </div>
            </div>
            <div className={styles.headerMobileContatos}>
              <button
                type="button"
                className={styles.contatoBotao}
                onClick={() => {
                  if (dentist.telefone) {
                    const limpo = String(dentist.telefone).replace(/\D/g, '');
                    window.open(`https://wa.me/${limpo}`, '_blank', 'noopener,noreferrer');
                  }
                }}
                disabled={!dentist.telefone}
              >
                <Phone size={16} aria-hidden="true" />
                {formatarTelefone(dentist.telefone) || 'Telefone não informado'}
              </button>
              <a
                className={`${styles.contatoBotao} ${styles.contatoBotaoLink}`}
                href={dentist.email ? `mailto:${dentist.email}` : undefined}
                aria-disabled={!dentist.email}
              >
                <Mail size={16} aria-hidden="true" />
                {dentist.email || 'E-mail não informado'}
              </a>
            </div>
          </section>

          <section className={styles.headerCard}>
            <div className={styles.dentistInfo}>
              <h2 className={styles.dentistName}>{dentist.nome}</h2>
              <p className={styles.cro}>CRO: {dentist.cro || 'Não informado'}</p>
              <p className={styles.specialty}>{dentist.especialidade || 'Clínica Geral'}</p>
            </div>

            <div className={styles.headerActions}>
              <Button variant="outline" type="button" onClick={abrirEdicao}>
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

          <nav className={styles.tabsBarDesktop} role="tablist" aria-label="Seções do perfil">
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

          <nav className={styles.tabsBarMobile} role="tablist" aria-label="Seções do perfil">
            <div className={styles.tabsScroll}>
              {ABAS_MOBILE.map((aba) => (
                <button
                  key={aba.id}
                  type="button"
                  role="tab"
                  aria-selected={abaAtivaMobile === aba.id}
                  className={`${styles.tabButtonMobile} ${
                    abaAtivaMobile === aba.id ? styles.tabButtonMobileAtivo : ''
                  }`}
                  onClick={() => setAbaAtivaMobile(aba.id)}
                >
                  {aba.label}
                </button>
              ))}
            </div>
          </nav>

          <div className={styles.mobileAcoesRapidas}>
            <button
              type="button"
              className={styles.botaoAcaoPrincipal}
              onClick={() => navigate('/agenda')}
            >
              <CalendarDays size={18} aria-hidden="true" />
              Ver Agenda Completa
            </button>
            <div className={styles.mobileAcoesSecundarias}>
              <button type="button" className={styles.botaoAcaoSecundario} onClick={abrirEdicao}>
                <Pencil size={16} aria-hidden="true" />
                Editar Perfil
              </button>
              <button
                type="button"
                className={styles.botaoAcaoSecundario}
                onClick={() => navigate('/permissoes')}
              >
                <ShieldCheck size={16} aria-hidden="true" />
                Ajustar Permissões
              </button>
            </div>
          </div>

          {abaAtivaMobile === 'agenda' && (
            <div className={styles.mobilePanel}>
              <article className={styles.cardMobile}>
                <header className={styles.cardMobileHeader}>
                  <h3>Agenda do Dia</h3>
                  <span>{consultasHojeDentista.length} consulta(s)</span>
                </header>
                <div className={styles.cardMobileBody}>
                  {consultasHojeDentista.length === 0 ? (
                    <p className={styles.vazioMobile}>Nenhuma consulta agendada para hoje.</p>
                  ) : (
                    consultasHojeDentista.map((consulta) => (
                      <div key={consulta.id} className={styles.consultaItemMobile}>
                        <div className={styles.consultaHorario}>
                          <Clock size={16} aria-hidden="true" />
                          <span>{consulta.inicio}</span>
                        </div>
                        <div className={styles.consultaInfo}>
                          <p className={styles.consultaPaciente}>
                            {obterNomePaciente(consulta.pacienteId)}
                          </p>
                          <p className={styles.consultaProcedimento}>
                            {consulta.procedimento || consulta.especialidade || 'Atendimento'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </article>
            </div>
          )}

          {abaAtivaMobile === 'especialidades' && (
            <div className={styles.mobilePanel}>
              <article className={styles.cardMobile}>
                <header className={styles.cardMobileHeader}>
                  <h3>Especialidades/Procedimentos</h3>
                </header>
                <div className={styles.cardMobileBody}>
                  <div className={styles.chipsMobile}>
                    {(dentist.autorizacoes || []).map((auth, i) => (
                      <span key={i} className={styles.chipMobile}>
                        {auth}
                      </span>
                    ))}
                    <span className={styles.chipMobile}>{dentist.especialidade || 'Clínica Geral'}</span>
                  </div>
                </div>
              </article>
            </div>
          )}

          {abaAtivaMobile === 'escala' && (
            <div className={styles.mobilePanel}>
              <article className={styles.cardMobile}>
                <header className={styles.cardMobileHeader}>
                  <h3>Escala & Horários</h3>
                </header>
                <div className={styles.cardMobileBody}>
                  <div className={styles.escalaLista}>
                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dia) => (
                      <div key={dia} className={styles.escalaItem}>
                        <span className={styles.escalaDia}>{dia}</span>
                        <span className={styles.escalaHorario}>08:00 - 18:00</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          )}

          {abaAtivaMobile === 'desempenho' && (
            <div className={styles.mobilePanel}>
              <article className={styles.cardMobile}>
                <header className={styles.cardMobileHeader}>
                  <h3>Desempenho/Consultas</h3>
                </header>
                <div className={styles.cardMobileBody}>
                  <div className={styles.desempenhoGrid}>
                    <div className={styles.desempenhoCard}>
                      <p>Consultas hoje</p>
                      <strong>{pacientesHoje}</strong>
                    </div>
                    <div className={styles.desempenhoCard}>
                      <p>Total na agenda</p>
                      <strong>{consultas.length}</strong>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          )}

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
                  <dd className={styles.fieldValue}>{formatarTelefone(dentist.telefone) || 'Não informado'}</dd>
                </div>
                <div className={styles.fieldGroup}>
                  <dt className={styles.fieldLabel}>Email:</dt>
                  <dd className={styles.fieldValue}>{dentist.email || 'Não informado'}</dd>
                </div>
              </dl>
            </article>

            <AlexaIntegrationCard dentist={dentist} />

            <BloqueioAgendaCard dentista={dentist} dentist={dentist} />

            <article className={`${styles.card} ${styles.cardFullWidth}`}>
              <h3 className={styles.cardTitle}>Autorizações e Especializações</h3>
              <div className={styles.authGrid}>
                {(dentist.autorizacoes || []).map((auth, i) => (
                  <button key={i} type="button" className={styles.authItem}>
                    <span className={styles.checkIcon} aria-hidden="true">✓</span>
                    {auth}
                  </button>
                ))}
              </div>
            </article>
          </div>
        </>
      )}

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

      {editandoPerfil && (
        <ErrorBoundary fallback={<div>Erro ao abrir modal de edição</div>}>
          <ModalEditarDentista
            dentist={dentist}
            onCancelar={fecharEdicao}
            onSalvar={salvarEdicao}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}

export default DoctorProfileOverview;