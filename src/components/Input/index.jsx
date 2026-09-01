import { forwardRef, useState } from 'react';
import styles from './styles.module.css';
import OlhoAberto from '../../assets/olhoaberto.svg';
import OlhoFechado from '../../assets/olhofechado.svg';

export const Input = forwardRef(({ label, error, type = 'text', mask, onChange, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;


  const handleChange = (e) => {
    if (mask === 'cpf') {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = value;
    }
    if (onChange) onChange(e); 
  };

  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>} 
      <div className={styles.inputContainer}>
        <input
          ref={ref}
          className={`${styles.styledInput}${error ? ` ${styles.hasError}` : ''}`}
          type={inputType}
          onChange={handleChange}
          {...props}
        />
        {isPassword && (
          <button className={styles.toggleButton} type="button" onClick={() => setShowPassword(!showPassword)}>
            <img src={showPassword ? OlhoFechado : OlhoAberto} alt="Toggle password visibility" />
          </button>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';