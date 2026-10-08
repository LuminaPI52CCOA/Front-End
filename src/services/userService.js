import { API_BASE_URL, API_ENDPOINTS } from '../api/config';
import { authService } from './authService';

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
        if (response.status === 401 || response.status === 403) {
          throw new Error('Apenas um administrador logado pode cadastrar novos usuários. Faça login como administrador.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensagem || errorData.message || errorData.erro || `Erro ao fazer cadastro (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  },
};
