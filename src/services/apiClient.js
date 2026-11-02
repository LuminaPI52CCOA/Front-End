import { API_BASE_URL } from '../api/config';
import { authService } from './authService';

export class ApiError extends Error {
  constructor(status, message, campos = null) {
    super(message);
    this.status = status;
    this.campos = campos;
  }
}

let redirecionando = false;

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
    // Apenas registra o aviso sem expulsar para a tela de login
    console.warn('Requisição retornou 401 Unauthorized.');
  }

  return response;
}

async function extrairErro(response, padrao) {
  const errorBody = await response.json().catch(() => null);
  const campos = errorBody?.campos ?? null;
  let message =
    errorBody?.mensagem ||
    errorBody?.message ||
    errorBody?.erro ||
    (response.status === 401 ? 'Sessão expirada. Faça login novamente.' : padrao);
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
  const response = await requisitar(path, { method: 'GET' });

  if (response.status === 204) return [];

  if (!response.ok) {
    throw await extrairErro(response, `Erro ${response.status} ao buscar os dados.`);
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
    const fallback = response.status === 413
      ? 'Tamanho do arquivo excede o limite máximo permitido de 10MB.'
      : `Erro ${response.status} ao enviar o arquivo.`;
    throw await extrairErro(response, fallback);
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
    throw await extrairErro(response, `Erro ${response.status} ao enviar os dados.`);
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
    throw await extrairErro(response, `Erro ${response.status} ao atualizar os dados.`);
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
    throw await extrairErro(response, `Erro ${response.status} ao atualizar os dados.`);
  }

  return response.json().catch(() => true);
}

export async function apiDelete(path) {
  const response = await requisitar(path, { method: 'DELETE' });

  if (response.status === 204 || response.ok) return true;

  throw await extrairErro(response, `Erro ${response.status} ao excluir os dados.`);
}
