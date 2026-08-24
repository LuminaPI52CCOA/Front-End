import styled from 'styled-components';

export const Card = styled.section`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0px 10px 30px rgba(74, 55, 40, 0.08);
`;

export const Cabecalho = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Grupo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const BotaoSeta = styled.button`
  background: transparent;
  border: none;
  font-family: 'Montserrat', sans-serif;
  color: #1f1f1f;
  font-size: 16px;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #f1ead9;
    color: #7b5900;
  }

  &:focus-visible {
    outline: 2px solid #cc9b2e;
    outline-offset: 1px;
  }
`;

export const Ano = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #1f1f1f;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;

  span[aria-hidden='true'] {
    font-weight: 500;
  }
`;

export const Mes = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #cc9b2e;
  margin: 0;
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

export const DiaSemana = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #8b857a;
  text-align: center;
  padding-bottom: 4px;
`;

export const Celula = styled.div`
  display: flex;
`;

export const BotaoDia = styled.button`
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #4a3728;
  cursor: pointer;

  background-color: ${(props) => {
    if (props.$selecionado) return '#cc9b2e';
    if (props.$naFaixa) return '#f3ecdc';
    return 'transparent';
  }};

  color: ${(props) => {
    if (props.$selecionado) return '#ffffff';
    if (!props.$noMes && !props.$naFaixa) return '#d8d2c6';
    return '#4a3728';
  }};

  font-weight: ${(props) => (props.$selecionado ? '700' : '400')};

  &:hover {
    ${(props) =>
      props.$selecionado
        ? 'background-color: #b8892a;'
        : 'background-color: #efe8d8;'}
  }

  &:focus-visible {
    outline: 2px solid #8c7a5e;
    outline-offset: -2px;
  }
`;
