import { useMemo, useState } from 'react';
import { DENTISTAS, rotuloHoje } from '../../../data/agenda';
import { useConsultas } from '../../../context/ConsultasContexto';
import { aplicarFiltros } from '../../../utils/filtragem';
import ConsultaItem from '../ConsultaItem';
import styles from './styles.module.css';

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
    <section className={styles.card} aria-label="Consultas do dia">
      <div className={styles.cabecalho}>
        <div className={styles.titulos}>
          <h2>Consultas do dia</h2>
          <p>{rotuloHoje()}</p>
        </div>

        <div className={styles.filtro}>
          <label htmlFor="filtro-dentista-lista">Dentista:</label>
          <div className={styles.seletorWrap}>
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
            <span className={styles.seta}>
              <IconeSetaFina />
            </span>
          </div>
        </div>
      </div>

      <ul className={styles.lista}>
        {consultasFiltradas.length > 0 ? (
          consultasFiltradas.map((consulta) => (
            <ConsultaItem key={consulta.id} consulta={consulta} />
          ))
        ) : (
          <li className={styles.vazio}>
            Nenhuma consulta encontrada para este dia
            {dentistaFiltro ? ' e dentista selecionado' : ''}.
          </li>
        )}
      </ul>
    </section>
  );
}

export default ListaConsultasDia;
