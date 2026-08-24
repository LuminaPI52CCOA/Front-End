import { useMemo, useState } from 'react';
import { Select } from '../../Select';
import { DENTISTAS, CONSULTAS_DO_DIA } from '../../../data/agenda';
import ConsultaItem from '../ConsultaItem';
import * as S from './styles';

export function ListaConsultasDia() {
  const [dentistaFiltro, setDentistaFiltro] = useState('');

  const opcoesDentista = [{ value: '', label: 'Todos' }, ...DENTISTAS];

  const consultasFiltradas = useMemo(
    () =>
      dentistaFiltro
        ? CONSULTAS_DO_DIA.filter((c) => c.dentista === dentistaFiltro)
        : CONSULTAS_DO_DIA,
    [dentistaFiltro],
  );

  return (
    <S.Card aria-label="Consultas do dia">
      <S.Cabecalho>
        <S.Titulos>
          <h2>Consultas do dia</h2>
          <p>Hoje: 30 OUT 2026</p>
        </S.Titulos>

        <S.FiltroDentista>
          <Select
            label="Dentista:"
            options={opcoesDentista}
            value={dentistaFiltro}
            onChange={(evento) => setDentistaFiltro(evento.target.value)}
            aria-label="Filtrar consultas do dia por dentista"
          />
        </S.FiltroDentista>
      </S.Cabecalho>

      <S.Lista>
        {consultasFiltradas.length > 0 ? (
          consultasFiltradas.map((consulta) => (
            <ConsultaItem key={consulta.id} consulta={consulta} />
          ))
        ) : (
          <S.Vazio>Nenhuma consulta encontrada para este dentista.</S.Vazio>
        )}
      </S.Lista>
    </S.Card>
  );
}

export default ListaConsultasDia;
