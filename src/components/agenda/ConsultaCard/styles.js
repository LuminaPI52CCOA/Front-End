import styled from 'styled-components';

export const Card = styled.div`
  width: 100%;
  height: 100%;
  min-height: 70px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px 8px;
  background-color: ${(props) =>
    props.$cancelado ? '#faf0ec' : '#f8f5f0'};
  border-left: ${(props) => `4px solid ${props.$corBorda}`};
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  transform: ${(props) => (props.$selecionado ? 'scale(1.05)' : 'none')};
  box-shadow: ${(props) =>
    props.$selecionado
      ? '0 8px 20px rgba(0, 0, 0, 0.15)'
      : '0 1px 4px rgba(61, 52, 40, 0.08)'};
  z-index: ${(props) => (props.$selecionado ? 50 : 'auto')};

  @media (max-width: 768px) {
    min-height: 56px;
    padding: 4px 6px;
  }
`;

export const NomePaciente = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.1;
  color: #1a1a1a;
  overflow-wrap: anywhere;
`;

export const Dentista = styled.span`
  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1.2;
  color: #6b6b6b;
  overflow-wrap: anywhere;
`;

export const Especialidade = styled.span`
  font-size: 0.6875rem;
  line-height: 1.2;
  color: #6b6b6b;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  overflow-wrap: anywhere;

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: ${(props) => props.$corPonto};
    flex-shrink: 0;
  }
`;

export const Status = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.2;
  color: ${(props) =>
    props.$status === 'Cancelado' ? '#c62828' : '#2e7d32'};

  span {
    margin-right: 3px;
  }
`;
