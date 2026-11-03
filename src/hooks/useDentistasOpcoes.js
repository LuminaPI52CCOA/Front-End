import { useCallback } from 'react';
import { listDentistasOpcoes } from '../services/doctorService';
import { useRemoteData } from './useRemoteData';

export function useDentistasOpcoes(nome = '') {
  const carregar = useCallback(() => listDentistasOpcoes({ nome }), [nome]);
  const { data, ...resto } = useRemoteData(carregar);

  return {
    dentistas: data ?? [],
    ...resto,
  };
}
