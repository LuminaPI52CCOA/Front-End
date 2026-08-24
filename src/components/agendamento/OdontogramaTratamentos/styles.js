import styled from 'styled-components';

export const Card = styled.section`
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

export const Topo = styled.div`
  padding: 18px 20px 6px;

  h3 {
    margin: 0;
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #1a1a1a;
  }
`;

export const Ilustracao = styled.div`
  display: grid;
  place-items: center;
  padding: 8px 16px 0;

  svg {
    width: 100%;
    max-width: 780px;
    height: auto;
    display: block;
  }
`;

export const DenteSvg = styled.g`
  cursor: pointer;

  rect {
    transition:
      fill 0.15s ease,
      stroke 0.15s ease;
  }

  &:hover rect {
    stroke: #cc9b2e;
  }

  &:focus-visible {
    outline: none;

    rect {
      stroke: #202020;
      stroke-width: 2.5;
    }
  }

  ${(props) =>
    props.$desabilitado &&
    `
    pointer-events: none;
    opacity: 0.45;
  `}
`;

export const Matriz = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 18px;
`;

export const LinhaArcada = styled.div`
  display: flex;
  gap: 22px;
`;

export const GrupoDentes = styled.div`
  display: flex;
  gap: 6px;
`;

export const BotaoDente = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #d5cfc3;
  background-color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #f6efdd;
  }

  ${(props) =>
    props.$selecionado &&
    `
    background-color: #1a1a1a !important;
    border-color: #1a1a1a;
    color: #ffffff !important;
  `}

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid #cc9b2e;
    outline-offset: 1px;
  }
`;

export const Rodape = styled.footer`
  background-color: #f6e9cf;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
`;

export const EnvolvedorSeletor = styled.div`
  position: relative;

  &::after {
    content: '▾';
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: #b3871f;
    font-size: 13px;
    pointer-events: none;
  }
`;

export const SeletorTipo = styled.select`
  appearance: none;
  border: 1px solid #e0d9c8;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 9px 30px 9px 12px;
  min-width: 200px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #1a1a1a;
  outline: none;
  cursor: pointer;

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(204, 155, 46, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const Resumo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 240px;

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

export const RotuloPular = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #4a3728;
  cursor: pointer;
  user-select: none;

  input {
    width: 16px;
    height: 16px;
    accent-color: #202020;
    cursor: pointer;
  }
`;
