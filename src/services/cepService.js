export async function buscarCep(cep) {
  const digitos = (cep || '').replace(/\D/g, '');
  if (digitos.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.erro) return null;

    return {
      rua: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      complemento: data.complemento || '',
    };
  } catch {
    return null;
  }
}
