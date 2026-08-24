import styled from 'styled-components';

export const Card = styled.section`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Campo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #4a3728;
    letter-spacing: 0.02em;
  }
`;

export const LinhaPaciente = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Seletor = styled.select`
  flex: 1;
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

export const EnvolvedorSeletor = styled.div`
  position: relative;
  flex: 1;

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

export const BotaoNovoPaciente = styled.button`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border: none;
  border-radius: 8px;
  background-color: #cc9b2e;
  color: #ffffff;
  cursor: pointer;
  display: grid;
  place-items: center;

  &:hover,
  &:focus-visible {
    background-color: #b3871f;
  }

  svg {
    display: block;
  }
`;

export const AreaObservacoes = styled.textarea`
  min-height: 96px;
  resize: vertical;
  border: 1px solid #cc9b2e;
  border-radius: 8px;
  padding: 10px 12px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #1a1a1a;
  outline: none;

  &::placeholder {
    color: #b3aa99;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(204, 155, 46, 0.3);
  }
`;
