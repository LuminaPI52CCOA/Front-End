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

  h3 {
    margin: 0;
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #4a3728;
  }
`;

export const Corpo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Rotulo = styled.p`
  margin: 0 0 4px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #4a3728;
`;

export const EnvolvedorSeletor = styled.div`
  position: relative;

  &::after {
    content: '▾';
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: #cc9b2e;
    font-size: 13px;
    pointer-events: none;
  }
`;

export const Seletor = styled.select`
  width: 100%;
  appearance: none;
  border: 1px solid #cc9b2e;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 10px 30px 10px 12px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #1a1a1a;
  outline: none;
  cursor: pointer;

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(204, 155, 46, 0.3);
  }
`;

export const GradeHorarios = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 8px;
`;

export const AreaRolagem = styled.div`
  max-height: 280px;
  overflow-y: auto;
  padding: 4px 10px 4px 2px;
  scrollbar-width: thin;
  scrollbar-color: #d9cfbc #f4efe4;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f4efe4;
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d9cfbc;
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #c8bca3;
  }
`;

export const BotaoHorario = styled.button`
  padding: 9px 4px;
  border-radius: 8px;
  border: 1px solid #e3c87a;
  background-color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;

  &:hover {
    background-color: #f6efdd;
  }

  ${(props) =>
    props.$selecionado &&
    `
    background-color: #202020 !important;
    border-color: #202020;
    color: #ffffff !important;
  `}

  &:focus-visible {
    outline: 2px solid #cc9b2e;
    outline-offset: 1px;
  }

  ${(props) =>
    props.$ocupado &&
    `
    background-color: #eceae4 !important;
    border-color: #dedbd2 !important;
    color: #b3aa99 !important;
    text-decoration: line-through;
    cursor: default;
    pointer-events: none;
  `}
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
