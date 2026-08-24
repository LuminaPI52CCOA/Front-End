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

export const DENTISTAS = [
  'Dr. Ricardo Alves',
  'Dra. Beatriz Nunes',
  'Dra. Fernanda Costa',
  'Dra. Helena Prado',
].map((nome) => ({ value: nome, label: nome }));

export const PACIENTES = [
  'Maria Silva',
  'Ana Clara',
  'Lucia Gomes',
  'Amanda Pires',
].map((nome) => ({ value: nome, label: nome }));

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

export const AGENDAMENTOS_POR_DIA_SEMANA = {
  1: [
    {
      id: 'seg-1',
      inicio: '09:00',
      fim: '09:45',
      paciente: 'Ana Clara',
      dentista: 'Dr. Ricardo Alves',
      especialidade: 'Endodontia',
      status: 'Confirmado',
    },
    {
      id: 'seg-2',
      inicio: '10:30',
      fim: '11:00',
      paciente: 'Lucia Gomes',
      dentista: 'Dra. Fernanda Costa',
      especialidade: 'Limpeza',
      status: 'Confirmado',
    },
  ],
  2: [
    {
      id: 'ter-1',
      inicio: '10:00',
      fim: '10:30',
      paciente: 'Lucia Gomes',
      dentista: 'Dra. Fernanda Costa',
      especialidade: 'Limpeza',
      status: 'Confirmado',
    },
  ],
  3: [
    {
      id: 'qua-1',
      inicio: '08:15',
      fim: '08:45',
      paciente: 'Maria Silva',
      dentista: 'Dra. Beatriz Nunes',
      especialidade: 'Periodontia',
      status: 'Cancelado',
    },
  ],
  4: [
    {
      id: 'qui-1',
      inicio: '08:15',
      fim: '08:45',
      paciente: 'Ana Clara',
      dentista: 'Dr. Ricardo Alves',
      especialidade: 'Endodontia',
      status: 'Confirmado',
    },
    {
      id: 'qui-2',
      inicio: '09:30',
      fim: '10:00',
      paciente: 'Lucia Gomes',
      dentista: 'Dra. Helena Prado',
      especialidade: 'Odontopediatria',
      status: 'Confirmado',
    },
    {
      id: 'qui-3',
      inicio: '10:30',
      fim: '11:00',
      paciente: 'Maria Silva',
      dentista: 'Dra. Beatriz Nunes',
      especialidade: 'Limpeza',
      status: 'Cancelado',
    },
    {
      id: 'qui-4',
      inicio: '11:15',
      fim: '11:45',
      paciente: 'Amanda Pires',
      dentista: 'Dr. Ricardo Alves',
      especialidade: 'Periodontia',
      status: 'Cancelado',
    },
  ],
  5: [
    {
      id: 'sex-1',
      inicio: '08:00',
      fim: '08:30',
      paciente: 'Amanda Pires',
      dentista: 'Dra. Helena Prado',
      especialidade: 'Odontopediatria',
      status: 'Confirmado',
    },
  ],
  6: [],
};

export const CONSULTAS_DO_DIA = AGENDAMENTOS_POR_DIA_SEMANA[4];
