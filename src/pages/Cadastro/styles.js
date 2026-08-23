import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export const Card = styled.div`
  background-color: #FFFFFF;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #D8C496; 
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export const Logo = styled.img`
  width: 80px; 
  height: auto;
  margin-bottom: 15px;
  display: block; 
  margin-left: auto;
  margin-right: auto;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1A1A1A;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 13px;
  color: #666;
  margin: 4px 0 0 0;
`;

export const FooterText = styled.div`
  text-align: center;
  font-size: 13px;
  color: #666;

  a {
    color: #D8C496;
    font-weight: 600;
    text-decoration: none;
    margin-left: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;
