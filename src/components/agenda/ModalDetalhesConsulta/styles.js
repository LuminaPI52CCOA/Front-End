import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(30, 25, 18, 0.5);
  backdrop-filter: blur(2px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const Dialogo = styled.div`
  background-color: #ffffff;
  border-radius: 14px;
  width: min(480px, 100%);
  max-height: 85vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  font-family: 'Montserrat', sans-serif;
`;

export const Topo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    font-size: 17px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
  }
`;

export const BotaoFechar = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  line-height: 1;
  color: #8b857a;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;

  &:hover {
    background-color: #f1ead9;
    color: #4a3728;
  }

  &:focus-visible {
    outline: 2px solid #cc9b2e;
  }
`;

export const Campo = styled.div`
  margin-bottom: 14px;

  dt {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #a3988a;
    margin-bottom: 3px;
  }

  dd {
    margin: 0;
    font-size: 14px;
    color: #1a1a1a;
    line-height: 1.4;
  }
`;

export const GradeCampos = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;
  margin: 0 0 6px 0;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const LinhaStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const BotoesStatus = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

export const BotaoStatus = styled.button`
  border-radius: 999px;
  padding: 7px 14px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  background-color: #ffffff;
  border: 1px solid #e5e0d8;
  color: #6f6656;

  ${(props) => {
    if (!props.$ativo) return '';
    if (props.$status === 'Confirmado') {
      return 'background-color:#70c665;border-color:#70c665;color:#143a19;';
    }
    if (props.$status === 'Pendente') {
      return 'background-color:#f1ead9;border-color:#d8c496;color:#7b5900;';
    }
    return 'background-color:#e57373;border-color:#e57373;color:#4a1010;';
  }}

  &:focus-visible {
    outline: 2px solid #cc9b2e;
    outline-offset: 1px;
  }
`;

export const CampoForm = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #6f6656;
    margin-bottom: 4px;
  }

  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #e5e0d8;
    border-radius: 8px;
    padding: 9px 12px;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #1a1a1a;
    outline: none;

    &:focus-visible {
      border-color: #cc9b2e;
      box-shadow: 0 0 0 2px rgba(204, 155, 46, 0.25);
    }
  }

  textarea {
    min-height: 64px;
    resize: vertical;
  }
`;

export const ParHorarios = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const Rodape = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
`;

export const BotaoPrimario = styled.button`
  background-color: #202020;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: #000000;
  }
`;

export const BotaoSecundario = styled.button`
  background-color: transparent;
  color: #6f6656;
  border: 1px solid #e5e0d8;
  border-radius: 8px;
  padding: 10px 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: #f6f2ea;
  }
`;

export const ObservacaoVazia = styled.em`
  color: #b3aa99;
  font-style: normal;
  font-size: 13px;
`;
