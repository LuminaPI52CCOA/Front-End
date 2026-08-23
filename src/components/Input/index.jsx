import { forwardRef, useId, useState } from 'react';
import * as S from './styles';
import OlhoAberto from '../../assets/olhoaberto.svg';
import OlhoFechado from '../../assets/olhofechado.svg';

export const Input = forwardRef(({ label, error, type = 'text', mask, onChange, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = props.id || generatedId;
  const errorId = `${inputId}-erro`;
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
    <S.InputWrapper>
      {label && <S.Label htmlFor={inputId}>{label}</S.Label>}
      <S.InputContainer>
        <S.StyledInput
          ref={ref}
          type={inputType}
          onChange={handleChange}
          $hasError={!!error}
          {...props}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        {isPassword && (
          <S.ToggleButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={showPassword}
          >
            <img src={showPassword ? OlhoFechado : OlhoAberto} alt="" aria-hidden="true" />
          </S.ToggleButton>
        )}
      </S.InputContainer>
      {error && (
        <S.ErrorMessage id={errorId} role="alert">
          {error}
        </S.ErrorMessage>
      )}
    </S.InputWrapper>
  );
});

Input.displayName = 'Input';