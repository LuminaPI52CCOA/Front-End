import { createContext, useContext, useMemo, useState } from 'react';
import { adicionarDias, hojeISO, inicioDaSemanaISO } from '../utils/datas';

const TELEFONES = {
  'Ana Clara': '(11) 98812-3344',
  'Lucia Gomes': '(21) 99555-1010',
  'Maria Silva': '(31) 98123-4567',
  'Amanda Pires': '(41) 99674-2210',
};

const PROCEDIMENTOS = {
  Endodontia: 'Tratamento de canal',
  Limpeza: 'Profilaxia + aplicação de flúor',
  Periodontia: 'Raspagem periodontal',
  Odontopediatria: 'Aplicação de flúor',
};

const MODELOS = [
  { diaSemana: 1, inicio: '09:00', fim: '09:45', paciente: 'Ana Clara', dentista: 'Dr. Ricardo Alves', especialidade: 'Endodontia', status: 'Confirmado', observacoes: 'Retorno para sessão final.' },
  { diaSemana: 1, inicio: '10:30', fim: '11:00', paciente: 'Lucia Gomes', dentista: 'Dra. Fernanda Costa', especialidade: 'Limpeza', status: 'Confirmado' },
  { diaSemana: 2, inicio: '10:00', fim: '10:30', paciente: 'Lucia Gomes', dentista: 'Dra. Fernanda Costa', especialidade: 'Limpeza', status: 'Confirmado' },
  { diaSemana: 3, inicio: '08:15', fim: '08:45', paciente: 'Maria Silva', dentista: 'Dra. Beatriz Nunes', especialidade: 'Periodontia', status: 'Cancelado', observacoes: 'Paciente cancelou por imprevisto.' },
  { diaSemana: 4, inicio: '08:15', fim: '08:45', paciente: 'Ana Clara', dentista: 'Dr. Ricardo Alves', especialidade: 'Endodontia', status: 'Confirmado' },
  { diaSemana: 4, inicio: '09:30', fim: '10:00', paciente: 'Lucia Gomes', dentista: 'Dra. Helena Prado', especialidade: 'Odontopediatria', status: 'Confirmado' },
  { diaSemana: 4, inicio: '10:30', fim: '11:00', paciente: 'Maria Silva', dentista: 'Dra. Beatriz Nunes', especialidade: 'Limpeza', status: 'Cancelado' },
  { diaSemana: 4, inicio: '11:15', fim: '11:45', paciente: 'Amanda Pires', dentista: 'Dr. Ricardo Alves', especialidade: 'Periodontia', status: 'Cancelado', observacoes: 'Reagendar para próxima quinzena.' },
  { diaSemana: 5, inicio: '08:00', fim: '08:30', paciente: 'Amanda Pires', dentista: 'Dra. Helena Prado', especialidade: 'Odontopediatria', status: 'Confirmado' },
];

const criarConsultasIniciais = () => {
  const segundaFeira = inicioDaSemanaISO(hojeISO());
  return MODELOS.map((modelo, indice) => ({
    id: `c${indice + 1}`,
    data: adicionarDias(segundaFeira, modelo.diaSemana - 1),
    inicio: modelo.inicio,
    fim: modelo.fim,
    paciente: modelo.paciente,
    telefone: TELEFONES[modelo.paciente] ?? '',
    dentista: modelo.dentista,
    especialidade: modelo.especialidade,
    procedimento: PROCEDIMENTOS[modelo.especialidade] ?? '',
    status: modelo.status,
    observacoes: modelo.observacoes ?? '',
  }));
};

const ConsultasContexto = createContext(null);

export function ConsultasProvider({ children }) {
  const [consultas, setConsultas] = useState(criarConsultasIniciais);

  const valor = useMemo(
    () => ({
      consultas,
      adicionarConsulta: (nova) =>
        setConsultas((atual) => [
          ...atual,
          { id: `c${Date.now()}`, ...nova },
        ]),
      atualizarConsulta: (id, mudancas) =>
        setConsultas((atual) =>
          atual.map((consulta) =>
            consulta.id === id ? { ...consulta, ...mudancas } : consulta,
          ),
        ),
      removerConsulta: (id) =>
        setConsultas((atual) =>
          atual.filter((consulta) => consulta.id !== id),
        ),
    }),
    [consultas],
  );

  return (
    <ConsultasContexto.Provider value={valor}>
      {children}
    </ConsultasContexto.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useConsultas = () => useContext(ConsultasContexto);
