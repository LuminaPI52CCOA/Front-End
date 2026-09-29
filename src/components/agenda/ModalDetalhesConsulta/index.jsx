import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultas } from '../../../context/ConsultasContexto';
import { nomeDoPaciente } from '../../../data/pacientes';
import styles from './styles.module.css';

const OPCOES_STATUS = ['Confirmado', 'Pendente', 'Cancelado'];
const STATUS_FINALIZADA = 'Finalizada';

export function ModalDetalhesConsulta({ consulta, onFechar }) {
  const navigate = useNavigate();
  const { atualizarConsulta } = useConsultas();
  const [finalizando, setFinalizando] = useState(false);
  const [reagendar, setReagendar] = useState('sim');
  const refBotaoFechar = useRef(null);

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

  const confirmarFinalizacao = () => {
    atualizarConsulta(consulta.id, { status: STATUS_FINALIZADA });
    onFechar();

    if (reagendar === 'sim') {
      navigate('/novo-agendamento', {
        state: { pacienteId: consulta.pacienteId, dentista: consulta.dentista },
      });
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onFechar();
      }}
    >
      <div className={styles.dialogo} role="dialog" aria-modal="true" aria-labelledby="titulo-modal-consulta">
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

        <dl className={styles.gradeCampos}>
          <div className={styles.campo}>
            <dt>Paciente</dt>
            <dd>{nomeDoPaciente(consulta.pacienteId) || '—'}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Telefone</dt>
            <dd>{consulta.telefone || '—'}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Dentista responsável</dt>
            <dd>{consulta.dentista}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Especialidade</dt>
            <dd>{consulta.especialidade}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Procedimento</dt>
            <dd>{consulta.procedimento || '—'}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Status</dt>
            <dd>{consulta.status}</dd>
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
          <div className={styles.botoesStatus}>
            {OPCOES_STATUS.map((status) => (
              <button
                key={status}
                className={`${styles.botaoStatus}${
                  consulta.status === status
                    ? ` ${styles.ativo} ${classeStatus(status)}`
                    : ''
                }`}
                type="button"
                aria-pressed={consulta.status === status}
                onClick={() => atualizarConsulta(consulta.id, { status })}
              >
                {status === 'Confirmado' ? '✓ Confirmado' : status}
              </button>
            ))}
          </div>
        </div>

        {finalizando && (
          <fieldset className={styles.blocoFinalizar}>
            <legend>Deseja agendar uma nova consulta para este paciente?</legend>
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
                onClick={() => setFinalizando(false)}
              >
                Voltar
              </button>
              <button
                className={styles.botaoFinalizar}
                type="button"
                onClick={confirmarFinalizacao}
              >
                Confirmar finalização
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.botaoSecundario}
                type="button"
                disabled={!consulta.pacienteId}
                onClick={abrirPerfilDoPaciente}
              >
                Editar agendamento
              </button>
              <button
                className={styles.botaoFinalizar}
                type="button"
                disabled={consulta.status === STATUS_FINALIZADA}
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
