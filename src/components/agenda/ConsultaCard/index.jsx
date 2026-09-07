import { CORES_ESPECIALIDADES } from '../../../data/agenda';
import styles from './styles.module.css';

export function ConsultaCard({ agendamento, selecionado, onClick }) {
  const { paciente, dentista, especialidade, status } = agendamento;
  const cancelado = status === 'Cancelado';
  const corBorda =
    CORES_ESPECIALIDADES[especialidade]?.ponto || '#8C7A5E';

  return (
    <div
      className={`${styles.card}${cancelado ? ` ${styles.cancelado}` : ''}${selecionado ? ` ${styles.selecionado}` : ''}`}
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
      aria-label={`Consulta de ${paciente} com ${dentista}, ${especialidade}, ${status}. Clique para ver detalhes`}
    >
      <span className={styles.nomePaciente}>{paciente}</span>

      <span className={styles.dentista}>{dentista}</span>

      <span className={styles.especialidade}>{especialidade}</span>

      <span className={`${styles.status}${status === 'Cancelado' ? ` ${styles.cancelado}` : ''}`}>
        {status === 'Confirmado' && <span aria-hidden="true">✓</span>}
        {status}
      </span>
    </div>
  );
}

export default ConsultaCard;
