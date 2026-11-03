import { useCallback } from 'react';
import { listEspecialidades } from '../services/especialidadeService';
import { useRemoteData } from './useRemoteData';

export function useEspecialidades() {
  const carregar = useCallback(() => listEspecialidades(), []);
  const { data, ...resto } = useRemoteData(carregar);

  return {
    especialidades: data ?? [],
    ...resto,
  };
}
