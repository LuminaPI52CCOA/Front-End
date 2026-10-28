import { useMemo } from 'react';
import { useConsultas } from '../context/ConsultasContexto';
import { adicionarDias, hojeISO } from '../utils/datas';

export function useConsultasAmanha() {
  const { consultas, carregando } = useConsultas();
  const dataAmanha = adicionarDias(hojeISO(), 1);

  const consultasAmanha = useMemo(
    () =>
      consultas
        .filter((consulta) => consulta.data === dataAmanha)
        .filter(
          (consulta) =>
            consulta.status !== 'Cancelado' &&
            consulta.statusApi !== 'CANCELADA',
        )
        .sort((a, b) => a.inicio.localeCompare(b.inicio)),
    [consultas, dataAmanha],
  );

  return { dataAmanha, consultasAmanha, carregando };
}
