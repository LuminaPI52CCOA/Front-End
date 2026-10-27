import { API_ENDPOINTS } from '../api/config';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './apiClient';
import { getUsuarioSessao, isDentista } from '../utils/sessao';

export const STATUS_PARA_ROTULO = {
  AGENDADA: 'Pendente',
  CONFIRMADA: 'Confirmado',
  CANCELADA: 'Cancelado',
  CONCLUIDA: 'Finalizada',
};

export const ROTULO_PARA_STATUS = {
  Pendente: 'AGENDADA',
  Confirmado: 'CONFIRMADA',
  Cancelado: 'CANCELADA',
  Finalizada: 'CONCLUIDA',
};

const hhmm = (tempo) => (tempo ? String(tempo).slice(0, 5) : '');

const paraHHMMSS = (tempo) => {
  if (!tempo) return '';
  const limpo = String(tempo).trim();
  return limpo.length === 5 ? `${limpo}:00` : limpo;
};

export function normalizarConsulta(consulta) {
  if (!consulta) return null;
  const statusApi = String(consulta.status || 'AGENDADA').toUpperCase();

  return {
    id: String(consulta.id),
    data: consulta.data,
    inicio: hhmm(consulta.horarioInicio),
    fim: hhmm(consulta.horarioFim),
    duracaoMinutos: consulta.duracaoMinutos ?? null,
    pacienteId: consulta.cliente?.idCliente ?? null,
    pacienteNome: consulta.cliente?.nome ?? '',
    telefone: consulta.cliente?.numeroCelular ?? '',
    dentistaId: consulta.usuario?.idUsuario ?? null,
    dentistaNome: consulta.usuario?.nome ?? '',
    dentista: consulta.usuario?.nome ?? '',
    especialidadeId: consulta.especialidade?.idEspecialidade ?? null,
    especialidade: consulta.especialidade?.nome ?? 'Clínica Geral',
    status: STATUS_PARA_ROTULO[statusApi] ?? 'Pendente',
    statusApi,
    observacoes: consulta.observacoes ?? '',
    dentes: Array.isArray(consulta.dentes) ? consulta.dentes : [],
    tipoDente: consulta.tipoDente ?? '',
    pularOdontograma: Boolean(consulta.pularOdontograma),
  };
}

export async function listConsultas({ dataInicio, dataFim, dentistaId } = {}) {
  const qs = new URLSearchParams();
  if (dataInicio) qs.set('dataInicio', dataInicio);
  if (dataFim) qs.set('dataFim', dataFim);

  const sessao = getUsuarioSessao();
  const idDentistaAlvo = dentistaId ?? (isDentista() ? sessao?.userId : null);

  let base = idDentistaAlvo
    ? API_ENDPOINTS.CONSULTAS_DENTISTA(idDentistaAlvo)
    : API_ENDPOINTS.CONSULTAS;

  const sufixo = qs.toString() ? `?${qs.toString()}` : '';

  try {
    const consultas = await apiGet(`${base}${sufixo}`);
    return (Array.isArray(consultas) ? consultas : []).map(normalizarConsulta);
  } catch (error) {
    if (error?.status === 403 && !idDentistaAlvo && sessao?.userId) {
      base = API_ENDPOINTS.CONSULTAS_DENTISTA(sessao.userId);
      const consultas = await apiGet(`${base}${sufixo}`);
      return (Array.isArray(consultas) ? consultas : []).map(normalizarConsulta);
    }
    throw error;
  }
}

export async function buscarConsultaPorId(id) {
  const consulta = await apiGet(API_ENDPOINTS.CONSULTA(id));
  return normalizarConsulta(consulta);
}

export async function criarConsulta(dados) {
  const pular = Boolean(dados.pularOdontograma);
  const payload = {
    idCliente: Number(dados.idCliente),
    idUsuario: Number(dados.idUsuario),
    idEspecialidade: Number(dados.idEspecialidade),
    data: dados.data,
    horarioInicio: paraHHMMSS(dados.horarioInicio ?? dados.inicio),
    horarioFim: paraHHMMSS(dados.horarioFim ?? dados.fim),
    observacoes: dados.observacoes?.trim() ? dados.observacoes.trim() : null,
    pularOdontograma: pular,
    dentes: pular ? [] : (dados.dentes ?? []),
    tipoDente: pular ? null : (dados.tipoDente || null),
  };

  const criada = await apiPost(API_ENDPOINTS.CONSULTAS, payload);
  return normalizarConsulta(criada);
}

export async function reagendarConsulta(id, dados) {
  const payload = {
    data: dados.data,
    horarioInicio: paraHHMMSS(dados.horarioInicio ?? dados.inicio),
    horarioFim: paraHHMMSS(dados.horarioFim ?? dados.fim),
  };
  if (dados.observacoes !== undefined) {
    payload.observacoes = dados.observacoes;
  }

  const atualizada = await apiPut(API_ENDPOINTS.CONSULTA(id), payload);
  return normalizarConsulta(atualizada);
}

export async function alterarStatusConsulta(id, rotuloOuStatusApi) {
  const status = ROTULO_PARA_STATUS[rotuloOuStatusApi] ?? rotuloOuStatusApi;
  const atualizada = await apiPatch(API_ENDPOINTS.CONSULTA_STATUS(id), { status });
  return normalizarConsulta(atualizada);
}

export async function cancelarConsulta(id) {
  await apiDelete(API_ENDPOINTS.CONSULTA(id));
  return true;
}

export async function listarHorariosDisponiveis({
  idUsuario,
  data,
  duracaoMinutos,
  idConsulta,
}) {
  if (!idUsuario || !data || !duracaoMinutos) return [];

  const qs = new URLSearchParams({
    idUsuario: String(idUsuario),
    data: String(data),
    duracaoMinutos: String(duracaoMinutos),
  });
  if (idConsulta) {
    qs.set('idConsulta', String(idConsulta));
  }

  const resposta = await apiGet(`${API_ENDPOINTS.HORARIOS_DISPONIVEIS}?${qs.toString()}`);
  if (!Array.isArray(resposta)) return [];

  return resposta.map((slot) => ({
    inicio: hhmm(slot.horarioInicio),
    fim: hhmm(slot.horarioFim),
  }));
}
