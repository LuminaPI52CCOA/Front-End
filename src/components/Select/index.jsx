import { forwardRef, useId } from 'react';
import styles from './styles.module.css';

export const Select = forwardRef(({ label, options, className: extraClass, ...props }, ref) => {
  const generatedId = useId();
  const selectId = props.id || props.name || generatedId;

  return (
    <div className={styles.selectWrapper}>
      {label && (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={`${styles.styledSelect}${extraClass ? ` ${extraClass}` : ''}`}
        {...props}
      >
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