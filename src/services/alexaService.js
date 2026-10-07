import { API_BASE_URL, API_ENDPOINTS } from '../api/config';
import { authService } from './authService';

const buildUrl = (endpoint, params = {}) => {
  const base = `${API_BASE_URL || ''}${endpoint}`;
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return query ? `${base}?${query}` : base;
};

export const alexaService = {
  /**
   * Consulta o status de integração da Alexa para o dentista.
   * @param {number|string} [usuarioId] - ID do dentista (opcional para o próprio dentista autenticado).
   * @returns {Promise<{conectado: boolean, alexaUserId: string|null, apiEndpoint: string|null, vinculadoEm: string|null, dentistaNome: string}>}
   */
  async obterStatus(usuarioId) {
    try {
      const url = buildUrl(API_ENDPOINTS.ALEXA_STATUS, { usuarioId });

      const response = await fetch(url, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensagem || errorData.message || `Erro ao obter status da Alexa (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('alexaService.obterStatus error:', error);
      throw error;
    }
  },

  /**
   * Gera um novo PIN de 6 dígitos temporário (10 minutos) para pareamento.
   * @param {number|string} [usuarioId] - ID do dentista.
   * @returns {Promise<{codigo: string, expiraEmMinutos: number, mensagem: string}>}
   */
  async gerarPin(usuarioId) {
    try {
      const url = buildUrl(API_ENDPOINTS.ALEXA_GERAR_PIN, { usuarioId });

      const response = await fetch(url, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensagem || errorData.message || `Erro ao gerar PIN (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('alexaService.gerarPin error:', error);
      throw error;
    }
  },

  /**
   * Desconecta o dispositivo Alexa associado ao dentista.
   * @param {number|string} [usuarioId] - ID do dentista.
   * @returns {Promise<boolean>}
   */
  async desconectar(usuarioId) {
    try {
      const url = buildUrl(API_ENDPOINTS.ALEXA_DESCONECTAR, { usuarioId });

      const response = await fetch(url, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensagem || errorData.message || `Erro ao desconectar Alexa (${response.status})`);
      }

      return true;
    } catch (error) {
      console.error('alexaService.desconectar error:', error);
      throw error;
    }
  },
};
