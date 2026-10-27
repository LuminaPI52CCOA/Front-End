import { API_BASE_URL } from './config';
import { authService } from '../services/authService';

const MENSAGENS_PADRAO = {
  400: 'Dados inválidos. Revise as informações e tente novamente.',
  401: 'Sessão expirada ou não autenticada. Faça login novamente.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Registro não encontrado.',
  409: 'Este horário acabou de ser ocupado. Escolha outro horário.',
};

export class ErroApi extends Error {
  constructor(mensagem, status, campos) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.campos = campos ?? null;
  }
}

const montarMensagem = (corpo, status) => {
  const base =
    corpo?.mensagem ||
    corpo?.message ||
    MENSAGENS_PADRAO[status] ||
    `Erro ${status} ao comunicar com o servidor.`;
  const campos = corpo?.campos
    ? Object.entries(corpo.campos)
        .map(([campo, mensagem]) => `${campo}: ${mensagem}`)
        .join('; ')
    : '';
  return campos ? `${base} (${campos})` : base;
};

/**
 * fetch autenticado (cookie HttpOnly + header Bearer/XSRF quando existirem).
 * Retorna o JSON da resposta, null para 204 e lança ErroApi com a mensagem do
 * ErroRespostaDto do back-end em respostas de erro.
 */
export async function requisitarApi(caminho, { method = 'GET', corpo, parametros, signal } = {}) {
  const url = new URL(`${API_BASE_URL}${caminho}`);
  Object.entries(parametros ?? {}).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(chave, valor);
    }
  });

  let resposta;
  try {
    resposta = await fetch(url, {
      method,
      headers: authService.getAuthHeaders(),
      credentials: 'include',
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal,
    });
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro;
    throw new ErroApi('Não foi possível conectar ao servidor.', 0);
  }

  if (resposta.status === 204) return null;

  const corpoResposta = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new ErroApi(
      montarMensagem(corpoResposta, resposta.status),
      resposta.status,
      corpoResposta?.campos,
    );
  }
  return corpoResposta;
}
