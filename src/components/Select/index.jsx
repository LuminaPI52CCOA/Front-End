import React, { forwardRef } from 'react';
import styles from './styles.module.css';

export const Select = forwardRef(({ label, options, ...props }, ref) => {
  return (
    <div className={styles.selectWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={styles.styledSelect} ref={ref} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className={styles.arrow}>▼</div>
    </div>
  );
});

Select.displayName = 'Select';