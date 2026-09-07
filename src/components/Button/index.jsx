import styles from './styles.module.css';

export const Button = ({ children, icon, variant = 'primary', full, className, ...props }) => {
  const classes = [
    styles.button,
    styles[variant] || styles.primary,
    full && styles.full,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
      {icon && <span aria-hidden="true">{icon}</span>}
    </button>
  );
};