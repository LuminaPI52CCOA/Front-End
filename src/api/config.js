export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? '/api' : 'http://localhost:8080');

export const API_ENDPOINTS = {
  LOGIN: '/usuarios/login',
  CADASTRO: '/usuarios',
  CLIENTES: '/clientes',
  ESTADO_CIVIL: '/clientes/estado-civil',
  ALEXA_STATUS: '/alexa/status',
  ALEXA_GERAR_PIN: '/alexa/gerar-pin',
  ALEXA_DESCONECTAR: '/alexa/desconectar',
  USUARIOS: '/usuarios',
  CONSULTAS: '/consultas',
  CLIENTE_CONVENIOS: (id) => `/clientes/${id}/convenios`,
  TIPOS_MIDIA: '/tipos-midia',
  CLIENTE_MIDIAS: (id) => `/clientes/${id}/midias`,
};

