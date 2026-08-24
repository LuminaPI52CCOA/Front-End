export const CORES_ESPECIALIDADES = {
  Endodontia: '#C9A227',
  Limpeza: '#4A90D9',
  Periodontia: '#202020',
  Odontopediatria: '#E391C2',
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
  'Ana Clara Souza',
  'Amanda Pires',
  'Bruno Carvalho',
  'Carlos Menezes',
  'Marina Duarte',
  'Rafael Monteiro',
].map((nome) => ({ value: nome, label: nome }));

export const SEMANA = [
  { diaSemana: 'SEG', dia: 27, mes: 'OUT', hoje: false },
  { diaSemana: 'TER', dia: 28, mes: 'OUT', hoje: false },
  { diaSemana: 'QUA', dia: 29, mes: 'OUT', hoje: false },
  { diaSemana: 'QUI', dia: 30, mes: 'OUT', hoje: true },
  { diaSemana: 'SEX', dia: 31, mes: 'OUT', hoje: false },
  { diaSemana: 'SÁB', dia: 1, mes: 'NOV', hoje: false },
];

export const AGENDAMENTOS_POR_DIA = {
  27: [
    {
      id: 'a27-1',
      inicio: '08:00',
      fim: '08:45',
      paciente: 'Ana Clara Souza',
      dentista: 'Dr. Ricardo Alves',
      especialidade: 'Endodontia',
      status: 'Confirmado',
    },
    {
      id: 'a27-2',
      inicio: '10:00',
      fim: '10:30',
      paciente: 'Rafael Monteiro',
      dentista: 'Dra. Fernanda Costa',
      especialidade: 'Limpeza',
      status: 'Agendado',
    },
  ],
  28: [
    {
      id: 'a28-1',
      inicio: '08:30',
      fim: '09:00',
      paciente: 'Bruno Carvalho',
      dentista: 'Dra. Fernanda Costa',
      especialidade: 'Limpeza',
      status: 'Agendado',
    },
    {
      id: 'a28-2',
      inicio: '09:30',
      fim: '10:15',
      paciente: 'Carlos Menezes',
      dentista: 'Dr. Ricardo Alves',
      especialidade: 'Periodontia',
      status: 'Confirmado',
    },
  ],
  29: [
    {
      id: 'a29-1',
      inicio: '08:15',
      fim: '08:45',
      paciente: 'Amanda Pires',
      dentista: 'Dra. Beatriz Nunes',
      especialidade: 'Periodontia',
      status: 'Cancelado',
    },
    {
      id: 'a29-2',
      inicio: '11:00',
      fim: '11:30',
      paciente: 'Marina Duarte',
      dentista: 'Dra. Helena Prado',
      especialidade: 'Odontopediatria',
      status: 'Confirmado',
    },
  ],
  30: [
    {
      id: 'a30-1',
      inicio: '08:15',
      fim: '08:45',
      paciente: 'Ana Clara Souza',
      dentista: 'Dr. Ricardo Alves',
      especialidade: 'Endodontia',
      status: 'Confirmado',
    },
    {
      id: 'a30-2',
      inicio: '09:00',
      fim: '09:30',
      paciente: 'Carlos Menezes',
      dentista: 'Dra. Helena Prado',
      especialidade: 'Odontopediatria',
      status: 'Confirmado',
    },
    {
      id: 'a30-3',
      inicio: '10:30',
      fim: '11:00',
      paciente: 'Marina Duarte',
      dentista: 'Dra. Beatriz Nunes',
      especialidade: 'Limpeza',
      status: 'Agendado',
    },
    {
      id: 'a30-4',
      inicio: '11:15',
      fim: '11:45',
      paciente: 'Amanda Pires',
      dentista: 'Dr. Ricardo Alves',
      especialidade: 'Periodontia',
      status: 'Cancelado',
    },
  ],
  31: [
    {
      id: 'a31-1',
      inicio: '09:00',
      fim: '09:45',
      paciente: 'Rafael Monteiro',
      dentista: 'Dr. Ricardo Alves',
      especialidade: 'Periodontia',
      status: 'Agendado',
    },
  ],
};

export const CONSULTAS_DO_DIA = AGENDAMENTOS_POR_DIA[30];

export const HORARIO_INICIO = 8;
export const HORARIO_FIM = 12;
