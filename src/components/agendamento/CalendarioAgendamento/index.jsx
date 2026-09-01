import { useState } from 'react';
import { deISO, paraISO } from '../../../utils/datas';
import styles from './styles.module.css';

const MESES_COMPLETOS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

const mesmoMes = (isoA, isoB) => isoA.slice(0, 7) === isoB.slice(0, 7);

export function CalendarioAgendamento({ dataSelecionada, onSelect }) {
  const [visao, setVisao] = useState(() => dataSelecionada.slice(0, 7));
  const [dataSincronizada, setDataSincronizada] = useState(dataSelecionada);

  if (dataSelecionada !== dataSincronizada) {
    setDataSincronizada(dataSelecionada);
    setVisao(dataSelecionada.slice(0, 7));
  }

  const [anoTexto, mesTexto] = visao.split('-');
  const ano = Number(anoTexto);
  const mesIndice = Number(mesTexto) - 1;

  const primeiroDoMes = new Date(ano, mesIndice, 1);
  const deslocamento = primeiroDoMes.getDay();
  const inicio = new Date(ano, mesIndice, 1 - deslocamento);

  const celulas = Array.from({ length: 42 }, (_, indice) => {
    const data = new Date(
      inicio.getFullYear(),
      inicio.getMonth(),
      inicio.getDate() + indice,
    );
    return { data, iso: paraISO(data) };
  });

  const navegar = (quantidade) => {
    const nova = new Date(ano, mesIndice + quantidade, 1);
    setVisao(
      `${nova.getFullYear()}-${String(nova.getMonth() + 1).padStart(2, '0')}`,
    );
  };

  const rotuloRodape = (() => {
    const selecionada = deISO(dataSelecionada);
    return `Data selecionada: ${selecionada.getDate()} de ${
      MESES_COMPLETOS[selecionada.getMonth()]
    }, ${selecionada.getFullYear()}`;
  })();

  return (
    <section className={styles.card} aria-label="Calendário para seleção da data da consulta">
      <div className={styles.cabecalho}>
        <h3>
          {MESES_COMPLETOS[mesIndice]} {ano}
        </h3>
        <nav className={styles.navegacao} aria-label="Navegar entre meses">
          <button
            className={styles.botaoNavegar}
            type="button"
            onClick={() => navegar(-1)}
            aria-label="Mês anterior"
          >
            ‹
          </button>
          <button
            className={styles.botaoNavegar}
            type="button"
            onClick={() => navegar(1)}
            aria-label="Próximo mês"
          >
            ›
          </button>
        </nav>
      </div>

      <div className={styles.grade}>
        <div className={styles.diasSemana} aria-hidden="true">
          {DIAS_SEMANA.map((dia) => (
            <span key={dia}>{dia}</span>
          ))}
        </div>

        <div className={styles.celulas}>
          {celulas.map(({ data, iso }) => {
            const foraDoMes = !mesmoMes(iso, visao);
            return (
              <button
                className={`${styles.celulaDia}${foraDoMes ? ` ${styles.foraDoMes}` : ''}${iso === dataSelecionada ? ` ${styles.selecionado}` : ''}`}
                key={iso}
                type="button"
                disabled={foraDoMes}
                onClick={() => onSelect(iso)}
              >
                {data.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <footer className={styles.rodape}>
        <span className={styles.quadradoIndicador} aria-hidden="true" />
        <p>{rotuloRodape}</p>
      </footer>
    </section>
  );
}

export default CalendarioAgendamento;
