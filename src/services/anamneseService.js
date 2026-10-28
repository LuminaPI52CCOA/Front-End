import { API_ENDPOINTS } from '../api/config';
import { ApiError, apiGet, apiPost, apiUpload } from './apiClient';

export const LIMITE_ARQUIVO_ANAMNESE_BYTES = 10 * 1024 * 1024;
export const TIPOS_ARQUIVO_ANAMNESE = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
];
export const EXTENSOES_ARQUIVO_ANAMNESE = ['jpg', 'jpeg', 'png', 'pdf'];

export const PERGUNTAS_ANAMNESE = [
  {
    numero: 1,
    campo: 'tratamentoMedico',
    texto: 'Está fazendo algum tratamento médico?',
    larguraTotal: true,
    pagina: 1,
    detalhe: {
      campo: 'tratamentoMedicoDetalhes',
      quandoValor: true,
      obrigatorio: true,
      rotulo: 'Qual tratamento?',
      placeholder: 'Descreva o tratamento em andamento…',
      mensagemErro: 'Especifique o tratamento em andamento',
    },
  },
  {
    numero: 2,
    campo: 'doresCabecaFace',
    texto: 'Sente dores de cabeça, dores na face, ouvido ou articulação?',
    larguraTotal: true,
    pagina: 1,
  },
  {
    numero: 3,
    campo: 'alergiaMedicamento',
    texto: 'Tem alergia a algum medicamento?',
    pagina: 1,
    criticoQuando: true,
    detalhe: {
      campo: 'alergiaMedicamentoDetalhes',
      quandoValor: true,
      obrigatorio: true,
      rotulo: 'Qual medicamento?',
      placeholder: 'Informe o medicamento…',
      mensagemErro: 'Especifique a alergia a medicamento',
    },
  },
  {
    numero: 4,
    campo: 'reacaoAnestesia',
    texto: 'Teve alguma reação a anestesia local?',
    pagina: 1,
    criticoQuando: true,
  },
  {
    numero: 5,
    campo: 'sensibilidadeDentes',
    texto: 'Sente sensibilidade nos dentes?',
    pagina: 1,
  },
  {
    numero: 6,
    campo: 'rangeDentes',
    texto: 'Range os dentes ou tem apertamento?',
    pagina: 1,
  },
  {
    numero: 7,
    campo: 'gengivaSangra',
    texto: 'Sua gengiva sangra com frequência?',
    pagina: 1,
  },
  {
    numero: 8,
    campo: 'habito',
    texto: 'Tem algum hábito?',
    larguraTotal: true,
    pagina: 2,
    detalhe: {
      campo: 'habitoDetalhes',
      quandoValor: true,
      obrigatorio: true,
      rotulo: 'Qual hábito?',
      placeholder: 'Ex.: fumar, roer unhas…',
      mensagemErro: 'Especifique o hábito',
    },
  },
  {
    numero: 9,
    campo: 'diabeticoFamilia',
    texto: 'É diabético? Tem alguém da família que é diabético?',
    larguraTotal: true,
    pagina: 2,
    criticoQuando: true,
  },
  {
    numero: 10,
    campo: 'sangramentoCortes',
    texto: 'Quando você se corta, sangra muito?',
    pagina: 2,
    criticoQuando: true,
  },
  {
    numero: 11,
    campo: 'problemaCardiaco',
    texto: 'Tem algum problema cardíaco?',
    pagina: 2,
    criticoQuando: true,
    detalhe: {
      campo: 'problemaCardiacoDetalhes',
      quandoValor: true,
      obrigatorio: true,
      rotulo: 'Qual problema?',
      placeholder: 'Descreva o problema cardíaco…',
      mensagemErro: 'Especifique o problema cardíaco',
    },
  },
  {
    numero: 12,
    campo: 'pressaoArterialNormal',
    texto: 'Sua pressão arterial é normal?',
    pagina: 2,
    criticoQuando: false,
    detalhe: {
      campo: 'pressaoArterialDetalhes',
      quandoValor: false,
      obrigatorio: false,
      rotulo: 'Observação sobre a pressão (opcional):',
      placeholder: 'Ex.: hipertensão controlada, hipotensão…',
      mensagemErro: 'Informe em até 100 caracteres',
    },
  },
  {
    numero: 13,
    campo: 'desmaioConvulsao',
    texto: 'Teve algum desmaio, tem ataques nervosos, epilepsia ou convulsão?',
    pagina: 2,
    criticoQuando: true,
  },
  {
    numero: 14,
    campo: 'gravidez',
    texto: 'Está grávida?',
    pagina: 2,
    criticoQuando: true,
  },
];

function textoOuNull(valor) {
  const limpo = valor?.trim();
  return limpo ? limpo.slice(0, 100) : null;
}

export function mapFrontToAnamneseRequest(frontData, clienteId) {
  return {
    fkCliente: Number(clienteId),
    dataAnamnese: new Date().toISOString().split('T')[0],
    fazendoTratamento: frontData.tratamentoMedico ?? null,
    descricaoTratamento: frontData.tratamentoMedico
      ? textoOuNull(frontData.tratamentoMedicoDetalhes)
      : null,
    doresCabecaFaceAtm: frontData.doresCabecaFace ?? null,
    alergiaMedicamentos: frontData.alergiaMedicamento ?? null,
    descricaoAlergiaMedicamentos: frontData.alergiaMedicamento
      ? textoOuNull(frontData.alergiaMedicamentoDetalhes)
      : null,
    reacaoAnestesiaLocal: frontData.reacaoAnestesia ?? null,
    sensibilidadeDentaria: frontData.sensibilidadeDentes ?? null,
    bruxismoApertamento: frontData.rangeDentes ?? null,
    sangramentoGengival: frontData.gengivaSangra ?? null,
    possuiHabito: frontData.habito ?? null,
    descricaoHabito: frontData.habito ? textoOuNull(frontData.habitoDetalhes) : null,
    historicoDiabetes: frontData.diabeticoFamilia ?? null,
    sangramentoExcessivo: frontData.sangramentoCortes ?? null,
    problemaCardiaco: frontData.problemaCardiaco ?? null,
    descricaoProblemaCardiaco: frontData.problemaCardiaco
      ? textoOuNull(frontData.problemaCardiacoDetalhes)
      : null,
    pressaoArterialNormal: frontData.pressaoArterialNormal ?? null,
    descricaoPressaoArterial:
      frontData.pressaoArterialNormal === false
        ? textoOuNull(frontData.pressaoArterialDetalhes)
        : null,
    historicoDesmaioConvulsao: frontData.desmaioConvulsao ?? null,
    gestante: frontData.gravidez ?? null,
  };
}

export function mapAnamneseResponseToFront(response) {
  if (!response) return null;
  return {
    idAnamnese: response.idAnamnese,
    dataAnamnese: response.dataAnamnese,
    tratamentoMedico: response.fazendoTratamento ?? null,
    tratamentoMedicoDetalhes: response.descricaoTratamento ?? '',
    doresCabecaFace: response.doresCabecaFaceAtm ?? null,
    alergiaMedicamento: response.alergiaMedicamentos ?? null,
    alergiaMedicamentoDetalhes: response.descricaoAlergiaMedicamentos ?? '',
    reacaoAnestesia: response.reacaoAnestesiaLocal ?? null,
    sensibilidadeDentes: response.sensibilidadeDentaria ?? null,
    rangeDentes: response.bruxismoApertamento ?? null,
    gengivaSangra: response.sangramentoGengival ?? null,
    habito: response.possuiHabito ?? null,
    habitoDetalhes: response.descricaoHabito ?? '',
    diabeticoFamilia: response.historicoDiabetes ?? null,
    sangramentoCortes: response.sangramentoExcessivo ?? null,
    problemaCardiaco: response.problemaCardiaco ?? null,
    problemaCardiacoDetalhes: response.descricaoProblemaCardiaco ?? '',
    pressaoArterialNormal: response.pressaoArterialNormal ?? null,
    pressaoArterialDetalhes: response.descricaoPressaoArterial ?? '',
    desmaioConvulsao: response.historicoDesmaioConvulsao ?? null,
    gravidez: response.gestante ?? null,
  };
}

export function validarArquivoAnamnese(file) {
  if (!file) return 'Selecione um arquivo para envio.';
  const ext = file.name?.split('.').pop()?.toLowerCase() ?? '';
  const tipoValido =
    (file.type && TIPOS_ARQUIVO_ANAMNESE.includes(file.type.toLowerCase())) ||
    EXTENSOES_ARQUIVO_ANAMNESE.includes(ext);

  if (!tipoValido) {
    return 'Tipo de arquivo inválido. Apenas PNG, JPEG ou PDF são aceitos.';
  }
  if (file.size > LIMITE_ARQUIVO_ANAMNESE_BYTES) {
    return 'Tamanho do arquivo excede o limite máximo permitido de 10 MB.';
  }
  return null;
}

export function extrairAlertasClinicos(ficha) {
  if (!ficha) return [];
  const alertas = [];

  if (ficha.alergiaMedicamento === true) {
    const det = ficha.alergiaMedicamentoDetalhes?.trim();
    alertas.push(det ? `Alergia medicamentosa: ${det}` : 'Alergia medicamentosa');
  }
  if (ficha.problemaCardiaco === true) {
    const det = ficha.problemaCardiacoDetalhes?.trim();
    alertas.push(det ? `Problema cardíaco: ${det}` : 'Problema cardíaco');
  }
  if (ficha.pressaoArterialNormal === false) {
    const det = ficha.pressaoArterialDetalhes?.trim();
    alertas.push(det ? `Pressão arterial: ${det}` : 'Pressão arterial alterada');
  }
  if (ficha.reacaoAnestesia === true) {
    alertas.push('Reação prévia à anestesia local');
  }
  if (ficha.sangramentoCortes === true) {
    alertas.push('Histórico de sangramento excessivo');
  }
  if (ficha.diabeticoFamilia === true) {
    alertas.push('Histórico de diabetes');
  }
  if (ficha.desmaioConvulsao === true) {
    alertas.push('Histórico de desmaio / convulsão');
  }
  if (ficha.gravidez === true) {
    alertas.push('Paciente gestante');
  }

  return alertas;
}

function ordenarMaisRecentes(lista) {
  return [...lista].sort((a, b) => {
    const cmpData = String(b.dataAnamnese || '').localeCompare(String(a.dataAnamnese || ''));
    if (cmpData !== 0) return cmpData;
    return Number(b.idAnamnese || 0) - Number(a.idAnamnese || 0);
  });
}

export async function listAnamneses(clienteId) {
  try {
    const responses = await apiGet(API_ENDPOINTS.CLIENTE_ANAMNESES(clienteId));
    const lista = Array.isArray(responses) ? responses.map(mapAnamneseResponseToFront) : [];
    return ordenarMaisRecentes(lista.filter(Boolean));
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return [];
    }
    throw err;
  }
}

export async function criarAnamnese(clienteId, frontData) {
  const request = mapFrontToAnamneseRequest(frontData, clienteId);
  const response = await apiPost(API_ENDPOINTS.CLIENTE_ANAMNESES(clienteId), request);
  return mapAnamneseResponseToFront(response);
}

export async function getAnamneseById(id) {
  const response = await apiGet(API_ENDPOINTS.ANAMNESE_POR_ID(id));
  return mapAnamneseResponseToFront(response);
}

export async function uploadAnamneseOcr(clienteId, file) {
  const erroValidacao = validarArquivoAnamnese(file);
  if (erroValidacao) {
    throw new ApiError(400, erroValidacao);
  }

  const formData = new FormData();
  formData.append('file', file);
  if (clienteId != null) {
    formData.append('clienteId', String(clienteId));
  }

  const response = await apiUpload(API_ENDPOINTS.ANAMNESES, formData);
  return mapAnamneseResponseToFront(response);
}
