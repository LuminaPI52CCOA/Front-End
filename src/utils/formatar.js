export function formatarTelefone(valor) {
  const digitos = String(valor ?? '').replace(/\D/g, '').slice(0, 11);
  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  if (!resto) return ddd ? `(${ddd}` : '';
  const prefixo = resto.slice(0, resto.length > 8 ? 5 : 4);
  const sufixo = resto.slice(resto.length > 8 ? 5 : 4);
  return `(${ddd}) ${prefixo}-${sufixo}`;
}