const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Cadastra um novo paciente/cliente no backend.
 * Endpoint: POST http://localhost:8080/clientes
 * 
 * @param {Object} patientData - Dados validados do paciente
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function createPatient(patientData) {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      return { success: true, data };
    }

    const errorBody = await response.json().catch(() => null);
    const errorMessage = errorBody?.message || errorBody?.error || `Erro ${response.status} ao cadastrar paciente`;
    return { success: false, error: errorMessage };
  } catch (error) {
    console.error('Erro de conexão ao cadastrar paciente no backend:', error);
    return { success: false, error: 'Não foi possível conectar ao servidor backend (localhost:8080).' };
  }
}
