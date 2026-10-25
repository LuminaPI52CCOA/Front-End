import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { listConsultas } from '../services/consultaService';

const ConsultasContexto = createContext(null);

export function ConsultasProvider({ children }) {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    let ativo = true;

    listConsultas()
      .then((dados) => {
        if (ativo && Array.isArray(dados)) {
          setConsultas(
            dados.map((c) => ({
              id: c.id,
              data: c.data,
              inicio: c.inicio,
              fim: c.fim,
              pacienteId: c.pacienteId,
              pacienteNome: c.pacienteNome || '',
              dentista: c.dentistaNome || '',
              dentistaId: c.dentistaId,
              especialidade: 'Clínica Geral',
              procedimento: 'Consulta Odontológica',
              status: 'Confirmado',
              observacoes: '',
            })),
          );
        }
      })
      .catch(() => {
        // Ignorar erro quando API não está disponível
      });

    return () => {
      ativo = false;
    };
  }, []);

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