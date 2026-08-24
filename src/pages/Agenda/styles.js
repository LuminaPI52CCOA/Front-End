import styled from 'styled-components';

export const Pagina = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px 48px;
`;

export const Titulo = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 34px;
  font-weight: 700;
  color: #4a3728;
  margin: 0 0 24px 0;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
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
