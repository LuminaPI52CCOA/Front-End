import styled from 'styled-components';

export const BarraSuperior = styled.header`
  background-color: #ffffff;
  border-bottom: 1px solid #e5e0d8;
`;

export const ConteudoBarra = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 18px 24px;
  text-align: left;

  h1 {
    margin: 0;
    text-align: left;
    font-family: 'Montserrat', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #7b5900;
  }
`;

export const Pagina = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 24px 32px;
`;

export const TopoPagina = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;

  h2 {
    margin: 0;
    font-family: 'Montserrat', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #1a1a1a;
  }
`;

export const BotaoConfirmar = styled.button`
  background-color: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: #000000;
  }
`;

export const Aviso = styled.p`
  margin: -6px 0 14px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #b3452f;
`;

export const GradeColunas = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;

    > :last-child {
      grid-column: span 2;
    }
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;

    > :last-child {
      grid-column: auto;
    }
  }
`;
