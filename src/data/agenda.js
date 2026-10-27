export const CORES_ESPECIALIDADES = {
  'Clínica Geral': { ponto: '#4A90D9', fundo: '#E1EEF9', texto: '#2f6cab' },
  Ortodontia: { ponto: '#7E57C2', fundo: '#EDE7F6', texto: '#5e35b1' },
  Endodontia: { ponto: '#C9A227', fundo: '#F5E9C4', texto: '#8a6d14' },
  Periodontia: { ponto: '#3d3428', fundo: '#EAE4D8', texto: '#3d3428' },
  Limpeza: { ponto: '#4A90D9', fundo: '#E1EEF9', texto: '#2f6cab' },
  Odontopediatria: { ponto: '#E391C2', fundo: '#FBDEEC', texto: '#b0568b' },
};

const COR_PADRAO_ESPECIALIDADE = {
  ponto: '#8C7A5E',
  fundo: '#EFE9DD',
  texto: '#4a3728',
};

export function corEspecialidade(nome) {
  return CORES_ESPECIALIDADES[nome] ?? COR_PADRAO_ESPECIALIDADE;
}

export const ESPECIALIDADES = Object.keys(CORES_ESPECIALIDADES).map((nome) => ({
  value: nome,
  label: nome,
}));

export const MESES_ABREV = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
];

export function rotuloHoje() {
  const data = new Date();
  return `Hoje: ${String(data.getDate()).padStart(2, '0')} ${
    MESES_ABREV[data.getMonth()]
  } ${data.getFullYear()}`;
}
