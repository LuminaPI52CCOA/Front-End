import { createContext, useContext, useMemo, useState } from 'react';
import { hojeISO } from '../utils/datas';

const ConsultasContexto = createContext(null);

const CONSULTAS_EXEMPLO = [
  {
    id: 'ex1',
    data: hojeISO(),
    inicio: '08:00',
    fim: '08:15',
    pacienteId: 1,
    pacienteNome: 'Maria Silva',
    dentista: 'Dra. Mariana Alves',
    dentistaId: 1,
    especialidade: 'Limpeza',
    procedimento: 'Profilaxia + aplicação de flúor',
    status: 'Finalizada',
    observacoes: '',
  },
  {
    id: 'ex2',
    data: hojeISO(),
    inicio: '08:30',
    fim: '09:00',
    pacienteId: 2,
    pacienteNome: 'Ana Clara',
    dentista: 'Dr. Rafael Costa',
    dentistaId: 2,
    especialidade: 'Endodontia',
    procedimento: 'Tratamento de canal',
    status: 'Confirmado',
    observacoes: '',
  },
  {
    id: 'ex3',
    data: hojeISO(),
    inicio: '09:15',
    fim: '09:30',
    pacienteId: 4,
    pacienteNome: 'Amanda Pires',
    dentista: 'Dra. Camila Ferreira',
    dentistaId: 3,
    especialidade: 'Odontopediatria',
    procedimento: 'Aplicação de flúor',
    status: 'Confirmado',
    observacoes: '',
  },
  {
    id: 'ex4',
    data: hojeISO(),
    inicio: '10:00',
    fim: '10:45',
    pacienteId: 3,
    pacienteNome: 'Lucia Gomes',
    dentista: 'Dr. Bruno Martins',
    dentistaId: 4,
    especialidade: 'Periodontia',
    procedimento: 'Raspagem periodontal',
    status: 'Pendente',
    observacoes: '',
  },
  {
    id: 'ex5',
    data: hojeISO(),
    inicio: '14:00',
    fim: '14:15',
    pacienteId: 5,
    pacienteNome: 'Carolina Nogueira',
    dentista: 'Dra. Helena Souza',
    dentistaId: 5,
    especialidade: 'Limpeza',
    procedimento: 'Profilaxia + aplicação de flúor',
    status: 'Cancelado',
    observacoes: '',
  },
];

export function ConsultasProvider({ children }) {
  const [consultas, setConsultas] = useState(CONSULTAS_EXEMPLO);

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