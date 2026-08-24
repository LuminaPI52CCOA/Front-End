import styled from 'styled-components';

export const BarraSuperior = styled.header`
  background-color: #ffffff;
  width: 100%;
  box-shadow: 0 1px 0 rgba(74, 55, 40, 0.06);
`;

export const ConteudoBarra = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 18px 24px;
`;

export const Titulo = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #7b5900;
  text-align: left;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const Pagina = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 24px 48px;
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const ColunaLateral = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ColunaPrincipal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;
