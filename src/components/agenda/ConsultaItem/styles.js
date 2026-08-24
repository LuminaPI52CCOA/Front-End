import styled from 'styled-components';

export const Cartao = styled.li`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 16px;
  background-color: #ffffff;
  border: 1px solid #e5e0d8;
  border-radius: 8px;
  padding: 14px 16px;

  & + & {
    margin-top: 10px;
  }

  @media (max-width: 640px) {
    grid-template-columns: auto 1fr;
    row-gap: 10px;
  }
`;

export const Horario = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  padding-right: 16px;
  border-right: 1px solid #e5e0d8;
  align-self: stretch;
  display: flex;
  align-items: center;

  @media (max-width: 640px) {
    border-right: none;
    padding-right: 0;
    align-self: auto;
  }
`;

export const Informacoes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const NomePaciente = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`;

export const NomeDentista = styled.span`
  font-size: 12px;
  color: #a3988a;
`;

export const EtiquetaEspecialidade = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: ${(props) => props.$texto};
  background-color: ${(props) => props.$fundo};
  border-radius: 20px;
  padding: 6px 14px;
  white-space: nowrap;

  @media (max-width: 640px) {
    justify-self: start;
  }
`;

export const EtiquetaStatus = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  padding: 7px 14px;
  white-space: nowrap;

  ${(props) => {
    if (props.$status === 'Cancelado') {
      return `
        background-color: #e57373;
        color: #4a1010;
      `;
    }
    if (props.$status === 'Confirmado') {
      return `
        background-color: #70c665;
        color: #143a19;
      `;
    }
    return `
      background-color: #e8dfc9;
      color: #7b5900;
    `;
  }}

  @media (max-width: 640px) {
    justify-self: start;
  }
`;
