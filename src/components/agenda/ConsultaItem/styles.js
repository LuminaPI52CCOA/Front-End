import styled from 'styled-components';

export const Item = styled.li`
  display: grid;
  grid-template-columns: 72px 1fr auto auto;
  align-items: center;
  gap: 16px;
  padding: 16px 8px;
  border-bottom: 1px solid #f0eadd;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 640px) {
    grid-template-columns: 56px 1fr;
    row-gap: 8px;
  }
`;

export const Horario = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #3d3428;
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
  color: #3d3428;

  ${(props) =>
    props.$cancelado &&
    `
      text-decoration: line-through;
      color: #d64541;
    `}
`;

export const NomeDentista = styled.span`
  font-size: 12px;
  color: #a3988a;
`;

export const EtiquetaEspecialidade = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${(props) => props.$texto};
  background-color: ${(props) => props.$fundo};
  border-radius: 999px;
  padding: 6px 16px;
  white-space: nowrap;

  @media (max-width: 640px) {
    justify-self: start;
  }
`;

export const EtiquetaStatus = styled.span`
  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
  padding: 6px 14px;
  white-space: nowrap;

  ${(props) => {
    if (props.$status === 'Cancelado') {
      return `
        background-color: #fbeaea;
        color: #d64541;
      `;
    }
    if (props.$status === 'Confirmado') {
      return `
        background-color: #e2f2e9;
        color: #2c8557;
      `;
    }
    return `
      background-color: #f1ead9;
      color: #a08a4f;
    `;
  }}

  @media (max-width: 640px) {
    justify-self: start;
  }
`;
