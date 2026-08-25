import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

export const userService = {
  async cadastrar(nome, cpf, email, senha, cro, fkPerfil, ativo = true) {
    try {
      console.log('Request body:', JSON.stringify({ nome, cpf, email, senha, cro, fkPerfil, ativo }));

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CADASTRO}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ nome, cpf, email, senha, cro, fkPerfil, ativo }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao fazer cadastro ' + response.status + ' ' + response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  },
};
