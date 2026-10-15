import { API_ENDPOINTS } from '../api/config';
import { apiGet } from './apiClient';

const PERFIL_DENTISTA = 2;

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

  return usuarios
    .filter((usuario) => usuario.fkPerfil === PERFIL_DENTISTA)
    .map((usuario) => ({
      id: usuario.idUsuario,
      nome: usuario.nome,
      cro: usuario.cro ?? '',
      especialidade: 'Não informada',
      status: usuario.ativo ? 'Ativo' : 'Inativo',
    }));
}
