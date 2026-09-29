import styles from '../styles.module.css';

export default function MetricCard({ label, value, icon: Icon, pillText, pillType = 'neutral' }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricHeader}>
        <span className={styles.metricLabel}>{label}</span>
        {Icon && (
          <div className={styles.metricIconWrapper}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className={styles.metricValue}>{value}</p>
      {pillText && (
        <div className={styles.metricFooter}>
          <span className={pillType === 'success' ? styles.pillSuccess : styles.pillNeutral}>
            {pillText}
          </span>
        </div>
      )}
    </div>
  );
}
