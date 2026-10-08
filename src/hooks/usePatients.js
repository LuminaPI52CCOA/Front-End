import { listPatients } from '../services/patientService';
import { listConsultas } from '../services/consultaService';
import { useRemoteData } from './useRemoteData';

const carregar = async () => {
  const [pacientes, consultas] = await Promise.all([listPatients(), listConsultas()]);
  return { pacientes, consultas };
};

export function usePatients() {
  const { data, ...resto } = useRemoteData(carregar);
  return { pacientes: data?.pacientes ?? [], consultas: data?.consultas ?? [], ...resto };
}
