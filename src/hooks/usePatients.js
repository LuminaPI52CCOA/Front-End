import { listPatients } from '../services/patientService';
import { useRemoteData } from './useRemoteData';

const carregar = async () => {
  const pacientes = await listPatients();
  return { pacientes, consultas: [] };
};

export function usePatients() {
  const { data, ...resto } = useRemoteData(carregar);
  return { pacientes: data?.pacientes ?? [], consultas: data?.consultas ?? [], ...resto };
}
