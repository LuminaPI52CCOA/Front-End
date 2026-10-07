import { API_BASE_URL } from '../api/config';
import { authService } from './authService';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function apiGet(path) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
      credentials: 'include',
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  if (response.status === 204) return [];

  if (!response.ok) {
    throw new ApiError(response.status, `Erro ${response.status} ao buscar os dados.`);
  }

  return response.json();
}
