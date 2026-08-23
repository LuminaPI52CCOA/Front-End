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
  color: #333333;
  font-family: 'Poppins', sans-serif;
  appearance: none; 
  background-color: #ffffff;
  cursor: pointer;
  position: relative;
  z-index: 2;

  &:focus-visible {
    border-color: #CC9B2E;
    box-shadow: 0 0 0 3px rgba(201, 162, 75, 0.35);
  }
`;

export const Arrow = styled.div`
  position: absolute;
  right: 16px;
  top: 38px;
  font-size: 12px;
  color: #555;
  z-index: 1;
`;