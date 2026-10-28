import { API_BASE_URL } from '../api/config';
import { authService } from './authService';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

let redirecionando = false;

function mensagemHttp(response, fallback) {
  if (response.status === 401) return 'Sessão expirada. Faça login novamente.';
  return fallback;
}

async function requisitar(path, options = {}) {
  const executar = () =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: authService.getAuthHeaders(),
      credentials: 'include',
    });

  let response;

  try {
    response = await executar();
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  if (response.status === 401 && authService.getToken()) {
    authService.clearToken();

    try {
      response = await executar();
    } catch {
      throw new ApiError(0, 'Não foi possível conectar ao servidor.');
    }
  }

  if (response.status === 401) {
    authService.clearSession();

    if (!redirecionando && typeof window !== 'undefined' && window.location.pathname !== '/login') {
      redirecionando = true;
      window.location.assign('/login');
    }
  }

  return response;
}

export async function apiGet(path) {
  const response = await requisitar(path, { method: 'GET' });

  if (response.status === 204) return [];

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.mensagem ||
      errorBody?.message ||
      mensagemHttp(response, `Erro ${response.status} ao buscar os dados.`);
    throw new ApiError(response.status, message);
  }

  return response.json();
}

export async function apiUpload(path, formData) {
  const headers = { ...authService.getAuthHeaders() };
  delete headers['Content-Type'];

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  if (response.status === 204) return null;

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const fallback =
      response.status === 413
        ? 'Tamanho do arquivo excede o limite máximo permitido de 10MB.'
        : `Erro ${response.status} ao enviar o arquivo.`;
    const message = errorBody?.mensagem || errorBody?.message || fallback;
    throw new ApiError(response.status, message);
  }

  return response.json();
}

export async function apiPost(path, body) {
  const response = await requisitar(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (response.status === 204) return [];

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.mensagem ||
      errorBody?.message ||
      mensagemHttp(response, `Erro ${response.status} ao enviar os dados.`);
    throw new ApiError(response.status, message);
  }

  return response.json();
}

export async function apiPut(path, body) {
  const response = await requisitar(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (response.status === 204) return [];

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.mensagem ||
      errorBody?.message ||
      mensagemHttp(response, `Erro ${response.status} ao atualizar os dados.`);
    throw new ApiError(response.status, message);
  }

  return response.json();
}

export async function apiPatch(path, body) {
  const response = await requisitar(path, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return true;

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.mensagem ||
      errorBody?.message ||
      mensagemHttp(response, `Erro ${response.status} ao atualizar os dados.`);
    throw new ApiError(response.status, message);
  }

  return response.json().catch(() => true);
}

export async function apiDelete(path) {
  const response = await requisitar(path, { method: 'DELETE' });

  if (response.status === 204 || response.ok) return true;

  const errorBody = await response.json().catch(() => null);
  const message =
    errorBody?.mensagem ||
    errorBody?.message ||
    mensagemHttp(response, `Erro ${response.status} ao excluir os dados.`);
  throw new ApiError(response.status, message);
}
