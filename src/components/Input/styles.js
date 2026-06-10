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
  outline: none;
  box-sizing: border-box;

  &:focus {
   
    border-color: ${(props) => (props.$hasError ? '#e74c3c' : '#CC9B2E')};
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
  background: transparent !important;
  border: none !important;
  cursor: pointer;
  width: auto;
  height: auto;
  padding: 0 !important;
  outline: none !important;


  &:hover, &:focus, &:active {
    background: transparent !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
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