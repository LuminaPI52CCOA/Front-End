import { useCallback } from 'react';
import { listDoctorsPaginated } from '../services/doctorService';
import { listConsultas } from '../services/consultaService';
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

export function useDoctors({
  page = 0,
  size = 100,
  sort = 'nome,asc',
  nome = '',
} = {}) {
  const carregar = useCallback(async () => {
    const [resultadoDentistas, consultas] = await Promise.all([
      listDoctorsPaginated({ page, size, sort, nome }),
      listConsultas(),
    ]);
    return {
      dentistas: resultadoDentistas.content,
      pageInfo: resultadoDentistas.pageInfo,
      consultas,
    };
  }, [page, size, sort, nome]);

  const { data, ...resto } = useRemoteData(carregar);
  return {
    dentistas: data?.dentistas ?? [],
    pageInfo: data?.pageInfo ?? { ...PAGE_INFO_PADRAO, page, size, offset: page * size },
    consultas: data?.consultas ?? [],
    ...resto,
  };
}
