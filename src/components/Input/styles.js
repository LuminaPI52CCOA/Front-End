import styled from 'styled-components';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px; 
`;

export const Label = styled.label`
  font-family: 'Lato', sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: #1d1d1d;
  margin-bottom: 5px;
  text-align: left;
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 46px; 
  padding: 0 15px;
  padding-right: 45px; 
  background-color: #ffffff;
  border: 1.4px solid ${(props) => (props.$hasError ? '#e74c3c' : '#D8BA78')}; 
  border-radius: 8px; 
  color: #444;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  font-weight: 400;
  box-sizing: border-box;

  &:focus-visible {
    border-color: ${(props) => (props.$hasError ? '#e74c3c' : '#CC9B2E')};
    box-shadow: 0 0 0 3px rgba(201, 162, 75, 0.35);
  }

  &::placeholder {
    color: #999;
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 2px;
  cursor: pointer;
  touch-action: manipulation;

  &:hover img {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(201, 162, 75, 0.35);
  }

  img {
    width: 22px;
    height: 22px;
    display: block;
  }
`;

export const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
  display: block;
  text-align: left;
`;