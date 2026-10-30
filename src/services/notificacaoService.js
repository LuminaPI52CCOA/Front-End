import { API_ENDPOINTS } from '../api/config';
import { apiGet, apiPatch, apiPost } from './apiClient';

/**
 * Lista as notificações de lembrete WhatsApp preparadas para uma data e/ou status específico.
 * @param {string} [data] - Data no formato YYYY-MM-DD (padrão: D-1 / amanhã)
 * @param {string} [status] - Filtro opcional: PENDENTE, DISPARADO, FALHA_CONTATO_INVALIDO
 * @returns {Promise<Array>} Lista de notificações DTO
 */
export async function listarNotificacoes(data, status) {
  const params = new URLSearchParams();
  if (data) params.append('data', data);
  if (status) params.append('status', status);

  const query = params.toString();
  const endpoint = query
    ? `${API_ENDPOINTS.NOTIFICACOES_WHATSAPP}?${query}`
    : API_ENDPOINTS.NOTIFICACOES_WHATSAPP;

  return apiGet(endpoint);
}

/**
 * Registra a auditoria de disparo do lembrete WhatsApp pela recepção.
 * @param {number|string} idNotificacao
 * @returns {Promise<Object>} Notificação atualizada com status DISPARADO
 */
export async function marcarComoDisparado(idNotificacao) {
  return apiPatch(API_ENDPOINTS.NOTIFICACAO_DISPARAR(idNotificacao));
}

/**
 * Aciona manualmente a rotina de varredura e publicação no RabbitMQ de consultas D-1.
 * @returns {Promise<Object>} Resumo com total enfileiradas e status
 */
export async function processarNotificacoesD1() {
  return apiPost(API_ENDPOINTS.PROCESSAR_NOTIFICACOES_D1);
}

/**
 * Endpoint público de confirmação 1-clique pelo paciente via token seguro UUID.
 * @param {string} token - Token UUID v4
 * @returns {Promise<Object>} Dados da consulta confirmada
 */
export async function confirmarConsultaPublica(token) {
  return apiPost(API_ENDPOINTS.CONFIRMAR_CONSULTA(token));
}
