// Cores por nome de especialidade (apenas exibição). Especialidades sem cor usam o padrão do card.
export const CORES_ESPECIALIDADES = {
  'Clínica Geral': { ponto: '#4A90D9', fundo: '#E1EEF9' },
  Ortodontia: { ponto: '#7B61C9', fundo: '#ECE6FA' },
  Endodontia: { ponto: '#C9A227', fundo: '#F5E9C4' },
  Limpeza: { ponto: '#4A90D9', fundo: '#E1EEF9' },
  Periodontia: { ponto: '#3d3428', fundo: '#EAE4D8' },
  Odontopediatria: { ponto: '#E391C2', fundo: '#FBDEEC' },
};

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