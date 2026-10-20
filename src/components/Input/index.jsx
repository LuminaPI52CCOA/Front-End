import { forwardRef, useId, useState } from 'react';
import styles from './styles.module.css';
import OlhoAberto from '../../assets/olhoaberto.svg';
import OlhoFechado from '../../assets/olhofechado.svg';

export const Input = forwardRef(({ label, error, type = 'text', mask, onChange, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const generatedId = useId();
  const inputId = props.id || props.name || generatedId;

  const handleChange = (e) => {
    if (mask === 'cpf') {
      let value = e.target.value.replace(/\D/g, '').slice(0, 11);
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = value;
    }
    if (onChange) onChange(e);
  };

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        <input
          id={inputId}
          ref={ref}
          className={`${styles.styledInput}${error ? ` ${styles.hasError}` : ''}`}
          type={inputType}
          onChange={handleChange}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {isPassword && (
          <button
            className={styles.toggleButton}
            type="button"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            <img src={showPassword ? OlhoFechado : OlhoAberto} alt="" aria-hidden="true" />
          </button>
        )}
      </div>
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';