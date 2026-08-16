import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

export const userService = {
  async cadastrar(nome, cpf, email, senha, cro, cargo, ativo = true) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CADASTRO}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, cpf, email, senha, cro, cargo, ativo }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao fazer cadastro');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  },
};
