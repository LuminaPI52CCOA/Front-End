import { useState } from 'react';
import { DENTISTAS, ESPECIALIDADES, PACIENTES } from '../../../data/agenda';
import styles from './styles.module.css';

function IconeNovaPessoa() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <line x1="19" y1="7" x2="19" y2="13" />
      <line x1="16" y1="10" x2="22" y2="10" />
    </svg>
  );
}

const normalizar = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export function FormularioAgendamento({ valores, onChange }) {
  const [buscaPaciente, setBuscaPaciente] = useState('');
  const [listaAberta, setListaAberta] = useState(false);

  const resultados = PACIENTES.filter((opcao) =>
    normalizar(opcao.label).includes(normalizar(buscaPaciente.trim())),
  );

  const selecionarPaciente = (nome) => {
    setBuscaPaciente(nome);
    onChange('paciente', nome);
    setListaAberta(false);
  };

  return (
    <section className={styles.card} aria-label="Formulário do agendamento">
      <div className={styles.campo}>
        <label htmlFor="busca-paciente">Pacientes:</label>
        <div className={styles.linhaPaciente}>
          <div className={styles.envolvedorAutocomplete}>
            <input
              className={styles.campoBusca}
              id="busca-paciente"
              type="text"
              role="combobox"
              aria-expanded={listaAberta}
              aria-controls="lista-pacientes"
              aria-autocomplete="list"
              autoComplete="off"
              placeholder="Selecione ou busque o paciente"
              value={buscaPaciente}
              onChange={(evento) => {
                setBuscaPaciente(evento.target.value);
                onChange('paciente', '');
                setListaAberta(true);
              }}
              onFocus={() => setListaAberta(true)}
              onBlur={() => setListaAberta(false)}
              onKeyDown={(evento) => {
                if (evento.key === 'Escape') setListaAberta(false);
                if (
                  evento.key === 'Enter' &&
                  listaAberta &&
                  resultados.length > 0
                ) {
                  evento.preventDefault();
                  selecionarPaciente(resultados[0].label);
                }
              }}
            />

            {listaAberta && resultados.length > 0 && (
              <ul className={styles.listaSuspensa} id="lista-pacientes" role="listbox">
                {resultados.map((opcao) => (
                  <li className={styles.itemOpcao} key={opcao.value} role="option" aria-selected={opcao.label === buscaPaciente}>
                    <button
                      type="button"
                      onMouseDown={(evento) => evento.preventDefault()}
                      onClick={() => selecionarPaciente(opcao.label)}
                    >
                      {opcao.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className={styles.botaoNovoPaciente}
            type="button"
            title="Cadastrar novo paciente (em breve)"
            aria-label="Cadastrar novo paciente"
          >
            <IconeNovaPessoa />
          </button>
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="select-dentista">Dentistas:</label>
        <div className={styles.envolvedorSeletor}>
          <select
            className={styles.seletor}
            id="select-dentista"
            value={valores.dentista}
            onChange={(evento) => onChange('dentista', evento.target.value)}
          >
            <option value="">Selecione</option>
            {DENTISTAS.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="select-especialidade">Especialidades:</label>
        <div className={styles.envolvedorSeletor}>
          <select
            className={styles.seletor}
            id="select-especialidade"
            value={valores.especialidade}
            onChange={(evento) => onChange('especialidade', evento.target.value)}
          >
            <option value="">Selecione</option>
            {ESPECIALIDADES.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="area-observacoes">Observações:</label>
        <textarea
          className={styles.areaObservacoes}
          id="area-observacoes"
          placeholder="Notas Adicionais"
          value={valores.observacoes}
          onChange={(evento) => onChange('observacoes', evento.target.value)}
        />
      </div>
    </section>
  );
}

export default FormularioAgendamento;
