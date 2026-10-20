import { useMemo, useState } from 'react';
import { MESES_ABREV } from '../../../data/agenda';
import {
  paraISO,
  deISO,
  hojeISO,
  inicioDaSemanaISO,
} from '../../../utils/datas';
import styles from './styles.module.css';

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

export function CalendarioSelecao({ selectedDate, onSelectData }) {
  const [visao, setVisao] = useState(() => {
    const base = deISO(selectedDate);
    return { ano: base.getFullYear(), mes: base.getMonth() };
  });
  const [dataSincronizada, setDataSincronizada] = useState(selectedDate);

  if (dataSincronizada !== selectedDate) {
    setDataSincronizada(selectedDate);
    const base = deISO(selectedDate);
    setVisao({ ano: base.getFullYear(), mes: base.getMonth() });
  }

  const trocarMes = (deslocamento) =>
    setVisao((atual) => {
      const nova = new Date(atual.ano, atual.mes + deslocamento, 1);
      return { ano: nova.getFullYear(), mes: nova.getMonth() };
    });

  const celulas = useMemo(() => {
    const deslocamento = new Date(visao.ano, visao.mes, 1).getDay();
    const diasNoMes = new Date(visao.ano, visao.mes + 1, 0).getDate();
    const totalCelulas = Math.ceil((deslocamento + diasNoMes) / 7) * 7;

    return Array.from({ length: totalCelulas }, (_, indice) => {
      const data = new Date(visao.ano, visao.mes, 1 - deslocamento + indice);
      return {
        iso: paraISO(data),
        dia: data.getDate(),
        noMes: data.getMonth() === visao.mes,
      };
    });
  }, [visao]);

  const semanaSelecionada = inicioDaSemanaISO(selectedDate);
  const hoje = hojeISO();

  return (
    <section className={styles.card} aria-label="Calendário de seleção de datas">
      <div className={styles.cabecalho}>
        <div className={styles.grupo}>
          <button
            className={styles.botaoSeta}
            type="button"
            aria-label="Mês anterior"
            onClick={() => trocarMes(-1)}
          >
            ‹
          </button>
          <p className={styles.ano}>
            {visao.ano}
          </p>
        </div>

        <div className={styles.grupo}>
          <p className={styles.mes}>{MESES_ABREV[visao.mes]}</p>
          <button
            className={styles.botaoSeta}
            type="button"
            aria-label="Próximo mês"
            onClick={() => trocarMes(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div
        className={styles.grade}
        role="grid"
        aria-label={`Calendário ${MESES_ABREV[visao.mes]} ${visao.ano}`}
      >
        {DIAS_SEMANA.map((dia) => (
          <span className={styles.diaSemana} key={dia} aria-hidden="true">
            {dia}
          </span>
        ))}

        {celulas.map(({ iso, dia, noMes }) => {
          const selecionado = iso === selectedDate;
          const naFaixa = inicioDaSemanaISO(iso) === semanaSelecionada;

          return (
            <div className={styles.celula} key={iso}>
              <button
                className={`${styles.botaoDia}${selecionado ? ` ${styles.selecionado}` : ''}${naFaixa && !selecionado ? ` ${styles.naFaixa}` : ''}${!noMes && !naFaixa ? ` ${styles.foraMes}` : ''}`}
                type="button"
                aria-pressed={selecionado}
                aria-current={iso === hoje ? 'date' : undefined}
                aria-label={`${dia} de ${MESES_ABREV[visao.mes]} de ${visao.ano}${
                  selecionado ? ', selecionado' : ''
                }`}
                onClick={() => onSelectData(iso)}
              >
                {dia}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CalendarioSelecao;
