import { API_ENDPOINTS } from '../api/config';
import { apiGet } from './apiClient';

export async function listConsultas() {
  const consultas = await apiGet(API_ENDPOINTS.CONSULTAS);

  return consultas.map((consulta) => ({
    id: consulta.id,
    data: consulta.data,
    inicio: consulta.horarioInicio,
    pacienteId: consulta.cliente?.idCliente ?? null,
    dentistaId: consulta.usuario?.idUsuario ?? null,
  }));
}
