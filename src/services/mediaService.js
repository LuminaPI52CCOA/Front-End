import { apiGet, apiPost, apiPatch, apiDelete } from './apiClient';

/**
 * Busca todos os tipos de mídia disponíveis (padrões globais + criados pelo dentista).
 */
export async function getTiposMidia() {
  return apiGet('/tipos-midia');
}

/**
 * Cadastra um novo tipo de mídia personalizado vinculado ao dentista autenticado.
 */
export async function criarTipoMidia(nome, descricao = '') {
  return apiPost('/tipos-midia', { nome, descricao });
}

/**
 * Inicia o upload em lote solicitando Pre-signed PUT URLs ao backend.
 */
export async function iniciarUpload(clienteId, payload) {
  return apiPost(`/clientes/${clienteId}/midias/iniciar-upload`, payload);
}

/**
 * Envia o binário do arquivo diretamente para o Amazon S3 via PUT com monitoramento de progresso.
 */
export function fazerUploadS3(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentual = Math.round((event.loaded / event.total) * 100);
          onProgress(percentual);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(true);
      } else {
        reject(new Error(`Falha no upload para o S3: status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Erro de conexão ao enviar arquivo para o S3.'));
    };

    xhr.send(file);
  });
}

/**
 * Notifica o backend da conclusão do upload no S3 para validação e ativação da mídia.
 */
export async function confirmarUpload(clienteId, midiaId) {
  return apiPatch(`/clientes/${clienteId}/midias/${midiaId}/confirmar`);
}

/**
 * Lista as mídias clínicas ativas do paciente com filtros opcionais.
 */
export async function getMidias(clienteId, filtros = {}) {
  const query = new URLSearchParams();
  if (filtros.tipoId) query.append('tipoId', filtros.tipoId);
  if (filtros.consultaId) query.append('consultaId', filtros.consultaId);
  if (filtros.dentistaId) query.append('dentistaId', filtros.dentistaId);
  if (filtros.data) query.append('data', filtros.data);

  const queryString = query.toString();
  const endpoint = queryString
    ? `/clientes/${clienteId}/midias?${queryString}`
    : `/clientes/${clienteId}/midias`;

  return apiGet(endpoint);
}

/**
 * Executa soft delete em uma mídia clínica.
 */
export async function excluirMidia(clienteId, midiaId) {
  return apiDelete(`/clientes/${clienteId}/midias/${midiaId}`);
}
