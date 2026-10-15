import { apiGet, apiPost } from './apiClient';

function mapFrontToAnamneseRequest(frontData, clienteId) {
  return {
    fkClienteId: clienteId,
    dataAnamnese: new Date().toISOString().split('T')[0],
    fazendoTratamento: frontData.tratamentoMedico ?? null,
    descricaoTratamento: frontData.tratamentoMedicoDetalhes ?? '',
    doresCabecaFaceAtm: frontData.doresCabecaFace ?? null,
    alergiaMedicamentos: frontData.alergiaMedicamento ?? null,
    descricaoAlergiaMedicamentos: frontData.alergiaMedicamentoDetalhes ?? '',
    reacaoAnestesiaLocal: frontData.reacaoAnestesia ?? null,
    sensibilidadeDentaria: frontData.sensibilidadeDentes ?? null,
    bruxismoApertamento: frontData.rangeDentes ?? null,
    sangramentoGengival: frontData.gengivaSangra ?? null,
    possuiHabito: frontData.habito ?? null,
    descricaoHabito: frontData.habitoDetalhes ?? '',
    historicoDiabetes: frontData.diabeticoFamilia ?? null,
    sangramentoExcessivo: frontData.sangramentoCortes ?? null,
    problemaCardiaco: frontData.problemaCardiaco ?? null,
    descricaoProblemaCardiaco: frontData.problemaCardiacoDetalhes ?? '',
    pressaoArterialNormal: frontData.pressaoArterialNormal ?? null,
    descricaoPressaoArterial: '',
    historicoDesmaioConvulsao: frontData.desmaioConvulsao ?? null,
    gestante: frontData.gravidez ?? null,
  };
}

function mapAnamneseResponseToFront(response) {
  return {
    idAnamnese: response.idAnamnese,
    dataAnamnese: response.dataAnamnese,
    tratamentoMedico: response.fazendoTratamento,
    tratamentoMedicoDetalhes: response.descricaoTratamento,
    doresCabecaFace: response.doresCabecaFaceAtm,
    alergiaMedicamento: response.alergiaMedicamentos,
    alergiaMedicamentoDetalhes: response.descricaoAlergiaMedicamentos,
    reacaoAnestesia: response.reacaoAnestesiaLocal,
    sensibilidadeDentes: response.sensibilidadeDentaria,
    rangeDentes: response.bruxismoApertamento,
    gengivaSangra: response.sangramentoGengival,
    habito: response.possuiHabito,
    habitoDetalhes: response.descricaoHabito,
    diabeticoFamilia: response.historicoDiabetes,
    sangramentoCortes: response.sangramentoExcessivo,
    problemaCardiaco: response.problemaCardiaco,
    problemaCardiacoDetalhes: response.descricaoProblemaCardiaco,
    pressaoArterialNormal: response.pressaoArterialNormal,
    desmaioConvulsao: response.historicoDesmaioConvulsao,
    gravidez: response.gestante,
  };
}

export async function listAnamneses(clienteId) {
  const responses = await apiGet(`/clientes/${clienteId}/anamneses`);
  return responses.map(mapAnamneseResponseToFront);
}

export async function criarAnamnese(clienteId, frontData) {
  const request = mapFrontToAnamneseRequest(frontData, clienteId);
  const response = await apiPost(`/clientes/${clienteId}/anamneses`, request);
  return mapAnamneseResponseToFront(response);
}

export async function getAnamneseById(id) {
  const response = await apiGet(`/anamneses/${id}`);
  return mapAnamneseResponseToFront(response);
}