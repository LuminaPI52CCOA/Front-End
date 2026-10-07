import { listDoctors } from '../services/doctorService';
import { listConsultas } from '../services/consultaService';
import { useRemoteData } from './useRemoteData';

const carregar = async () => {
  const [dentistas, consultas] = await Promise.all([listDoctors(), listConsultas()]);
  return { dentistas, consultas };
};

export function useDoctors() {
  const { data, ...resto } = useRemoteData(carregar);
  return { dentistas: data?.dentistas ?? [], consultas: data?.consultas ?? [], ...resto };
}
