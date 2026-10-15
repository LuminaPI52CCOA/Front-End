import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const BloqueiosContexto = createContext(null);

const inicializarBloqueios = () => {
  const salvos = localStorage.getItem('bloqueios-agenda');
  if (salvos) {
    try {
      return JSON.parse(salvos);
    } catch {
      return [];
    }
  }
  return [];
};

const salvarBloqueios = (bloqueios) => {
  localStorage.setItem('bloqueios-agenda', JSON.stringify(bloqueios));
};

export function BloqueiosProvider({ children }) {
  const [bloqueios, setBloqueios] = useState(inicializarBloqueios);

  const adicionarBloqueio = useCallback((novo) => {
    setBloqueios((atual) => {
      const atualizados = [...atual, { id: `b${Date.now()}`, ...novo }];
      salvarBloqueios(atualizados);
      return atualizados;
    });
  }, []);

  const removerBloqueio = useCallback((id) => {
    setBloqueios((atual) => {
      const atualizados = atual.filter((b) => b.id !== id);
      salvarBloqueios(atualizados);
      return atualizados;
    });
  }, []);

  const obterBloqueiosPorDentista = useCallback((dentistaNome) => {
    return bloqueios.filter((b) => b.dentista === dentistaNome);
  }, [bloqueios]);

  const isDataBloqueada = useCallback((dentistaNome, dataISO, turno) => {
    return bloqueios.some((b) => {
      if (b.dentista !== dentistaNome) return false;
      
      const inicio = b.dataInicio;
      const fim = b.dataFim || b.dataInicio;
      
      if (dataISO < inicio || dataISO > fim) return false;
      
      if (b.turno === 'dia_todo') return true;
      if (b.turno === turno) return true;
      
      return false;
    });
  }, [bloqueios]);

  const obterMotivoBloqueio = useCallback((dentistaNome, dataISO, turno) => {
    const bloqueio = bloqueios.find((b) => {
      if (b.dentista !== dentistaNome) return false;
      
      const inicio = b.dataInicio;
      const fim = b.dataFim || b.dataInicio;
      
      if (dataISO < inicio || dataISO > fim) return false;
      
      if (b.turno === 'dia_todo') return true;
      if (b.turno === turno) return true;
      
      return false;
    });
    
    return bloqueio?.motivo || '';
  }, [bloqueios]);

  const valor = useMemo(
    () => ({
      bloqueios,
      adicionarBloqueio,
      removerBloqueio,
      obterBloqueiosPorDentista,
      isDataBloqueada,
      obterMotivoBloqueio,
    }),
    [bloqueios, adicionarBloqueio, removerBloqueio, obterBloqueiosPorDentista, isDataBloqueada, obterMotivoBloqueio],
  );

  return (
    <BloqueiosContexto.Provider value={valor}>
      {children}
    </BloqueiosContexto.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBloqueios = () => useContext(BloqueiosContexto);