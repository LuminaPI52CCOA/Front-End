import { forwardRef, useId } from 'react';
import * as S from './styles';

export const Select = forwardRef(({ label, options, id, ...props }, ref) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <S.SelectWrapper>
      {label && <S.Label htmlFor={selectId}>{label}</S.Label>}
      <S.StyledSelect ref={ref} id={selectId} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </S.StyledSelect>
      <S.Arrow aria-hidden="true">▼</S.Arrow>
    </S.SelectWrapper>
  );
});

Select.displayName = 'Select';