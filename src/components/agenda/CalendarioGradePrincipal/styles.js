import styled from 'styled-components';

export const ALTURA_SLOTS = 40;

export const Card = styled.section`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0px 10px 30px rgba(74, 55, 40, 0.08);
  overflow-x: auto;
`;

export const AreaInterna = styled.div`
  min-width: 760px;
`;

export const CabecalhoSemana = styled.div`
  display: grid;
  grid-template-columns: 64px repeat(6, 1fr);
  align-items: end;
  padding-bottom: 14px;
  border-bottom: 1px solid #ece5d8;
`;

export const IconeCalendario = styled.div`
  color: #b09b6f;
  display: flex;
  align-items: flex-end;
  padding-bottom: 2px;
`;

export const ColunaDia = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border-radius: 8px;
  padding: 4px 0;
`;

export const NomeDia = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #a39a8b;
  text-transform: uppercase;
`;

export const NumeroDia = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => (props.$hoje ? '#ffffff' : '#3d3428')};
  background-color: ${(props) => (props.$hoje ? '#202020' : 'transparent')};
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MarcadorSelecao = styled.span`
  width: 26px;
  height: 4px;
  border-radius: 2px;
  background-color: ${(props) => (props.$selecionado ? '#d8c496' : 'transparent')};
`;

export const Corpo = styled.div`
  display: grid;
  grid-template-columns: 64px repeat(6, 1fr);
`;

export const ColunaHorarios = styled.div``;

export const RotuloHora = styled.span`
  display: block;
  height: ${ALTURA_SLOTS}px;
  font-size: 10px;
  color: #a39a8b;
  text-align: right;
  padding-right: 12px;
  transform: translateY(-50%);
`;

export const ColunaDiaCorpo = styled.div`
  position: relative;
  height: ${(props) => props.$altura}px;
  border-left: 1px solid #f0eadd;

  background-image: repeating-linear-gradient(
    to bottom,
    #f0eadd 0,
    #f0eadd 1px,
    transparent 1px,
    transparent ${ALTURA_SLOTS}px
  );
`;
