import styled from 'styled-components';

export const InputWrapper = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
  color: #333;
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$hasError ? '#e74c3c' : '#D8C496')};
  font-size: 14px;
  color: #333;
  outline: none;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${(props) => (props.$hasError ? '#e74c3c' : '#b8a475')};
  }

  &::placeholder {
    color: #b5b5b5;
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;