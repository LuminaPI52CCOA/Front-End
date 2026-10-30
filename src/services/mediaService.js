import { apiGet, apiPost, apiPatch, apiDelete } from './apiClient';
import { API_BASE_URL } from '../api/config';

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
 * Inicia o upload em lote solicitando Pre-signed PUT URLs ao backend
 * apontando para s3://lumina-bronze/exames/cliente-{clienteId}/.
 */
export async function iniciarUpload(clienteId, payload) {
  return apiPost(`/clientes/${clienteId}/midias/iniciar-upload`, payload);
}

/**
 * Fallback de upload via backend caso o envio direto via browser ao S3 seja bloqueado.
 */
export function enviarArquivoViaBackend(clienteId, midiaId, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.open('PUT', `${API_BASE_URL}/clientes/${clienteId}/midias/${midiaId}/upload`, true);
    xhr.withCredentials = true;

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
        reject(new Error(`Falha no upload do exame para o bucket bronze: status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Erro de conexão ao enviar exame para o servidor.'));
    };

    xhr.send(formData);
  });
}

/**
 * Envia o binário do arquivo diretamente para o bucket bronze no Amazon S3 via PUT
 * com monitoramento de progresso e fallback automático via backend.
 */
export function fazerUploadS3(uploadUrl, file, onProgress, clienteId = null, midiaId = null) {
  // Fallback para desenvolvimento local sem credenciais AWS ativas
  if (uploadUrl && uploadUrl.includes('mock-presigned-put=true')) {
    if (clienteId && midiaId) {
      return enviarArquivoViaBackend(clienteId, midiaId, file, onProgress);
    }
    return new Promise((resolve) => {
      let progresso = 0;
      const interval = setInterval(() => {
        progresso += 25;
        if (onProgress) onProgress(Math.min(progresso, 100));
        if (progresso >= 100) {
          clearInterval(interval);
          resolve(true);
        }
      }, 80);
    });
  }

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
      } else if (clienteId && midiaId) {
        enviarArquivoViaBackend(clienteId, midiaId, file, onProgress)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Falha no upload para o S3: status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      if (clienteId && midiaId) {
        enviarArquivoViaBackend(clienteId, midiaId, file, onProgress)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('Erro de conexão ao enviar arquivo para o S3.'));
      }
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
 * Lista os exames e mídias clínicas ativas do paciente com filtros opcionais.
 */
export async function getMidias(clienteId, filtros = {}) {
  const query = new URLSearchParams();
  if (filtros.tipoId) query.append('tipoId', filtros.tipoId);
  if (filtros.consultaId) query.append('consultaId', filtros.consultaId);
  if (filtros.dentistaId) query.append('dentistaId', filtros.dentistaId);
  if (filtros.data) query.append('data', filtros.data);
  if (filtros.busca) query.append('busca', filtros.busca);

  const queryString = query.toString();
  const endpoint = queryString
    ? `/clientes/${clienteId}/midias?${queryString}`
    : `/clientes/${clienteId}/midias`;

  return apiGet(endpoint);
}

/**
 * Busca e sincroniza os exames do cliente diretamente da pasta pseudonimizada no bucket bronze.
 */
export async function buscarExamesNoBucket(clienteId) {
  return apiGet(`/clientes/${clienteId}/midias/bucket`);
}

/**
 * Obtém o caminho pseudonimizado (HMAC-SHA256 LGPD) da pasta do cliente no bucket bronze.
 */
export async function getDestinoBucketCliente(clienteId) {
  return apiGet(`/clientes/${clienteId}/midias/destino-bucket`);
}

/**
 * Executa soft delete em uma mídia clínica.
 */
export async function excluirMidia(clienteId, midiaId) {
  return apiDelete(`/clientes/${clienteId}/midias/${midiaId}`);
}
