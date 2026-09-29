export const paraISO = (data) =>
  `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(
    data.getDate(),
  ).padStart(2, '0')}`;

export const deISO = (iso) => new Date(`${iso}T00:00:00`);

export const hojeISO = () => paraISO(new Date());

export const adicionarDias = (iso, quantidade) => {
  const data = deISO(iso);
  data.setDate(data.getDate() + quantidade);
  return paraISO(data);
};

export const inicioDaSemanaISO = (iso) => {
  const data = deISO(iso);
  const deslocamento = (data.getDay() + 6) % 7;
  data.setDate(data.getDate() - deslocamento);
  return paraISO(data);
};

export const mesmaSemana = (a, b) =>
  inicioDaSemanaISO(a) === inicioDaSemanaISO(b);
