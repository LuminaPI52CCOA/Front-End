import { API_ENDPOINTS } from '../api/config';
import { apiGet } from './apiClient';

export async function listEspecialidades() {
  const resposta = await apiGet(API_ENDPOINTS.ESPECIALIDADES);
  if (!Array.isArray(resposta)) return [];

  return resposta.map((item) => ({
    id: item.idEspecialidade,
    nome: item.nome,
    value: String(item.idEspecialidade),
    label: item.nome,
  }));
}
