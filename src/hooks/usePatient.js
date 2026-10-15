import { listConsultas } from '../services/consultaService';
import { getPatient, getConveniosDoPaciente } from '../services/patientService';
import { useRemoteData } from './useRemoteData';

export function usePatient(id) {
  const carregar = async () => {
    const [paciente, convenios, consultas] = await Promise.all([
      getPatient(id),
      getConveniosDoPaciente(id).catch(() => []),
      listConsultas().catch(() => []),
    ]);

    const plano = convenios[0]?.nome ?? 'Particular';

    const doPaciente = consultas
      .filter((c) => c.pacienteId === paciente.id)
      .sort((a, b) => {
        if (a.data !== b.data) return a.data.localeCompare(b.data);
        return (a.inicio || '').localeCompare(b.inicio || '');
      });

    const hoje = new Date().toISOString().split('T')[0];
    const passadas = doPaciente.filter((c) => c.data < hoje);
    const vindouras = doPaciente.filter((c) => c.data >= hoje);

    return {
      paciente: { ...paciente, plano },
      ultima: passadas[passadas.length - 1] ?? null,
      proxima: vindouras[0] ?? null,
    };
  };

  const { data, ...resto } = useRemoteData(carregar);
  return { ...data, ...resto };
}