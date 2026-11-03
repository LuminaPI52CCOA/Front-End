import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

const TOKEN_KEYS = ['token', 'jwt', 'accessToken'];
const TOKEN_FIELDS = ['token', 'accessToken', 'access_token', 'jwt', 'jwtToken', 'tokenDeAcesso', 'idToken'];

function buscarTokenNoObjeto(valor, profundidade = 0) {
  if (!valor || typeof valor !== 'object' || profundidade > 3) return null;

  if (Array.isArray(valor)) {
    for (const item of valor) {
      const token = buscarTokenNoObjeto(item, profundidade + 1);
      if (token) return token;
    }
    return null;
  }

  for (const campo of TOKEN_FIELDS) {
    const candidato = valor[campo];
    if (typeof candidato === 'string' && candidato.trim()) return candidato.trim();
  }

  for (const [chave, candidato] of Object.entries(valor)) {
    if (
      /token|jwt/i.test(chave) &&
      !/expir|tipo|type|prefix|created|criado|csrf|xsrf|refresh/i.test(chave)
    ) {
      if (typeof candidato === 'string' && candidato.trim()) return candidato.trim();
    }
  }

  for (const candidato of Object.values(valor)) {
    if (candidato && typeof candidato === 'object') {
      const token = buscarTokenNoObjeto(candidato, profundidade + 1);
      if (token) return token;
    }
  }

  return null;
}

function extrairToken(data, response) {
  const cabecalho = ['authorization', 'x-access-token', 'x-auth-token', 'token']
    .map((nome) => response.headers.get(nome))
    .find(Boolean);
  if (cabecalho) return cabecalho.trim();

  if (typeof data === 'string' && data.trim()) return data.trim();

  return buscarTokenNoObjeto(data);
}

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
        throw new Error(errorData.mensagem || errorData.message || errorData.erro || 'Erro ao fazer login');
      }

      const data = await response.json();
      const token = extrairToken(data, response);

      TOKEN_KEYS.forEach((chave) => localStorage.removeItem(chave));
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
      this.clearSession();
    }
  },

  clearToken() {
    TOKEN_KEYS.forEach((chave) => localStorage.removeItem(chave));
  },

  clearSession() {
    this.clearToken();
    localStorage.removeItem('user');
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
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'));
      if (match && match[2]) {
        headers['X-XSRF-TOKEN'] = decodeURIComponent(match[2]);
      }
    }
    return headers;
  },

  isAuthenticated() {
    return !!this.getToken() || !!localStorage.getItem('user');
  },
};
