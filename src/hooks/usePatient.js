import { useCallback } from 'react';
import { listConsultas } from '../services/consultaService';
import { getPatient } from '../services/patientService';
import { buscarPaciente } from '../data/pacientes';
import { useRemoteData } from './useRemoteData';

function pacienteLocal(id) {
  const base = buscarPaciente(id);
  if (!base) return null;

  return {
    id: base.id,
    nome: base.nome,
    dataNascimento: base.dataNascimento,
    idade: base.idade,
    cpf: base.cpf ?? '',
    rg: base.rg ?? '',
    sexo: base.sexo ?? '',
    plano: base.plano ?? 'Particular',
    proximaConsulta: null,
    convenios: [],
    contato: {
      telefone: base.contato?.telefone ?? '',
      email: base.contato?.email ?? '',
      endereco: {
        texto: base.contato?.endereco
          ? `${base.contato.endereco.rua}, ${base.contato.endereco.numero}`
          : '',
        cep: base.contato?.endereco?.cep ?? '',
      },
    },
  };
}

export function usePatient(id) {
  const carregar = useCallback(async () => {
    if (!id) return null;

    const [paciente, consultas] = await Promise.all([
      getPatient(id).catch(() => pacienteLocal(id)),
      listConsultas().catch(() => []),
    ]);

    if (!paciente) return null;

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
  return { ...data, ...resto };
}