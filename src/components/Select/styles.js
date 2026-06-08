import styled from 'styled-components';

export const SelectWrapper = styled.div`
  margin-bottom: 24px;
  text-align: left;
  position: relative;
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
  color: #333;
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid #D8C496;
  font-size: 14px;
  color: #333;
  outline: none;
  font-family: 'Poppins', sans-serif;
  appearance: none; /* Remove a setinha padrão feia do navegador */
  background-color: transparent;
  cursor: pointer;
  position: relative;
  z-index: 2;
`;

export const Arrow = styled.div`
  position: absolute;
  right: 16px;
  top: 38px;
  font-size: 12px;
  color: #555;
  z-index: 1;
`;