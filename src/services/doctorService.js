import { API_ENDPOINTS } from '../api/config';
import { apiGet, apiPut, apiDelete } from './apiClient';

const PERFIL_DENTISTA = 2;

const normalizarDentista = (usuario) => ({
  id: usuario.idUsuario,
  nome: usuario.nome,
  cro: usuario.cro ?? '',
  cpf: usuario.cpf ?? '',
  email: usuario.email ?? '',
  especialidade: 'Clínica Geral',
  status: usuario.ativo ? 'Ativo' : 'Inativo',
  telefone: '',
  endereco: {
    cep: '',
    rua: '',
    bairro: '',
    numero: '',
    complemento: '',
  },
  autorizacoes: ['Atendimento Clínico', 'Avaliação e Diagnóstico'],
});

export async function listDoctorsPaginated({
  page = 0,
  size = 6,
  sort = 'nome,asc',
  nome = '',
} = {}) {
  let resposta;

  try {
    const params = new URLSearchParams();
    params.set('fkPerfil', String(PERFIL_DENTISTA));
    params.set('page', String(page));
    params.set('size', String(size));
    if (sort) params.set('sort', sort);
    if (nome && nome.trim()) params.set('nome', nome.trim());

    resposta = await apiGet(`${API_ENDPOINTS.USUARIOS}?${params.toString()}`);
  } catch (error) {
    if (error?.status !== 403) {
      throw error;
    }
    // Fallback: se 403 (perfil sem permissao ADMIN no back-end),
    // obtem dentistas das consultas existentes (permitido para DENTISTA e RECEPCIONISTA)
    const consultas = await apiGet(API_ENDPOINTS.CONSULTAS);
    const dentistasMap = new Map();
    consultas.forEach(({ usuario }) => {
      if (usuario && usuario.idUsuario) {
        dentistasMap.set(usuario.idUsuario, usuario);
      }
    });
    resposta = Array.from(dentistasMap.values());
  }

  const isPageObject = resposta && !Array.isArray(resposta) && Array.isArray(resposta.content);
  const usuariosBrutos = Array.isArray(resposta)
    ? resposta
    : isPageObject
      ? resposta.content
      : [];

  const dentistas = usuariosBrutos
    .filter((usuario) => usuario.fkPerfil === PERFIL_DENTISTA)
    .map(normalizarDentista);

  if (isPageObject) {
    const pageNumber = resposta.number ?? page;
    const pageSize = resposta.size ?? size;
    const totalElements = resposta.totalElements ?? dentistas.length;
    const totalPages = resposta.totalPages ?? (totalElements > 0 ? Math.ceil(totalElements / pageSize) : 0);
    const offset = resposta.pageable?.offset ?? pageNumber * pageSize;

    return {
      content: dentistas,
      pageInfo: {
        page: pageNumber,
        size: pageSize,
        offset,
        totalElements,
        totalPages,
        first: Boolean(resposta.first),
        last: Boolean(resposta.last),
      },
    };
  }

  const totalElements = dentistas.length;
  const totalPages = totalElements > 0 ? Math.ceil(totalElements / size) : 0;
  const offset = page * size;
  const fatia = dentistas.slice(offset, offset + size);

  return {
    content: fatia,
    pageInfo: {
      page,
      size,
      offset,
      totalElements,
      totalPages,
      first: page === 0,
      last: page >= Math.max(0, totalPages - 1),
    },
  };
}

export async function listDoctors() {
  const { content } = await listDoctorsPaginated({ page: 0, size: 100, sort: 'nome,asc' });
  return content;
}

export async function getDoctorById(id) {
  try {
    const usuario = await apiGet(`${API_ENDPOINTS.USUARIOS}/${id}`);
    if (!usuario) return null;
    return normalizarDentista(usuario);
  } catch (error) {
    if (error?.status === 403) {
      const lista = await listDoctors();
      const dentista = lista.find((d) => String(d.id) === String(id));
      if (dentista) return dentista;
    }
    throw error;
  }
}

export async function updateDoctor(id, dados) {
  const usuarioAtual = await apiGet(`${API_ENDPOINTS.USUARIOS}/${id}`).catch(() => null);

  const payload = {
    idUsuario: Number(id),
    nome: dados.nome ?? usuarioAtual?.nome,
    cpf: dados.cpf ?? usuarioAtual?.cpf ?? '00000000000',
    email: dados.email ?? usuarioAtual?.email,
    senha: dados.senha ?? usuarioAtual?.senha ?? '123456',
    fkPerfil: usuarioAtual?.fkPerfil ?? PERFIL_DENTISTA,
    cro: dados.cro ?? usuarioAtual?.cro ?? '',
    ativo: dados.status !== undefined ? (dados.status === 'Ativo' || dados.status === true) : (usuarioAtual?.ativo ?? true),
  };

  const response = await apiPut(`${API_ENDPOINTS.USUARIOS}/${id}`, payload);
  return normalizarDentista(response);
}

export async function deactivateDoctor(id) {
  return apiDelete(`${API_ENDPOINTS.USUARIOS}/${id}`);
}
