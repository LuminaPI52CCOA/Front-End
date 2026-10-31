import styles from './styles.module.css';

const OPCOES_DURACAO = [
  { value: '15', label: 'Consulta comum (15 min)' },
  { value: '30', label: 'Retorno (30 min)' },
  { value: '45', label: 'Sessão estendida (45 min)' },
  { value: '60', label: 'Procedimento completo (60 min)' },
];

export function HorariosDisponiveis({
  duracao,
  onDuracaoChange,
  horarioSelecionado,
  onSelectHorario,
  horarios = [],
  carregando = false,
  dentistaSelecionado = true,
  diaBloqueado = false,
}) {
  return (
    <section className={styles.card} aria-label="Seleção de horário disponível">
      <div className={styles.cabecalho}>
        <h3>Horários Disponíveis</h3>
      </div>

      <div className={styles.corpo}>
        <div>
          <p className={styles.rotulo} id="rotulo-duracao">
            Selecione o tempo de consulta
          </p>
          <div className={styles.envolvedorSeletor}>
            <select
              className={styles.seletor}
              aria-labelledby="rotulo-duracao"
              value={duracao}
              onChange={(evento) => onDuracaoChange(evento.target.value)}
            >
              {OPCOES_DURACAO.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div role="group" aria-labelledby="rotulo-inicio">
          <p className={styles.rotulo} id="rotulo-inicio">
            Escolha o horário de início
          </p>
          <div className={styles.areaRolagem}>
            {!dentistaSelecionado ? (
              <p className={styles.mensagemEstado}>
                Selecione um dentista e uma data para consultar os horários disponíveis.
              </p>
            ) : carregando ? (
              <p className={styles.mensagemEstado}>Carregando horários disponíveis...</p>
            ) : diaBloqueado ? (
              <p className={styles.mensagemEstado}>
                Dentista indisponível nesta data.
              </p>
            ) : horarios.length === 0 ? (
              <p className={styles.mensagemEstado}>
                Nenhum horário disponível para a data e duração selecionadas.
              </p>
            ) : (
              <div className={styles.gradeHorarios}>
                {horarios.map((slot) => {
                  const inicio = typeof slot === 'string' ? slot : slot.inicio;
                  return (
                    <button
                      className={`${styles.botaoHorario}${inicio === horarioSelecionado ? ` ${styles.selecionado}` : ''}`}
                      key={inicio}
                      type="button"
                      aria-pressed={inicio === horarioSelecionado}
                      onClick={() => onSelectHorario(inicio)}
                    >
                      {inicio}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className={styles.rodape}>
        <span className={styles.quadradoIndicador} aria-hidden="true" />
        <p>Selecionado: {horarioSelecionado || '--:--'}</p>
      </footer>
    </section>
  );
}

export default HorariosDisponiveis;
