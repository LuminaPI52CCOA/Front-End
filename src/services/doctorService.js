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

export async function listDoctors() {
  let usuarios;

  try {
    usuarios = await apiGet(API_ENDPOINTS.USUARIOS);
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
    usuarios = Array.from(dentistasMap.values());
  }

  return (usuarios || [])
    .filter((usuario) => usuario.fkPerfil === PERFIL_DENTISTA)
    .map(normalizarDentista);
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
