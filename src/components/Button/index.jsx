import * as S from './styles';

export const Button = ({ children, icon, ...props }) => {
  return (
    <S.StyledButton {...props}>
      {children}
      {icon && <span aria-hidden="true">{icon}</span>}
    </S.StyledButton>
  );
};