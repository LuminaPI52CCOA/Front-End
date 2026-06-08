import styled from 'styled-components';

export const StyledButton = styled.button`
  width: 100%;
  background-color: #202020;
  color: #FFFFFF;
  padding: 14px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px; /* Espaço entre texto e ícone */
  margin-bottom: 24px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #000000;
  }
`;