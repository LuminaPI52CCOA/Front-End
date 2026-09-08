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

export function FormularioAgendamento({ valores, onChange, onNovoPaciente }) {
  const [listaAberta, setListaAberta] = useState(false);
  const [buscaDentista, setBuscaDentista] = useState('');
  const [listaDentistasAberta, setListaDentistasAberta] = useState(false);

  const opcoesPacientes = PACIENTES.some(
    (opcao) => opcao.label === valores.paciente,
  )
    ? PACIENTES
    : [
        ...PACIENTES,
        { value: valores.paciente, label: valores.paciente },
      ].filter((opcao) => opcao.label !== '');

  const resultados = opcoesPacientes.filter((opcao) =>
    normalizar(opcao.label).includes(normalizar(valores.paciente.trim())),
  );

  const selecionarPaciente = (nome) => {
    onChange('paciente', nome);
    setListaAberta(false);
  };

  const resultadosDentistas = DENTISTAS.filter((opcao) =>
    normalizar(opcao.label).includes(normalizar(buscaDentista.trim())),
  );

  const selecionarDentista = (nome) => {
    setBuscaDentista(nome);
    onChange('dentista', nome);
    setListaDentistasAberta(false);
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
              value={valores.paciente}
              onChange={(evento) => {
                onChange('paciente', evento.target.value);
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
                  <li className={styles.itemOpcao} key={opcao.value} role="option" aria-selected={opcao.label === valores.paciente}>
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
            onClick={onNovoPaciente}
            title="Cadastrar novo paciente"
            aria-label="Cadastrar novo paciente"
          >
            <IconeNovaPessoa />
          </button>
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="busca-dentista">Dentistas:</label>
        <div className={styles.envolvedorAutocomplete}>
          <input
            className={styles.campoBusca}
            id="busca-dentista"
            type="text"
            role="combobox"
            aria-expanded={listaDentistasAberta}
            aria-controls="lista-dentistas"
            aria-autocomplete="list"
            autoComplete="off"
            placeholder="Selecione ou busque o dentista"
            value={buscaDentista}
            onChange={(evento) => {
              setBuscaDentista(evento.target.value);
              onChange('dentista', '');
              setListaDentistasAberta(true);
            }}
            onFocus={() => setListaDentistasAberta(true)}
            onBlur={() => setListaDentistasAberta(false)}
            onKeyDown={(evento) => {
              if (evento.key === 'Escape') setListaDentistasAberta(false);
              if (
                evento.key === 'Enter' &&
                listaDentistasAberta &&
                resultadosDentistas.length > 0
              ) {
                evento.preventDefault();
                selecionarDentista(resultadosDentistas[0].label);
              }
            }}
          />

          {listaDentistasAberta && resultadosDentistas.length > 0 && (
            <ul className={styles.listaSuspensa} id="lista-dentistas" role="listbox">
              {resultadosDentistas.map((opcao) => (
                <li
                  className={styles.itemOpcao}
                  key={opcao.value}
                  role="option"
                  aria-selected={opcao.label === buscaDentista}
                >
                  <button
                    type="button"
                    onMouseDown={(evento) => evento.preventDefault()}
                    onClick={() => selecionarDentista(opcao.label)}
                  >
                    {opcao.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
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
