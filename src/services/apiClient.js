import { API_BASE_URL } from '../api/config';
import { authService } from './authService';

export class ApiError extends Error {
  constructor(status, message, campos = null) {
    super(message);
    this.status = status;
    this.campos = campos;
  }
}

async function extrairErro(response, padrao) {
  const errorBody = await response.json().catch(() => null);
  const campos = errorBody?.campos ?? null;
  let message = errorBody?.mensagem || errorBody?.message || errorBody?.erro || padrao;
  if (campos && typeof campos === 'object') {
    const detalhes = Object.entries(campos)
      .map(([campo, msg]) => `${campo}: ${msg}`)
      .join('; ');
    if (detalhes && (!errorBody?.mensagem || errorBody.mensagem.includes('inválidos'))) {
      message = `${message} (${detalhes})`;
    }
  }
  return new ApiError(response.status, message, campos);
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
    throw await extrairErro(response, `Erro ${response.status} ao buscar os dados.`);
  }

  return response.json();
}

export async function apiPost(path, body) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  if (response.status === 204) return [];

  if (!response.ok) {
    throw await extrairErro(response, `Erro ${response.status} ao enviar os dados.`);
  }

  return response.json();
}

export async function apiPut(path, body) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  if (response.status === 204) return [];

  if (!response.ok) {
    throw await extrairErro(response, `Erro ${response.status} ao atualizar os dados.`);
  }

  return response.json();
}

export async function apiPatch(path, body) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: authService.getAuthHeaders(),
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  if (response.status === 204) return true;

  if (!response.ok) {
    throw await extrairErro(response, `Erro ${response.status} ao atualizar os dados.`);
  }

  return response.json().catch(() => true);
}

export async function apiDelete(path) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
      credentials: 'include',
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  if (response.status === 204 || response.ok) return true;

  throw await extrairErro(response, `Erro ${response.status} ao excluir os dados.`);
}
