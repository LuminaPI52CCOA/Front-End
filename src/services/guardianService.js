const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Consulta cliente/responsável legal no backend filtrando por CPF.
 * Endpoint: GET http://localhost:8080/clientes?cpf=:cpf
 * 
 * @param {string} cpf - CPF digitado pelo operador
 * @returns {Promise<{ found: boolean, data: { nome: string, rg: string, grauParentesco: string } | null }>}
 */
export async function searchGuardianByCpf(cpf) {
  const cleanCpf = (cpf || '').replace(/\D/g, '');

  if (cleanCpf.length !== 11) {
    return { found: false, data: null };
  }

  try {
    // 1. Tenta consulta passando CPF limpo (apenas números)
    let url = `${API_BASE_URL}/clientes?cpf=${encodeURIComponent(cleanCpf)}`;
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Se não encontrou e o backend exigir formato com máscara, tenta também com a máscara
    if (!response.ok && response.status !== 404 && cpf.includes('.')) {
      url = `${API_BASE_URL}/clientes?cpf=${encodeURIComponent(cpf)}`;
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    }

    if (response.status === 404) {
      return { found: false, data: null };
    }

    if (!response.ok) {
      return { found: false, data: null };
    }

    const json = await response.json();

    // Tratamento de formato de retorno (objeto direto, lista ou Pageable)
    let item = null;
    if (Array.isArray(json)) {
      item = json.length > 0 ? json[0] : null;
    } else if (json && Array.isArray(json.content)) {
      item = json.content.length > 0 ? json.content[0] : null;
    } else if (json && typeof json === 'object') {
      item = json;
    }

    if (item && (item.nome || item.nomeCompleto || item.nomeResponsavel || item.name)) {
      return {
        found: true,
        data: {
          nome: item.nome || item.nomeCompleto || item.nomeResponsavel || item.name || '',
          rg: item.rg || item.rgResponsavel || '',
          grauParentesco: item.grauParentesco || item.parentesco || 'Pai / Mãe',
        },
      };
    }

    return { found: false, data: null };
  } catch (error) {
    console.error('Erro ao consultar cliente por CPF em http://localhost:8080/clientes:', error);
    return { found: false, data: null };
  }
}
