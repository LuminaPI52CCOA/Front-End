import { useCallback } from 'react';
import { listConsultas } from '../services/consultaService';
import { getPatient } from '../services/patientService';
import { useRemoteData } from './useRemoteData';

export function usePatient(id) {
  const carregar = useCallback(async () => {
    if (!id) return null;

    let pacienteData;
    let consultasData = [];
    try {
      const [pacienteResult, consultasResult] = await Promise.all([
        getPatient(id),
        listConsultas(),
      ]);
      pacienteData = pacienteResult;
      consultasData = consultasResult || [];
    } catch (err) {
      throw err;
    }

    const paciente = pacienteData;
    const consultas = consultasData;

    const plano = paciente.plano ?? 'Particular';

    const doPaciente = (consultas || [])
      .filter((c) => String(c.pacienteId) === String(paciente.id))
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
  }, [id]);

  const { data, ...resto } = useRemoteData(carregar);
  return { ...(data || {}), ...resto };
}