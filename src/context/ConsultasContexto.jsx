import { createContext, useContext, useMemo, useState } from 'react';
import { adicionarDias, hojeISO, inicioDaSemanaISO } from '../utils/datas';
import { buscarPaciente } from '../data/pacientes';
import { PROCEDIMENTOS } from '../data/agenda';
import { formatarTelefone } from '../utils/formatar';

const MODELOS = [
  { diaSemana: 1, inicio: '09:00', fim: '09:45', pacienteId: 2, dentista: 'Dr. Ricardo Alves', especialidade: 'Endodontia', status: 'Confirmado', observacoes: 'Retorno para sessão final.' },
  { diaSemana: 1, inicio: '10:30', fim: '11:00', pacienteId: 3, dentista: 'Dra. Fernanda Costa', especialidade: 'Limpeza', status: 'Confirmado' },
  { diaSemana: 2, inicio: '10:00', fim: '10:30', pacienteId: 3, dentista: 'Dra. Fernanda Costa', especialidade: 'Limpeza', status: 'Confirmado' },
  { diaSemana: 3, inicio: '08:15', fim: '08:45', pacienteId: 1, dentista: 'Dra. Beatriz Nunes', especialidade: 'Periodontia', status: 'Cancelado', observacoes: 'Paciente cancelou por imprevisto.' },
  { diaSemana: 4, inicio: '08:15', fim: '08:45', pacienteId: 2, dentista: 'Dr. Ricardo Alves', especialidade: 'Endodontia', status: 'Confirmado' },
  { diaSemana: 4, inicio: '09:30', fim: '10:00', pacienteId: 3, dentista: 'Dr. Ricardo Alves', especialidade: 'Endodontia', status: 'Confirmado' },
  { diaSemana: 4, inicio: '10:30', fim: '11:00', pacienteId: 1, dentista: 'Dra. Fernanda Costa', especialidade: 'Limpeza', status: 'Cancelado' },
  { diaSemana: 4, inicio: '11:15', fim: '11:45', pacienteId: 4, dentista: 'Dra. Fernanda Costa', especialidade: 'Limpeza', status: 'Cancelado', observacoes: 'Reagendar para próxima quinzena.' },
  { diaSemana: 5, inicio: '08:00', fim: '08:30', pacienteId: 4, dentista: 'Dra. Helena Prado', especialidade: 'Odontopediatria', status: 'Confirmado' },
];

const criarConsultasIniciais = () => {
  const segundaFeira = inicioDaSemanaISO(hojeISO());
  return MODELOS.map((modelo, indice) => {
    const paciente = buscarPaciente(modelo.pacienteId);
    return {
      id: `c${indice + 1}`,
      data: adicionarDias(segundaFeira, modelo.diaSemana - 1),
      inicio: modelo.inicio,
      fim: modelo.fim,
      pacienteId: modelo.pacienteId,
      telefone: paciente ? formatarTelefone(paciente.contato.telefone) : '',
      dentista: modelo.dentista,
      especialidade: modelo.especialidade,
      procedimento: PROCEDIMENTOS[modelo.especialidade] ?? '',
      status: modelo.status,
      observacoes: modelo.observacoes ?? '',
    };
  });
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