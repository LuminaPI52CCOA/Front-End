import { API_BASE_URL, API_ENDPOINTS } from '../api/config';
import { authService } from './authService';
import { requisitarApi } from '../api/requisicao';

export const userService = {
  async cadastrar(nome, cpf, email, senha, cro, fkPerfil, ativo = true) {
    try {
      console.log('Request body:', JSON.stringify({ nome, cpf, email, senha, cro, fkPerfil, ativo }));

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CADASTRO}`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ nome, cpf, email, senha, cro, fkPerfil, ativo }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensagem || errorData.message || errorData.erro || `Erro ao fazer cadastro (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  },

  /**
   * Dentistas ativos para seletores (GET /usuarios/dentistas?nome=), busca no servidor.
   * Retorna [{ idUsuario, nome, cro }].
   */
  async buscarDentistas(nome, signal) {
    const pagina = await requisitarApi(API_ENDPOINTS.DENTISTAS_SELECAO, {
      parametros: { nome: nome?.trim() || undefined, size: 10 },
      signal,
    });
    return pagina?.content ?? [];
  },
};
