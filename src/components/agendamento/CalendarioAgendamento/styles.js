import styled from 'styled-components';

export const Card = styled.section`
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Cabecalho = styled.div`
  background-color: #f6e9cf;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-family: 'Montserrat', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #4a3728;
  }
`;

export const Navegacao = styled.nav`
  display: flex;
  gap: 4px;
`;

export const BotaoNavegar = styled.button`
  background: transparent;
  border: none;
  color: #7b5900;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 6px;

  &:hover,
  &:focus-visible {
    background-color: rgba(204, 155, 46, 0.35);
  }
`;

export const Grade = styled.div`
  padding: 12px 14px;
`;

export const DiasSemana = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 6px;

  span {
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: #8b857a;
    padding: 6px 0;
  }
`;

export const Celulas = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

export const CelulaDia = styled.button`
  aspect-ratio: 1;
  border-radius: 8px;
  border: none;
  background-color: transparent;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #1a1a1a;
  cursor: pointer;
  display: grid;
  place-items: center;

  ${(props) =>
    props.$foraDoMes &&
    `
    color: #c9c3b8;
    pointer-events: none;
  `}

  &:hover:not(:disabled) {
    background-color: #f1ead9;
  }

  ${(props) =>
    props.$selecionado &&
    `
    background-color: #202020 !important;
    color: #ffffff !important;
    font-weight: 700;
  `}

  &:disabled {
    cursor: default;
  }
`;

export const Rodape = styled.footer`
  margin-top: auto;
  background-color: #f6e9cf;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  p {
    margin: 0;
    font-family: 'Montserrat', sans-serif;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #4a3728;
  }
`;

export const QuadradoIndicador = styled.span`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 3px;
  background-color: #202020;
`;
