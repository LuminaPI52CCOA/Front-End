import { useCallback, useMemo } from 'react';
import { extrairAlertasClinicos, listAnamneses } from '../services/anamneseService';
import { useRemoteData } from './useRemoteData';

export function useAnamneses(clienteId) {
  const carregar = useCallback(async () => {
    if (!clienteId) return [];
    return listAnamneses(clienteId);
  }, [clienteId]);

  const { data, loading, error, reload } = useRemoteData(carregar);
  const anamneses = useMemo(() => data ?? [], [data]);
  const fichaMaisRecente = anamneses[0] ?? null;
  const alertasClinicos = useMemo(
    () => (fichaMaisRecente ? extrairAlertasClinicos(fichaMaisRecente) : []),
    [fichaMaisRecente],
  );

  return {
    anamneses,
    fichaMaisRecente,
    alertasClinicos,
    loading,
    error,
    reload,
  };
}
