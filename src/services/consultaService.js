import { API_ENDPOINTS } from '../api/config';
import { requisitarApi } from '../api/requisicao';
import { formatarTelefone } from '../utils/formatar';

// AGENDADA é o status inicial; só vira "Confirmado" quando o paciente/recepção confirma.
export const STATUS_API_PARA_ROTULO = {
  AGENDADA: 'Agendado',
  CONFIRMADA: 'Confirmado',
  CANCELADA: 'Cancelado',
  CONCLUIDA: 'Concluído',
};

export const STATUS_ROTULO_PARA_API = {
  Agendado: 'AGENDADA',
  Confirmado: 'CONFIRMADA',
  Cancelado: 'CANCELADA',
};

const paraHHMM = (horario) => (horario ? horario.slice(0, 5) : '');

export const paraHorarioApi = (hhmm) => (hhmm.length === 5 ? `${hhmm}:00` : hhmm);

/**
 * Converte ConsultaResponse para o formato usado pelos componentes da agenda.
 */
export function mapearConsultaDaApi(api) {
  return {
    id: String(api.id),
    data: api.data,
    inicio: paraHHMM(api.horarioInicio),
    fim: paraHHMM(api.horarioFim),
    duracaoMinutos: api.duracaoMinutos ?? null,
    idCliente: api.cliente?.idCliente ?? null,
    paciente: api.cliente?.nome ?? '',
    telefone: api.cliente?.numeroCelular ? formatarTelefone(api.cliente.numeroCelular) : '',
    idUsuario: api.usuario?.idUsuario ?? null,
    dentista: api.usuario?.nome ?? '',
    idEspecialidade: api.especialidade?.idEspecialidade ?? null,
    especialidade: api.especialidade?.nome ?? '',
    statusApi: api.status,
    status: STATUS_API_PARA_ROTULO[api.status] ?? api.status,
    procedimento: '',
    observacoes: api.observacoes ?? '',
    dentes: api.dentes ?? [],
    tipoDente: api.tipoDente ?? '',
    pularOdontograma: Boolean(api.pularOdontograma),
  };
}

const mapearLista = (lista) => (lista ?? []).map(mapearConsultaDaApi);

export const consultaService = {
  async listar({ dataInicio, dataFim } = {}) {
    return mapearLista(
      await requisitarApi(API_ENDPOINTS.CONSULTAS, { parametros: { dataInicio, dataFim } }),
    );
  },

  async listarDoDentista(idUsuario, { dataInicio, dataFim } = {}) {
    return mapearLista(
      await requisitarApi(`${API_ENDPOINTS.CONSULTAS_DENTISTA}/${idUsuario}`, {
        parametros: { dataInicio, dataFim },
      }),
    );
  },

  async cadastrar(dados) {
    return mapearConsultaDaApi(
      await requisitarApi(API_ENDPOINTS.CONSULTAS, { method: 'POST', corpo: dados }),
    );
  },

  async reagendar(id, { data, horarioInicio, horarioFim, observacoes }) {
    return mapearConsultaDaApi(
      await requisitarApi(`${API_ENDPOINTS.CONSULTAS}/${id}`, {
        method: 'PUT',
        corpo: {
          data,
          horarioInicio: paraHorarioApi(horarioInicio),
          horarioFim: paraHorarioApi(horarioFim),
          observacoes,
        },
      }),
    );
  },

  async alterarStatus(id, statusApi) {
    return mapearConsultaDaApi(
      await requisitarApi(`${API_ENDPOINTS.CONSULTAS}/${id}/status`, {
        method: 'PATCH',
        corpo: { status: statusApi },
      }),
    );
  },

  async cancelar(id) {
    await requisitarApi(`${API_ENDPOINTS.CONSULTAS}/${id}`, { method: 'DELETE' });
  },

  /** Retorna [{ horarioInicio: 'HH:mm:ss', horarioFim: 'HH:mm:ss' }]. */
  async buscarHorariosDisponiveis({ idUsuario, data, duracaoMinutos, idConsulta }, signal) {
    return (
      (await requisitarApi(API_ENDPOINTS.CONSULTAS_HORARIOS_DISPONIVEIS, {
        parametros: { idUsuario, data, duracaoMinutos, idConsulta },
        signal,
      })) ?? []
    );
  },

  /** Retorna [{ idEspecialidade, nome }] cadastradas no banco. */
  async listarEspecialidades() {
    return (await requisitarApi(API_ENDPOINTS.ESPECIALIDADES)) ?? [];
  },
};
