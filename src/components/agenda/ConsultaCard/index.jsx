import { CORES_ESPECIALIDADES } from '../../../data/agenda';
import { nomeDoPaciente } from '../../../data/pacientes';
import styles from './styles.module.css';

export function ConsultaCard({ agendamento, selecionado, onClick }) {
  const { pacienteId, dentista, especialidade, status } = agendamento;
  const paciente = nomeDoPaciente(pacienteId);
  const cancelado = status === 'Cancelado';
  const finalizada = status === 'Finalizada';
  const corBorda =
    CORES_ESPECIALIDADES[especialidade]?.ponto || '#8C7A5E';

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
      aria-label={`Consulta de ${paciente} com ${dentista}, ${especialidade}, ${status}. Clique para ver detalhes`}
    >
      <span className={styles.nomePaciente}>{paciente}</span>

      <span className={styles.dentista}>{dentista}</span>

      <span className={styles.especialidade}>{especialidade}</span>

      <span className={`${styles.status}${cancelado ? ` ${styles.cancelado}` : ''}${finalizada ? ` ${styles.finalizada}` : ''}`}>
        {(status === 'Confirmado' || finalizada) && <span aria-hidden="true">✓</span>}
        {status}
      </span>
    </div>
  );
}

export default ConsultaCard;
