import { useMemo, useState } from 'react';
import { DENTISTAS, rotuloHoje } from '../../../data/agenda';
import { useConsultas } from '../../../context/ConsultasContexto';
import { aplicarFiltros } from '../../../utils/filtragem';
import ConsultaItem from '../ConsultaItem';
import * as S from './styles';

function IconeSetaFina() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8c7a5e"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ListaConsultasDia({ selectedDate, filtros }) {
  const { consultas } = useConsultas();
  const [dentistaFiltro, setDentistaFiltro] = useState('');

  const opcoesDentista = [{ value: '', label: 'Todos' }, ...DENTISTAS];

  const consultasFiltradas = useMemo(
    () =>
      aplicarFiltros(consultas, filtros)
        .filter((consulta) => consulta.data === selectedDate)
        .filter(
          (consulta) =>
            !dentistaFiltro || consulta.dentista === dentistaFiltro,
        )
        .sort((a, b) => a.inicio.localeCompare(b.inicio)),
    [consultas, filtros, selectedDate, dentistaFiltro],
  );

  return (
    <S.Card aria-label="Consultas do dia">
      <S.Cabecalho>
        <S.Titulos>
          <h2>Consultas do dia</h2>
          <p>
            {rotuloHoje()} <span aria-hidden="true">›</span>
          </p>
        </S.Titulos>

        <S.Filtro>
          <label htmlFor="filtro-dentista-lista">Dentista:</label>
          <S.SeletorWrap>
            <select
              id="filtro-dentista-lista"
              value={dentistaFiltro}
              onChange={(evento) => setDentistaFiltro(evento.target.value)}
            >
              {opcoesDentista.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
            <span className="seta">
              <IconeSetaFina />
            </span>
          </S.SeletorWrap>
        </S.Filtro>
      </S.Cabecalho>

      <S.Lista>
        {consultasFiltradas.length > 0 ? (
          consultasFiltradas.map((consulta) => (
            <ConsultaItem key={consulta.id} consulta={consulta} />
          ))
        ) : (
          <S.Vazio>
            Nenhuma consulta encontrada para este dia
            {dentistaFiltro ? ' e dentista selecionado' : ''}.
          </S.Vazio>
        )}
      </S.Lista>
    </S.Card>
  );
}

export default ListaConsultasDia;
