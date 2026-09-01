import { CORES_ESPECIALIDADES } from '../../../data/agenda';
import styles from './styles.module.css';

const CORES_TEXTO_ETIQUETA = {
  Endodontia: '#8a6d14',
  Limpeza: '#2f6cab',
  Periodontia: '#3d3428',
  Odontopediatria: '#b0568b',
};

const classeStatus = (status) => {
  if (status === 'Cancelado') return styles.cancelado;
  if (status === 'Confirmado') return styles.confirmado;
  return styles.pendente;
};

export function ConsultaItem({ consulta }) {
  const { inicio, paciente, dentista, especialidade, status } = consulta;
  const cores = CORES_ESPECIALIDADES[especialidade];

  return (
    <li className={styles.cartao}>
      <span className={styles.horario}>{inicio}</span>

      <div className={styles.informacoes}>
        <span className={styles.nomePaciente}>{paciente}</span>
        <span className={styles.nomeDentista}>{dentista}</span>
      </div>

      <span
        className={styles.etiquetaEspecialidade}
        style={{
          '--fundo': cores?.fundo,
          '--texto': CORES_TEXTO_ETIQUETA[especialidade],
        }}
        aria-label={`Especialidade: ${especialidade}`}
      >
        {especialidade}
      </span>

      <span className={`${styles.etiquetaStatus} ${classeStatus(status)}`}>{status}</span>
    </li>
  );
}

export default ConsultaItem;
