import styled from 'styled-components';

export const Card = styled.section`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0px 10px 30px rgba(74, 55, 40, 0.08);
`;

export const Cabecalho = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
`;

export const Titulos = styled.div`
  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: #4a3728;
    margin: 0;
  }

  p {
    font-size: 13px;
    color: #9a9081;
    margin: 4px 0 0 0;
  }
`;

export const FiltroDentista = styled.div`
  min-width: 220px;
`;

export const Lista = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Vazio = styled.li`
  padding: 32px 8px;
  text-align: center;
  color: #9a9081;
  font-size: 13px;
`;
