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

export const EnvolvedorAutocomplete = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

export const CampoBusca = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #cc9b2e;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 11px 12px;
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

export const ListaSuspensa = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 30;
  background-color: #ffffff;
  border: 1px solid #e3c87a;
  border-radius: 8px;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  max-height: 190px;
  overflow-y: auto;
  box-shadow: 0 8px 18px rgba(61, 52, 40, 0.12);
`;

export const ItemOpcao = styled.li`
  > button {
    display: block;
    width: 100%;
    text-align: left;
    background-color: transparent;
    border: none;
    padding: 9px 14px;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #1a1a1a;
    cursor: pointer;
  }

  &:hover > button,
  > button:focus-visible {
    background-color: #f6efdd;
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

export const EnvolvedorSeletor = styled.div`
  position: relative;
  width: 100%;

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
  box-sizing: border-box;
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

export const AreaObservacoes = styled.textarea`
  width: 100%;
  box-sizing: border-box;
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
