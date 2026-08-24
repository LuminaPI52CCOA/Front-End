import styled from 'styled-components';

export const Card = styled.section`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0px 10px 30px rgba(74, 55, 40, 0.08);
`;

export const Cabecalho = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const RotuloMes = styled.p`
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 600;
  color: #8c7a5e;
  letter-spacing: 0.02em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;

  span[aria-hidden='true'] {
    color: #c2b28f;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 12px;
  }
`;

export const BotaoSeta = styled.button`
  background: transparent;
  border: none;
  color: #8c7a5e;
  font-size: 18px;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #f1ead9;
    color: #4a3728;
  }

  &:focus-visible {
    outline: 2px solid #d8c496;
    outline-offset: 1px;
  }
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

export const DiaSemana = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #a39a8b;
  text-align: center;
  padding: 4px 0;
  letter-spacing: 0.03em;
`;

export const Celula = styled.div`
  display: flex;
  justify-content: center;
  min-height: 34px;
`;

export const DiaVazio = styled.span``;

export const BotaoDia = styled.button`
  width: 100%;
  min-height: 34px;
  border: none;
  background-color: transparent;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #4a3728;
  cursor: pointer;

  border-radius: ${(props) => {
    if (props.$naFaixa) {
      if (!props.$arredondarEsquerda && !props.$arredondarDireita) return '0';
      if (props.$arredondarEsquerda && props.$arredondarDireita) return '8px';
      if (props.$arredondarEsquerda) return '8px 0 0 8px';
      return '0 8px 8px 0';
    }
    return '8px';
  }};

  background-color: ${(props) => (props.$naFaixa ? '#d8c496' : 'transparent')};
  box-shadow: ${(props) =>
    props.$ehHoje && !props.$selecionado
      ? 'inset 0 0 0 2px #cc9b2e'
      : props.$selecionado
        ? 'inset 0 0 0 2px #7b5900'
        : 'none'};
  font-weight: ${(props) => (props.$selecionado || props.$ehHoje ? '700' : '400')};

  &:hover {
    background-color: ${(props) => (props.$naFaixa ? '#c9b27c' : '#f1ead9')};
  }

  &:focus-visible {
    outline: 2px solid #8c7a5e;
    outline-offset: -2px;
  }
`;
