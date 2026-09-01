import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';
import styles from './FormInput.module.css';

export const FormInput = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  mask,
  value,
  onChange,
  onBlur,
  name,
  id,
  ...props
}, ref) => {
  const inputId = id || name;

  return (
    <div className={styles.inputGroup}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        {mask ? (
          <IMaskInput
            mask={mask}
            unmask={false}
            value={value !== undefined && value !== null ? String(value) : ''}
            onAccept={(val) => {
              if (onChange) {
                onChange({ target: { name, value: val } });
              }
            }}
            onBlur={onBlur}
            inputRef={ref}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            {...props}
          />
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

FormInput.displayName = 'FormInput';
