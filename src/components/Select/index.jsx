import React, { forwardRef } from 'react';
import * as S from './styles';

export const Select = forwardRef(({ label, options, ...props }, ref) => {
  return (
    <S.SelectWrapper>
      {label && <S.Label>{label}</S.Label>}
      <S.StyledSelect ref={ref} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </S.StyledSelect>
      <S.Arrow>▼</S.Arrow>
    </S.SelectWrapper>
  );
});

Select.displayName = 'Select';