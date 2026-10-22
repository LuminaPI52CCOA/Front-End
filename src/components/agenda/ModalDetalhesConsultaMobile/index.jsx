import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { CORES_ESPECIALIDADES, PROCEDIMENTOS } from '../../../data/agenda';
import { nomeDoPaciente } from '../../../data/pacientes';
import styles from './styles.module.css';

function classeStatus(status) {
  if (status === 'Finalizada') return styles.statusRealizado;
  if (status === 'Cancelado') return styles.statusCancelado;
  if (status === 'Confirmado') return styles.statusAndamento;
  return styles.statusPendente;
}

export function ModalDetalhesConsultaMobile({ consulta, onFechar }) {
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

  const cor = CORES_ESPECIALIDADES[consulta.especialidade]?.ponto || '#8C7A5E';

  return (
    <div
      className={styles.overlay}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onFechar();
      }}
      role="presentation"
    >
      <div
        className={styles.dialogo}
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes da consulta"
        style={{ '--cor-indicador': cor }}
      >
        <div className={styles.topo}>
          <h3 className={styles.titulo}>Detalhes da consulta</h3>
          <button
            ref={refBotaoFechar}
            className={styles.botaoFechar}
            type="button"
            aria-label="Fechar detalhes da consulta"
            onClick={onFechar}
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.cabecalhoInfo}>
          <span className={styles.horario}>
            {consulta.inicio} – {consulta.fim}
          </span>
          <span className={`${styles.status} ${classeStatus(consulta.status)}`}>
            {consulta.status}
          </span>
        </div>

        <dl className={styles.campos}>
          <div className={styles.campo}>
            <dt>Paciente</dt>
            <dd>
              {consulta.pacienteNome || nomeDoPaciente(consulta.pacienteId) || '—'}
            </dd>
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
            <dt>Procedimento</dt>
            <dd>
              {PROCEDIMENTOS[consulta.especialidade] ||
                consulta.procedimento ||
                '—'}
            </dd>
          </div>
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
              <span className={styles.observacaoVazia}>Nenhuma anotação.</span>
            )}
          </dd>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalhesConsultaMobile;
