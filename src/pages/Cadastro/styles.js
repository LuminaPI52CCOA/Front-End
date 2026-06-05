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
  border-top: 4px solid #D8C496; /* Linha dourada no topo da imagem */
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export const Logo = styled.div`
  font-size: 50px;
  margin-bottom: 10px;
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


// animacao de modal - keyframes para o pop-in do modal e para a animação do check de sucesso
import { keyframes } from 'styled-components';

const popIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const circleDraw = keyframes`
  0% { stroke-dashoffset: 283; }
  100% { stroke-dashoffset: 0; }
`;

const checkDraw = keyframes`
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px); /* Embaça o fundo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const SuccessBox = styled.div`
  background: #FFFFFF;
  padding: 40px 60px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0px 20px 40px rgba(0,0,0,0.2);
  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
`;

export const AnimatedCheck = styled.svg`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;

  circle {
    fill: none;
    stroke: #4BB543; /* Verde sucesso padrão */
    stroke-width: 4;
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    animation: ${circleDraw} 0.6s ease-in-out forwards;
  }

  path {
    fill: none;
    stroke: #4BB543;
    stroke-width: 6;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    stroke-linecap: round;
    stroke-linejoin: round;
    animation: ${checkDraw} 0.4s ease-in-out 0.6s forwards; /* O 0.6s faz esperar o círculo terminar */
  }
`;

export const SuccessTitle = styled.h2`
  margin: 0;
  color: #1A1A1A;
  font-size: 24px;
`;

export const SuccessSubtitle = styled.p`
  margin: 8px 0 0 0;
  color: #666;
  font-size: 14px;
`;