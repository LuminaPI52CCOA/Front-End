import { MESES_ABREV } from '../../../data/agenda';
import { deISO } from '../../../utils/datas';
import styles from './styles.module.css';

function IconeCalendario() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconeSeta() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ConsultasAmanha({ dataAmanha, quantidade, onAbrir }) {
  const data = deISO(dataAmanha);
  const rotuloData = `Amanhã, ${String(data.getDate()).padStart(2, '0')} ${
    MESES_ABREV[data.getMonth()]
  }`;
  const textoQuantidade =
    quantidade === 0
      ? 'Nenhuma consulta para amanhã'
      : `${quantidade} consulta${quantidade > 1 ? 's' : ''} agendada${
          quantidade > 1 ? 's' : ''
        }`;

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onAbrir}
      aria-label={`Consultas de amanhã: ${textoQuantidade}. Abrir detalhes`}
    >
      <span className={styles.topo}>
        <span className={styles.icone}>
          <IconeCalendario />
        </span>
        <span className={styles.rotulo}>Consultas de amanhã</span>
      </span>

      <span className={styles.data}>{rotuloData}</span>

      <span className={styles.rodape}>
        <span className={styles.quantidade}>{textoQuantidade}</span>
        <span className={styles.seta}>
          <IconeSeta />
        </span>
      </span>
    </button>
  );
}

export default ConsultasAmanha;
