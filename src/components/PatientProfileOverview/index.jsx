import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { PROCEDIMENTOS } from '../../data/agenda';
import { useConsultas } from '../../context/ConsultasContexto';
import { usePacientes } from '../../context/PacientesContexto';
import { hojeISO } from '../../utils/datas';
import { formatarTelefone } from '../../utils/formatar';
import styles from './styles.module.css';
import AnamneseForm from '../AnamneseForm';
import MediaGallery from '../MediaGallery';
import FormularioAgendamento from '../agendamento/FormularioAgendamento';
import ModalEditarPaciente from '../ModalEditarPaciente';

const abas = [
  { id: 'visao-geral', rotulo: 'Visão Geral' },
  { id: 'anamnese', rotulo: 'Anamnese' },
  { id: 'fotos-midias', rotulo: 'Fotos e Mídias' },
];

const formatoData = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatarData(valor) {
  const data = new Date(`${valor}T00:00:00`);
  const partes = Object.fromEntries(
    formatoData.formatToParts(data).map((parte) => [parte.type, parte.value]),
  );
  return `${partes.day} ${partes.month} ${partes.year}`;
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

const IconeVoltar = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const IconeCalendario = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export function PatientProfileOverview({ paciente: pacienteProp }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('visao-geral');
  const [anamneseIniciada, setAnamneseIniciada] = useState(false);
  const [confirmarDesativacao, setConfirmarDesativacao] = useState(false);
  const [editarConsulta, setEditarConsulta] = useState(null);
  const [rascunhoEdicao, setRascunhoEdicao] = useState(null);
  const [editarPaciente, setEditarPaciente] = useState(false);
  const [perfilAtualizado, setPerfilAtualizado] = useState(false);
  const tabRefs = useRef([]);
  const desativarBotaoRef = useRef(null);
  const cancelarRef = useRef(null);
  const confirmarRef = useRef(null);
  const editarBotaoRef = useRef(null);

  const { pacientes, atualizarPaciente } = usePacientes();

  const paciente =
    useMemo(() => {
      if (pacienteProp) return pacienteProp;
      return pacientes.find((item) => String(item.id) === String(id)) ?? pacientes[0];
    }, [pacienteProp, pacientes, id]);
  const { contato } = paciente;

  const { consultas, atualizarConsulta } = useConsultas();

  useEffect(() => {
    if (!perfilAtualizado) return undefined;
    const timer = setTimeout(() => setPerfilAtualizado(false), 4000);
    return () => clearTimeout(timer);
  }, [perfilAtualizado]);

  const ultimaEProxima = useMemo(() => {
    const doPaciente = consultas
      .filter(
        (consulta) =>
          String(consulta.pacienteId) === String(paciente.id) &&
          consulta.status !== 'Cancelado',
      )
      .sort((a, b) => `${a.data} ${a.inicio}`.localeCompare(`${b.data} ${b.inicio}`));

    const passadas = doPaciente.filter((consulta) => consulta.data < hojeISO());
    const vindouras = doPaciente.filter(
      (consulta) =>
        consulta.data >= hojeISO() && consulta.status !== 'Finalizada',
    );

    return {
      ultima: passadas[passadas.length - 1] ?? null,
      proxima: vindouras[0] ?? null,
    };
  }, [consultas, paciente.id]);

  const descricaoDe = (consulta) =>
    consulta.procedimento
      ? `${consulta.especialidade} — ${consulta.procedimento}`
      : consulta.especialidade;

  const fecharConfirmacao = useCallback(() => {
    setConfirmarDesativacao(false);
    desativarBotaoRef.current?.focus();
  }, []);

  const abrirEditarPaciente = useCallback(() => {
    setPerfilAtualizado(false);
    setEditarPaciente(true);
  }, []);

  const fecharEditarPaciente = useCallback(() => {
    setEditarPaciente(false);
    editarBotaoRef.current?.focus();
  }, []);

  const salvarPaciente = useCallback(
    (dados) => {
      atualizarPaciente(paciente.id, dados);
      setEditarPaciente(false);
      setPerfilAtualizado(true);
    },
    [atualizarPaciente, paciente.id],
  );

  const desativarPerfil = () => {
    console.log('Perfil desativado (simulado)');
    fecharConfirmacao();
  };

  const abrirEditarConsulta = useCallback((consulta) => {
    setEditarConsulta(consulta);
    setRascunhoEdicao({
      pacienteId: consulta.pacienteId,
      dentista: consulta.dentista,
      especialidade: consulta.especialidade,
      observacoes: consulta.observacoes,
    });
  }, []);

  const fecharEditarConsulta = useCallback(() => {
    setEditarConsulta(null);
    setRascunhoEdicao(null);
  }, []);

  const aoMudarCampoEdicao = useCallback((campo, valor) => {
    setRascunhoEdicao((atual) => {
      if (!atual) return atual;
      return { ...atual, [campo]: campo === 'pacienteId' ? Number(valor) : valor };
    });
  }, []);

  const aoSalvarEdicao = useCallback(() => {
    if (editarConsulta && rascunhoEdicao) {
      atualizarConsulta(editarConsulta.id, {
        pacienteId: rascunhoEdicao.pacienteId,
        dentista: rascunhoEdicao.dentista,
        especialidade: rascunhoEdicao.especialidade,
        procedimento: PROCEDIMENTOS[rascunhoEdicao.especialidade] ?? '',
        observacoes: rascunhoEdicao.observacoes,
      });
    }
    fecharEditarConsulta();
  }, [editarConsulta, rascunhoEdicao, atualizarConsulta, fecharEditarConsulta]);

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

  const selecionarAba = (id) => {
    setAbaAtiva(id);
    if (id === 'anamnese') setAnamneseIniciada(true);
  };

  const aoTeclarNaAba = (event, indice) => {
    const total = abas.length;
    let destino = null;

    if (event.key === 'ArrowRight') destino = (indice + 1) % total;
    if (event.key === 'ArrowLeft') destino = (indice - 1 + total) % total;
    if (event.key === 'Home') destino = 0;
    if (event.key === 'End') destino = total - 1;

    if (destino !== null) {
      event.preventDefault();
      selecionarAba(abas[destino].id);
      tabRefs.current[destino]?.focus();
    }
  };

const formatarDataHora = (data, hora) => {
    const d = new Date(`${data}T00:00:00`);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
    const ano = d.getFullYear();
    return `${dia} ${mes}. ${ano} às ${hora}`;
  };

return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/pacientes')}
          aria-label="Voltar para lista de pacientes"
        >
          <IconeVoltar />
        </button>
        <h1 className={styles.pageTitle}>Perfil do Paciente</h1>
      </header>

      <section className={styles.headerCard}>
        <div className={styles.patientInfo}>
          <h2 className={styles.patientName}>{paciente.nome}</h2>
          <span className={styles.patientAge}>{paciente.idade} anos</span>
          <span className={styles.planTag}>{paciente.plano}</span>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="outline"
            type="button"
            ref={editarBotaoRef}
            onClick={abrirEditarPaciente}
          >
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

      <nav className={styles.tabsBar} role="tablist" aria-label="Seções do perfil">
        {abas.map((aba, indice) => (
          <button
            key={aba.id}
            ref={(el) => {
              tabRefs.current[indice] = el;
            }}
            type="button"
            role="tab"
            id={`aba-${aba.id}`}
            aria-selected={abaAtiva === aba.id}
            aria-controls={`painel-${aba.id}`}
            tabIndex={abaAtiva === aba.id ? 0 : -1}
            className={`${styles.tabButton} ${abaAtiva === aba.id ? styles.tabActive : ''}`}
            onClick={() => selecionarAba(aba.id)}
            onKeyDown={(event) => aoTeclarNaAba(event, indice)}
          >
            {aba.rotulo}
          </button>
        ))}
      </nav>

      {abaAtiva === 'visao-geral' && (
        <div
          className={styles.contentGrid}
          role="tabpanel"
          id="painel-visao-geral"
          aria-labelledby="aba-visao-geral"
          tabIndex={0}
        >
          <article className={styles.nextAppointmentCard}>
            <header className={styles.nextAppointmentHeader}>
              <div className={styles.nextAppointmentTitle}>
                <span className={styles.cardIcon}>
                  <IconeCalendario />
                </span>
                <h3>Próxima Consulta</h3>
              </div>
            </header>

            {ultimaEProxima.proxima ? (
              <div className={styles.nextAppointmentContent}>
                <div className={styles.nextAppointmentGrid}>
                  <div className={styles.infoGroup}>
                    <dt className={styles.fieldLabel}>Data e Horário</dt>
                    <dd className={styles.fieldValue}>
                      {formatarDataHora(ultimaEProxima.proxima.data, ultimaEProxima.proxima.inicio)}
                    </dd>
                  </div>

                  <div className={styles.infoGroup}>
                    <dt className={styles.fieldLabel}>Dentista Responsável</dt>
                    <dd className={styles.fieldValue}>{ultimaEProxima.proxima.dentista}</dd>
                  </div>

                  <div className={styles.infoGroup}>
                    <dt className={styles.fieldLabel}>Especialidade / Procedimento</dt>
                    <dd className={styles.fieldValue}>{descricaoDe(ultimaEProxima.proxima)}</dd>
                  </div>

                  <div className={styles.infoGroup}>
                    <dt className={styles.fieldLabel}>Status</dt>
                    <dd className={styles.fieldValue}>
                      <span className={ultimaEProxima.proxima.status === 'Confirmado' ? styles.statusPill : styles.statusPillPending}>
                        {ultimaEProxima.proxima.status === 'Confirmado' ? 'Confirmado' : 'Pendente'}
                      </span>
                    </dd>
                  </div>

                  {ultimaEProxima.proxima.observacoes && (
                    <div className={styles.infoGroup} style={{ gridColumn: '1 / -1' }}>
                      <dt className={styles.fieldLabel}>Observações</dt>
                      <dd className={styles.fieldValue}>{ultimaEProxima.proxima.observacoes}</dd>
                    </div>
                  )}
                </div>

                <div className={styles.nextAppointmentActions}>
                  <Button variant="outline" type="button" onClick={() => abrirEditarConsulta(ultimaEProxima.proxima)}>
                    <IconeLapis />
                    Editar agendamento
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.nextAppointmentEmpty}>
                <p>Nenhuma consulta futura agendada</p>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() =>
                    navigate('/novo-agendamento', {
                      state: { pacienteId: paciente.id },
                    })
                  }
                >
                  Agendar nova consulta
                </Button>
              </div>
            )}
          </article>

          <div className={styles.cardsGrid}>
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
                  <dd className={styles.fieldValue}>
                    {contato.endereco.rua}, {contato.endereco.numero}
                    {contato.endereco.complemento && ` — ${contato.endereco.complemento}`}
                  </dd>
                  <dd className={styles.fieldValueSecondary}>
                    {contato.endereco.bairro} — CEP {contato.endereco.cep}
                  </dd>
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
                    {ultimaEProxima.ultima ? (
                      <>
                        <strong className={styles.consultDate}>{formatarData(ultimaEProxima.ultima.data)}</strong>
                        <span className={styles.consultDesc}>{descricaoDe(ultimaEProxima.ultima)}</span>
                      </>
                    ) : (
                      <span className={styles.consultEmpty}>Nenhuma consulta anterior.</span>
                    )}
                  </div>
                </li>
              </ol>
            </article>
          </div>
        </div>
      )}

      {anamneseIniciada && (
        <div
          role="tabpanel"
          id="painel-anamnese"
          aria-labelledby="aba-anamnese"
          tabIndex={0}
          hidden={abaAtiva !== 'anamnese'}
        >
          <AnamneseForm />
        </div>
      )}

      {abaAtiva === 'fotos-midias' && (
        <div
          role="tabpanel"
          id="painel-fotos-midias"
          aria-labelledby="aba-fotos-midias"
          tabIndex={0}
        >
          <MediaGallery />
        </div>
      )}

      {perfilAtualizado && (
        <p className={styles.sucesso} role="status">
          Perfil de {paciente.nome} atualizado com sucesso.
        </p>
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
              O perfil de {paciente.nome} ficará inativo. É possível reativá-lo depois.
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

{editarPaciente && (
        <ModalEditarPaciente
          paciente={paciente}
          onCancelar={fecharEditarPaciente}
          onSalvar={salvarPaciente}
        />
      )}

{editarConsulta && rascunhoEdicao && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) fecharEditarConsulta();
          }}
        >
          <div
            className={`${styles.modalBox} ${styles.modalBoxWide}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-editar-consulta"
          >
            <div className={styles.modalHeader}>
              <h2 id="titulo-editar-consulta" className={styles.modalTitulo}>
                Editar Agendamento
              </h2>
              <button
                type="button"
                className={styles.modalClose}
                onClick={fecharEditarConsulta}
                aria-label="Fechar"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FormularioAgendamento
              valores={{
                pacienteId: String(rascunhoEdicao.pacienteId),
                dentista: rascunhoEdicao.dentista,
                especialidade: rascunhoEdicao.especialidade,
                observacoes: rascunhoEdicao.observacoes,
              }}
              onChange={aoMudarCampoEdicao}
            />
            <div className={styles.modalAcoes}>
              <Button variant="outline" type="button" onClick={fecharEditarConsulta}>
                Cancelar
              </Button>
              <Button variant="primary" type="button" onClick={aoSalvarEdicao}>
                Salvar alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientProfileOverview;
