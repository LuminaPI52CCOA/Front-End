import { corEspecialidade } from '../../../data/agenda';
import styles from './styles.module.css';

export function ConsultaCard({ agendamento, selecionado, onClick }) {
  const { pacienteNome, dentista, especialidade, status, statusApi } = agendamento;
  const paciente = pacienteNome || 'Paciente';
  const cancelado = status === 'Cancelado' || statusApi === 'CANCELADA';
  const finalizada = status === 'Finalizada' || statusApi === 'CONCLUIDA';
  const pendente = status === 'Pendente' || statusApi === 'AGENDADA';
  const corBorda = cancelado ? '#c0392b' : corEspecialidade(especialidade).ponto;

  return (
    <div
      className={`${styles.card}${cancelado ? ` ${styles.cancelado}` : ''}${finalizada ? ` ${styles.finalizada}` : ''}${selecionado ? ` ${styles.selecionado}` : ''}`}
      style={{ '--cor-borda': corBorda, '--cor-ponto': corBorda }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={selecionado}
      onKeyDown={(evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Consulta de ${paciente} com ${dentista}, ${especialidade}, ${cancelado ? 'cancelada' : status}. Clique para ver detalhes`}
    >
      <span className={`${styles.nomePaciente}${cancelado ? ` ${styles.nomeCancelado}` : ''}`}>
        {paciente}
      </span>

      <span className={styles.dentista}>{dentista}</span>

      <span className={styles.especialidade}>{especialidade}</span>

      <span
        className={`${styles.status}${cancelado ? ` ${styles.cancelado}` : ''}${finalizada ? ` ${styles.finalizada}` : ''}${pendente ? ` ${styles.pendente}` : ''}`}
      >
        {cancelado ? (
          <>
            <span aria-hidden="true">✕</span> Cancelada
          </>
        ) : (
          <>
            {(status === 'Confirmado' || finalizada) && <span aria-hidden="true">✓</span>}
            {status}
          </>
        )}
      </span>
    </div>
  );
}

export default ConsultaCard;
