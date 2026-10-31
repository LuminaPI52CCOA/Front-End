import { useCallback } from 'react';
import { listarHorariosDisponiveis } from '../services/consultaService';
import { useRemoteData } from './useRemoteData';

export function useHorariosDisponiveis({ idUsuario, data, duracao, idConsulta } = {}) {
  const carregar = useCallback(async () => {
    if (!idUsuario || !data || !duracao) {
      return [];
    }
    return listarHorariosDisponiveis({
      idUsuario,
      data,
      duracaoMinutos: Number(duracao),
      idConsulta,
    });
  }, [idUsuario, data, duracao, idConsulta]);

  const { data: horarios, loading, error, reload } = useRemoteData(carregar);

  return {
    horarios: horarios ?? [],
    carregando: Boolean(idUsuario && data && duracao) && loading,
    erro: error,
    recarregar: reload,
  };
}
