import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

export const authService = {
  async login(email, senha) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      
      // Armazenar token JWT caso venha no corpo
      const token = data?.token || data?.accessToken || data?.jwt || data?.jwtToken || data?.tokenDeAcesso || (typeof data === 'string' ? data : null);
      if (token) {
        localStorage.setItem('token', token);
      }
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
      }

      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/usuarios/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {});
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('jwt');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  getToken() {
    return localStorage.getItem('token') || localStorage.getItem('jwt') || localStorage.getItem('accessToken');
  },

  getAuthHeaders() {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
    }
    return headers;
  },

  isAuthenticated() {
    return !!this.getToken() || !!localStorage.getItem('user');
  },
};
