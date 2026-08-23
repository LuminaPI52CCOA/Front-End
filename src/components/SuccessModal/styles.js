import styled, { keyframes } from 'styled-components';

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
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Lato', sans-serif;
  overscroll-behavior: contain;
`;

export const SuccessBox = styled.div`
  background: #ffffff;
  padding: 40px 60px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);

  @media (prefers-reduced-motion: no-preference) {
    animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
`;

export const AnimatedCheck = styled.svg`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;

  circle {
    fill: none;
    stroke: #4BB543;
    stroke-width: 4;
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
  }

  path {
    fill: none;
    stroke: #4BB543;
    stroke-width: 6;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (prefers-reduced-motion: no-preference) {
    circle {
      animation: ${circleDraw} 0.6s ease-in-out forwards;
    }

    path {
      animation: ${checkDraw} 0.4s ease-in-out 0.6s forwards;
    }
  }
`;

export const SuccessTitle = styled.h2`
  margin: 0;
  color: #1a1a1a;
  font-size: 24px;
  font-family: 'Montserrat', sans-serif;
  outline: none;
`;

export const SuccessSubtitle = styled.p`
  margin: 8px 0 0 0;
  color: #666666;
  font-size: 14px;
`;
