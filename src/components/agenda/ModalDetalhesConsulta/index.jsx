import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultas } from '../../../context/ConsultasContexto';
import { formatarTelefone } from '../../../utils/formatar';
import { podeCriarAgendamento } from '../../../utils/sessao';
import styles from './styles.module.css';

const OPCOES_STATUS = ['Confirmado', 'Pendente', 'Cancelado'];
const STATUS_FINALIZADA = 'Finalizada';

export function ModalDetalhesConsulta({ consulta, onFechar }) {
  const navigate = useNavigate();
  const { mudarStatus } = useConsultas();
  const [finalizando, setFinalizando] = useState(false);
  const [reagendar, setReagendar] = useState('sim');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const refBotaoFechar = useRef(null);

  const cancelada =
    consulta.status === 'Cancelado' || consulta.statusApi === 'CANCELADA';
  const finalizada =
    consulta.status === STATUS_FINALIZADA || consulta.statusApi === 'CONCLUIDA';
  const encerrada = cancelada || finalizada;

  useEffect(() => {
    refBotaoFechar.current?.focus();

    const aoTeclar = (evento) => {
      if (evento.key === 'Escape') onFechar();
    };
    window.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [onFechar]);

  const classeStatus = (status) => {
    if (status === 'Confirmado') return styles.confirmado;
    if (status === 'Pendente') return styles.pendente;
    return styles.cancelado;
  };

  const abrirPerfilDoPaciente = () => {
    onFechar();
    navigate(`/pacientes/${consulta.pacienteId}`);
  };

  const alterarStatus = async (novoStatus) => {
    if (encerrada || salvando || consulta.status === novoStatus) return;
    setSalvando(true);
    setErro('');
    try {
      await mudarStatus(consulta.id, novoStatus);
    } catch (error) {
      setErro(error?.message || 'Não foi possível alterar o status da consulta.');
    } finally {
      setSalvando(false);
    }
  };

  const confirmarFinalizacao = async () => {
    if (salvando) return;
    setSalvando(true);
    setErro('');
    try {
      await mudarStatus(consulta.id, STATUS_FINALIZADA);
      onFechar();

      if (reagendar === 'sim' && podeCriarAgendamento()) {
        navigate('/novo-agendamento', {
          state: {
            pacienteId: consulta.pacienteId,
            dentistaId: consulta.dentistaId,
            dentista: consulta.dentista,
            especialidadeId: consulta.especialidadeId,
            especialidade: consulta.especialidade,
          },
        });
      }
    } catch (error) {
      setErro(error?.message || 'Não foi possível finalizar a consulta.');
    } finally {
      setSalvando(false);
    }
  };

  const telefoneFormatado = consulta.telefone
    ? formatarTelefone(consulta.telefone)
    : '—';

  const dentiçãoTexto = consulta.pularOdontograma
    ? 'Odontograma pulado'
    : consulta.dentes?.length > 0
      ? consulta.dentes.join(', ')
      : 'Nenhum dente selecionado';

  return (
    <div
      className={styles.overlay}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onFechar();
      }}
    >
      <div
        className={styles.dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-consulta"
      >
        <div className={styles.topo}>
          <h3 id="titulo-modal-consulta">Detalhes da consulta</h3>
          <button
            ref={refBotaoFechar}
            className={styles.botaoFechar}
            type="button"
            aria-label="Fechar detalhes da consulta"
            onClick={onFechar}
          >
            ✕
          </button>
        </div>

        {cancelada && (
          <p className={styles.faixaCancelada} role="status">
            ✕ Consulta cancelada — este horário encontra-se liberado na agenda.
          </p>
        )}

        {finalizada && (
          <p className={styles.faixaFinalizada} role="status">
            ✓ Consulta concluída.
          </p>
        )}

        {erro && (
          <p className={styles.avisoErro} role="alert">
            {erro}
          </p>
        )}

        <dl className={styles.gradeCampos}>
          <div className={styles.campo}>
            <dt>Paciente</dt>
            <dd>{consulta.pacienteNome || '—'}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Telefone</dt>
            <dd>{telefoneFormatado}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Dentista responsável</dt>
            <dd>{consulta.dentista || '—'}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Especialidade</dt>
            <dd>{consulta.especialidade || '—'}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Tipo de dente</dt>
            <dd>{consulta.tipoDente || '—'}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Status</dt>
            <dd>{cancelada ? '✕ Cancelada' : consulta.status}</dd>
          </div>
        </dl>

        <dl className={styles.gradeCampos}>
          <div className={styles.campo}>
            <dt>Início</dt>
            <dd>{consulta.inicio}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Término</dt>
            <dd>{consulta.fim}</dd>
          </div>
        </dl>

        <div className={styles.campo}>
          <dt>Odontograma (Dentes)</dt>
          <dd>
            {consulta.dentes?.length > 0 && !consulta.pularOdontograma ? (
              <div className={styles.listaDentes}>
                {consulta.dentes.map((numero) => (
                  <span key={numero} className={styles.pilulaDente}>
                    Dente {numero}
                  </span>
                ))}
              </div>
            ) : (
              <em className={styles.observacaoVazia}>{dentiçãoTexto}</em>
            )}
          </dd>
        </div>

        <div className={styles.campo}>
          <dt>Observações</dt>
          <dd>
            {consulta.observacoes ? (
              consulta.observacoes
            ) : (
              <em className={styles.observacaoVazia}>Nenhuma anotação.</em>
            )}
          </dd>
        </div>

        <div className={styles.campo}>
          <dt>Alterar status</dt>
          <dd className={styles.botoesStatus}>
            {OPCOES_STATUS.map((status) => (
              <button
                key={status}
                className={`${styles.botaoStatus}${
                  consulta.status === status
                    ? ` ${styles.ativo} ${classeStatus(status)}`
                    : ''
                }`}
                type="button"
                disabled={encerrada || salvando}
                aria-pressed={consulta.status === status}
                onClick={() => alterarStatus(status)}
              >
                {status === 'Confirmado'
                  ? '✓ Confirmado'
                  : status === 'Cancelado'
                    ? '✕ Cancelado'
                    : status}
              </button>
            ))}
          </dd>
        </div>

        {finalizando && podeCriarAgendamento() && (
          <fieldset className={styles.blocoFinalizar}>
            <legend>Deseja agendar o retorno deste paciente?</legend>
            <label className={styles.opcao}>
              <input
                type="radio"
                name="reagendar-consulta"
                value="sim"
                checked={reagendar === 'sim'}
                onChange={() => setReagendar('sim')}
              />
              Sim
            </label>
            <label className={styles.opcao}>
              <input
                type="radio"
                name="reagendar-consulta"
                value="nao"
                checked={reagendar === 'nao'}
                onChange={() => setReagendar('nao')}
              />
              Não
            </label>
          </fieldset>
        )}

        <div className={styles.rodape}>
          {finalizando ? (
            <>
              <button
                className={styles.botaoSecundario}
                type="button"
                disabled={salvando}
                onClick={() => setFinalizando(false)}
              >
                Voltar
              </button>
              <button
                className={styles.botaoFinalizar}
                type="button"
                disabled={salvando}
                onClick={confirmarFinalizacao}
              >
                {salvando ? 'Finalizando...' : 'Confirmar finalização'}
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.botaoSecundario}
                type="button"
                disabled={!consulta.pacienteId || encerrada}
                onClick={abrirPerfilDoPaciente}
              >
                Editar agendamento
              </button>
              <button
                className={styles.botaoFinalizar}
                type="button"
                disabled={encerrada || salvando}
                onClick={() => setFinalizando(true)}
              >
                Finalizar consulta
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalDetalhesConsulta;
