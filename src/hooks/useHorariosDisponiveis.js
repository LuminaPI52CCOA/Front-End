import { useCallback } from 'react';
import { useBloqueios } from '../context/BloqueiosContexto';
import { listarHorariosDisponiveis } from '../services/consultaService';
import { useRemoteData } from './useRemoteData';

export function useHorariosDisponiveis({
  idUsuario,
  dentistaNome,
  data,
  duracao,
  idConsulta,
} = {}) {
  const { isDataBloqueada } = useBloqueios();

  const carregar = useCallback(async () => {
    if (!idUsuario || !data || !duracao) {
      return [];
    }

    const horarios = await listarHorariosDisponiveis({
      idUsuario,
      data,
      duracaoMinutos: Number(duracao),
      idConsulta,
    });

    if (!dentistaNome) {
      return horarios;
    }

    if (isDataBloqueada(dentistaNome, data, 'dia_todo')) {
      return [];
    }

    return horarios.filter((slot) => {
      const turno = slot.inicio < '13:00' ? 'manha' : 'tarde';
      return !isDataBloqueada(dentistaNome, data, turno);
    });
  }, [idUsuario, dentistaNome, data, duracao, idConsulta, isDataBloqueada]);

  const { data: horarios, loading, error, reload } = useRemoteData(carregar);

  return {
    horarios: horarios ?? [],
    carregando: Boolean(idUsuario && data && duracao) && loading,
    erro: error,
    recarregar: reload,
  };
}
