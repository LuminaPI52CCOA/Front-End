import styles from './styles.module.css';

export const SuccessOverlay = ({ title, subtitle }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.successBox}>
        <svg className={styles.animatedCheck} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" />
          <path d="M30 50 L45 65 L70 35" />
        </svg>
        <h2 className={styles.successTitle}>{title}</h2>
        {subtitle && <p className={styles.successSubtitle}>{subtitle}</p>}
      </div>
    </div>
  );
};

export default SuccessOverlay;