import styled from 'styled-components';

export const Card = styled.section`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0px 10px 30px rgba(74, 55, 40, 0.08);
`;

export const Cabecalho = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

export const Titulos = styled.div`
  h2 {
    font-family: 'Montserrat', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
    text-align: left;
  }

  p {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #7b5900;
    margin: 4px 0 0 0;

    span {
      color: #cc9b2e;
    }
  }
`;

export const Filtro = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #4a3728;
    white-space: nowrap;
  }
`;

export const SeletorWrap = styled.div`
  position: relative;

  select {
    appearance: none;
    background-color: #f6f0e8;
    border: 1px solid #e5e0d8;
    border-radius: 8px;
    padding: 10px 34px 10px 12px;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #3d3428;
    cursor: pointer;
    outline: none;

    &:focus-visible {
      border-color: #cc9b2e;
      box-shadow: 0 0 0 2px rgba(204, 155, 46, 0.25);
    }
  }

  .seta {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    pointer-events: none;
  }
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
