import styles from './styles.module.css';

export function RouteFallback() {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.srOnly}>Carregando...</span>
    </div>
  );
}

export default RouteFallback;
