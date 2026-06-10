import React from 'react';
import * as S from './styles';

export const Button = ({ children, icon, ...props }) => {
  return (
    <S.StyledButton {...props}>
      {children}
      {icon && <span>{icon}</span>}
    </S.StyledButton>
  );
};