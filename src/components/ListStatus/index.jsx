import styles from './styles.module.css';

export function ListStatus({ loading, error, onRetry, forbiddenMessage }) {
  if (loading) {
    return <p className={styles.state}>Carregando...</p>;
  }

  if (!error) return null;

  if (error.status === 401) {
    return <p className={styles.state}>Sessão expirada. Redirecionando para o login...</p>;
  }

  if (error.status === 403) {
    return (
      <p className={styles.state}>
        {forbiddenMessage ?? 'Você não tem permissão para ver esta lista.'}
      </p>
    );
  }

  return (
    <div className={styles.state} role="alert">
      <p className={styles.message}>{error.message}</p>
      <button type="button" className={styles.retryButton} onClick={onRetry}>
        Tentar de novo
      </button>
    </div>
  );
}

export default ListStatus;
