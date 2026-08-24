import styled from 'styled-components';

export const Card = styled.section`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0px 10px 30px rgba(74, 55, 40, 0.08);
`;

export const Titulo = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 700;
  color: #4a3728;
  margin: 0 0 20px 0;
`;

export const BotaoNovo = styled.button`
  width: 100%;
  background-color: #202020;
  color: #ffffff;
  padding: 14px;
  margin-top: 8px;
  border: none;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;

  span {
    font-size: 18px;
    line-height: 1;
  }

  &:hover,
  &:focus-visible {
    background-color: #000000;
  }

  &:focus-visible {
    outline: 2px solid #d8c496;
    outline-offset: 2px;
  }
`;
