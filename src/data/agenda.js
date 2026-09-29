import { DENTISTAS as REGISTROS_DENTISTAS } from './dentistas';
import { PACIENTES as REGISTROS_PACIENTES } from './pacientes';

export const CORES_ESPECIALIDADES = {
  Endodontia: { ponto: '#C9A227', fundo: '#F5E9C4' },
  Limpeza: { ponto: '#4A90D9', fundo: '#E1EEF9' },
  Periodontia: { ponto: '#3d3428', fundo: '#EAE4D8' },
  Odontopediatria: { ponto: '#E391C2', fundo: '#FBDEEC' },
};

export const ESPECIALIDADES = Object.keys(CORES_ESPECIALIDADES).map((nome) => ({
  value: nome,
  label: nome,
}));

export const DENTISTAS = REGISTROS_DENTISTAS.map(({ nome }) => ({
  value: nome,
  label: nome,
}));

export const PACIENTES = REGISTROS_PACIENTES.map(({ nome }) => ({
  value: nome,
  label: nome,
}));

export const PROCEDIMENTOS = {
  Endodontia: 'Tratamento de canal',
  Limpeza: 'Profilaxia + aplicação de flúor',
  Periodontia: 'Raspagem periodontal',
  Odontopediatria: 'Aplicação de flúor',
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