import { API_BASE_URL, API_ENDPOINTS } from '../api/config';
import { authService } from './authService';
import { apiGet, apiPut } from './apiClient';
import { calcularIdade } from '../utils/datas';

export const DEFAULT_ESTADO_CIVIL_OPTIONS = [
  { value: 1, label: 'Solteiro(a)' },
  { value: 2, label: 'Casado(a)' },
  { value: 3, label: 'Divorciado(a)' },
  { value: 4, label: 'Viúvo(a)' },
  { value: 5, label: 'União Estável' },
];

const mapEstadoCivil = (estadoCivil) => {
  if (typeof estadoCivil === 'number' && !isNaN(estadoCivil)) return estadoCivil;
  if (typeof estadoCivil === 'string' && !isNaN(Number(estadoCivil)) && estadoCivil.trim() !== '') {
    return Number(estadoCivil);
  }
  const map = {
    'Solteiro(a)': 1,
    'Casado(a)': 2,
    'Divorciado(a)': 3,
    'Viúvo(a)': 4,
    'União Estável': 5,
  };
  return map[estadoCivil] || 1;
};

const mapSexo = (sexo) => {
  if (!sexo) return 'O';
  const first = String(sexo).trim().toUpperCase().charAt(0);
  if (first === 'M') return 'M';
  if (first === 'F') return 'F';
  return 'O';
};

/**
 * Busca a lista de opções de estado civil do backend (/clientes/estado-civil).
 * Retorna array no formato: [{ value: 1, label: 'Solteiro(a)' }, ...]
 */
export async function getEstadosCivis() {
  try {
    const headers = authService.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ESTADO_CIVIL}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => ({
          value: item.idEstadoCivil,
          label: item.descricao,
        }));
      }
    }
    return DEFAULT_ESTADO_CIVIL_OPTIONS;
  } catch (error) {
    console.error('Erro ao buscar estados civis no backend:', error);
    return DEFAULT_ESTADO_CIVIL_OPTIONS;
  }
}

/**
 * Formata os dados do formulário do frontend para a estrutura ClienteRequest esperada pelo backend.
 */
export function formatPatientPayload(patientData) {
  const cleanCpf = (patientData.cpf || '').replace(/\D/g, '');
  const cleanCep = (patientData.cep || '').replace(/\D/g, '');
  const cleanPhone = (patientData.telefone || patientData.numeroCelular || '').replace(/\D/g, '');

  const endereco = [
    patientData.rua,
    patientData.numero ? `nº ${patientData.numero}` : '',
    patientData.bairro,
    patientData.complemento ? `(${patientData.complemento})` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const estadoCivilId = mapEstadoCivil(patientData.estadoCivil || patientData.fkEstadoCivil);

  const payload = {
    nome: patientData.nomeCompleto || patientData.nome || '',
    fkEstadoCivil: estadoCivilId,
    cpf: cleanCpf || patientData.cpf || '',
    rg: patientData.rg || '',
    dataNascimento: patientData.dataNascimento || '',
    naturalidade: patientData.naturalidade || '',
    nacionalidade: patientData.nacionalidade || 'Brasileira',
    numeroCelular: cleanPhone || patientData.telefone || '',
    email: patientData.email || '',
    sexo: mapSexo(patientData.sexo),
    enderecoResidencial: endereco || patientData.enderecoResidencial || '',
    cep: cleanCep || patientData.cep || '',
  };

  if (patientData.nomeResponsavel || patientData.cpfResponsavel) {
    const cleanCpfResp = (patientData.cpfResponsavel || '').replace(/\D/g, '');
    payload.responsavel = {
      nome: patientData.nomeResponsavel || '',
      cpf: cleanCpfResp || patientData.cpfResponsavel || '',
      rg: patientData.rgResponsavel || '',
    };
    payload.grauParentescoResponsavel = patientData.grauParentesco || patientData.grauParentescoResponsavel || 'Pai / Mãe';
  }

  return payload;
}

/**
 * Cadastra um novo paciente/cliente no backend.
 * Endpoint: POST http://localhost:8080/clientes
 * 
 * @param {Object} patientData - Dados validados do paciente
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function createPatient(patientData) {
  try {
    const headers = authService.getAuthHeaders();
    const payload = formatPatientPayload(patientData);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CLIENTES}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      return { success: true, data };
    }

    if (response.status === 401) {
      return { 
        success: false, 
        error: 'Sessão expirada ou não autorizada (401). Faça login novamente para continuar.' 
      };
    }

    const errorBody = await response.json().catch(() => null);
    const errorMessage = errorBody?.message || errorBody?.error || `Erro ${response.status} ao cadastrar paciente`;
    return { success: false, error: errorMessage };
  } catch (error) {
    console.error('Erro de conexão ao cadastrar paciente no backend:', error);
    return { success: false, error: 'Não foi possível conectar ao servidor backend (localhost:8080).' };
  }
}

const mapearClienteParaPaciente = (cliente) => ({
  id: cliente.idCliente,
  nome: cliente.nome,
  idade: calcularIdade(cliente.dataNascimento),
  plano: cliente.plano ?? 'Particular',
  proximaConsulta: cliente.proximaConsulta ?? null,
});

export async function listPatientsPaginated({
  page = 0,
  size = 6,
  sort = 'nome,asc',
  nome = '',
} = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  if (sort) params.set('sort', sort);
  if (nome && nome.trim()) params.set('nome', nome.trim());

  const resposta = await apiGet(`${API_ENDPOINTS.CLIENTES}?${params.toString()}`);

  const listaBruta = Array.isArray(resposta)
    ? resposta
    : Array.isArray(resposta?.content)
      ? resposta.content
      : [];

  const content = listaBruta.map(mapearClienteParaPaciente);
  const isPageObject = resposta && !Array.isArray(resposta) && Array.isArray(resposta.content);

  const pageNumber = isPageObject ? (resposta.number ?? page) : page;
  const pageSize = isPageObject ? (resposta.size ?? size) : size;
  const totalElements = isPageObject ? (resposta.totalElements ?? content.length) : content.length;
  const totalPages = isPageObject
    ? (resposta.totalPages ?? (totalElements > 0 ? Math.ceil(totalElements / pageSize) : 0))
    : (content.length > 0 ? 1 : 0);
  const offset = isPageObject
    ? (resposta.pageable?.offset ?? pageNumber * pageSize)
    : pageNumber * pageSize;

  return {
    content,
    pageInfo: {
      page: pageNumber,
      size: pageSize,
      offset,
      totalElements,
      totalPages,
      first: isPageObject ? Boolean(resposta.first) : pageNumber === 0,
      last: isPageObject ? Boolean(resposta.last) : pageNumber >= Math.max(0, totalPages - 1),
    },
  };
}

export async function listPatients() {
  const { content } = await listPatientsPaginated({ page: 0, size: 100, sort: 'nome,asc' });
  return content;
}

export function formatPatientPayloadForUpdate(patientData) {
  const cleanCpf = (patientData.cpf || '').replace(/\D/g, '');
  const cleanCep = (patientData.cep || '').replace(/\D/g, '');
  const cleanPhone = (patientData.telefone || patientData.numeroCelular || '').replace(/\D/g, '');

  const estadoCivilId = mapEstadoCivil(patientData.estadoCivil || patientData.fkEstadoCivil);

  return {
    nome: patientData.nomeCompleto || patientData.nome || '',
    fkEstadoCivil: estadoCivilId,
    cpf: cleanCpf || patientData.cpf || '',
    rg: patientData.rg || '',
    dataNascimento: patientData.dataNascimento || '',
    naturalidade: patientData.naturalidade || '',
    nacionalidade: patientData.nacionalidade || 'Brasileira',
    numeroCelular: cleanPhone || patientData.telefone || '',
    email: patientData.email || '',
    sexo: mapSexo(patientData.sexo),
    enderecoResidencial: patientData.enderecoTexto || patientData.enderecoResidencial || '',
    cep: cleanCep || patientData.cep || '',
  };
}

export async function getPatient(id) {
  try {
    const cliente = await apiGet(`/clientes/${id}`);

    return {
      id: cliente.idCliente,
      nome: cliente.nome,
      dataNascimento: cliente.dataNascimento,
      idade: calcularIdade(cliente.dataNascimento),
      cpf: cliente.cpf,
      rg: cliente.rg,
      sexo: cliente.sexo,
      plano: cliente.plano ?? 'Particular',
      proximaConsulta: cliente.proximaConsulta ?? null,
      convenios: cliente.convenios ?? [],
      contato: {
        celular: cliente.celular,
        email: cliente.email,
      },
      enderecoResidencial: cliente.enderecoResidencial ?? cliente.endereco ?? '',
      cep: cliente.cep ?? '',
      telefone: cliente.telefone,
      observacoes: cliente.observacoes ?? '',
      historico: cliente.historico ?? [],
    };
  } catch (err) {
    throw err;
  }
}

export async function getConveniosDoPaciente(id) {
  return apiGet(`/clientes/${id}/convenios`).catch(() => []);
}

export async function updatePatient(id, patientData) {
  const payload = formatPatientPayloadForUpdate(patientData);
  return apiPut(`/clientes/${id}`, payload);
}
