import { forwardRef, useId } from 'react';
import styles from './styles.module.css';

export const Select = forwardRef(({ label, options, id, ...props }, ref) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={styles.selectWrapper}>
      {label && <label className={styles.label} htmlFor={selectId}>{label}</label>}
      <select className={styles.styledSelect} ref={ref} id={selectId} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className={styles.arrow} aria-hidden="true">▼</div>
    </div>
  );
});

Select.displayName = 'Select';