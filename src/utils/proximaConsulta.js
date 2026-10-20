import { hojeISO } from './datas';

export function obterProximaConsulta(consultas, campo, valor) {
  if (!consultas || !valor) return null;
  const hoje = hojeISO();
  const consultasFuturas = consultas
    .filter(
      (c) =>
        c[campo] === valor &&
        c.status !== 'Cancelado' &&
        c.data >= hoje,
    )
    .sort((a, b) => {
      if (a.data !== b.data) {
        return a.data.localeCompare(b.data);
      }
      return (a.inicio || '').localeCompare(b.inicio || '');
    });

  return consultasFuturas[0]?.data ?? null;
}

export function formatarDataBR(iso) {
  if (!iso) return '';
  const partes = iso.split('-');
  if (partes.length !== 3) return iso;
  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
}

export function ordenarPorProximaConsulta(a, b) {
  if (a.proximaConsulta && b.proximaConsulta) {
    if (a.proximaConsulta !== b.proximaConsulta) {
      return a.proximaConsulta.localeCompare(b.proximaConsulta);
    }
    return a.nome.localeCompare(b.nome);
  }
  if (a.proximaConsulta && !b.proximaConsulta) return -1;
  if (!a.proximaConsulta && b.proximaConsulta) return 1;
  return a.nome.localeCompare(b.nome);
}
