import { useCallback } from 'react';
import { listPatientsPaginated } from '../services/patientService';
import { useRemoteData } from './useRemoteData';

const PAGE_INFO_PADRAO = {
  page: 0,
  size: 6,
  offset: 0,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

export function usePatients({
  page = 0,
  size = 100,
  sort = 'nome,asc',
  nome = '',
} = {}) {
  const carregar = useCallback(async () => {
    const resultado = await listPatientsPaginated({ page, size, sort, nome });
    return {
      pacientes: resultado.content,
      pageInfo: resultado.pageInfo,
      consultas: [],
    };
  }, [page, size, sort, nome]);

  const { data, ...resto } = useRemoteData(carregar);
  return {
    pacientes: data?.pacientes ?? [],
    pageInfo: data?.pageInfo ?? { ...PAGE_INFO_PADRAO, page, size, offset: page * size },
    consultas: data?.consultas ?? [],
    ...resto,
  };
}
