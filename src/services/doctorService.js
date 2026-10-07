import { API_ENDPOINTS } from '../api/config';
import { apiGet } from './apiClient';

const PERFIL_DENTISTA = 2;

export async function listDoctors() {
  const usuarios = await apiGet(API_ENDPOINTS.USUARIOS);

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
