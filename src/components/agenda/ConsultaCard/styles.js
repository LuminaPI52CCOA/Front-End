import styled from 'styled-components';
import { CORES_ESPECIALIDADES } from '../../../data/agenda';

const obterCorEspecialidade = (especialidade) =>
  CORES_ESPECIALIDADES[especialidade] || '#8C7A5E';

export const Card = styled.div`
  position: absolute;
  left: 6px;
  right: 6px;
  background-color: ${(props) =>
    props.$cancelado ? '#fdf1f0' : props.$confirmado ? '#e7f5ec' : '#f6efdf'};
  border-left: ${(props) =>
    props.$cancelado
      ? '4px solid #d64541'
      : props.$confirmado
        ? '4px solid #3e8e5a'
        : '4px solid #8c7a5e'};
  border-radius: 8px;
  padding: 8px 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(61, 52, 40, 0.12);
  cursor: pointer;

  &:hover {
    filter: brightness(0.97);
  }
`;

export const LinhaPrincipal = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

export const NomePaciente = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) =>
    props.$cancelado ? '#d64541' : props.$confirmado ? '#2c6e47' : '#3d3428'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Horario = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #8c8272;
  white-space: nowrap;
`;

export const LinhaSecundaria = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const Especialidade = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${(props) => (props.$cancelado ? '#b03a37' : '#6f6656')};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => obterCorEspecialidade(props.$cor)};
    flex-shrink: 0;
  }
`;

export const Status = styled.span`
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  color: ${(props) =>
    props.$status === 'Cancelado'
      ? '#d64541'
      : props.$status === 'Confirmado'
        ? '#2c8557'
        : '#a08a4f'};

  span {
    margin-right: 2px;
  }
`;
