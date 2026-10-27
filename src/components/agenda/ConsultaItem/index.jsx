import { corEspecialidade } from '../../../data/agenda';
import styles from './styles.module.css';

const classeStatus = (status) => {
  if (status === 'Cancelado') return styles.cancelado;
  if (status === 'Finalizada') return styles.finalizada;
  if (status === 'Confirmado') return styles.confirmado;
  return styles.pendente;
};

export function ConsultaItem({ consulta }) {
  const { inicio, pacienteNome, dentista, especialidade, status, statusApi } = consulta;
  const cores = corEspecialidade(especialidade);
  const cancelado = status === 'Cancelado' || statusApi === 'CANCELADA';

  return (
    <li className={`${styles.cartao}${cancelado ? ` ${styles.cartaoCancelado}` : ''}`}>
      <span className={styles.horario}>{inicio}</span>

      <div className={styles.informacoes}>
        <span className={`${styles.nomePaciente}${cancelado ? ` ${styles.nomeCancelado}` : ''}`}>
          {pacienteNome || 'Paciente'}
        </span>
        <span className={styles.nomeDentista}>{dentista}</span>
      </div>

      <span
        className={styles.etiquetaEspecialidade}
        style={{
          '--fundo': cores.fundo,
          '--texto': cores.texto,
        }}
        aria-label={`Especialidade: ${especialidade}`}
      >
        {especialidade}
      </span>

      <span className={`${styles.etiquetaStatus} ${classeStatus(status)}`}>
        {cancelado ? '✕ Cancelada' : status}
      </span>
    </li>
  );
}

export default ConsultaItem;
