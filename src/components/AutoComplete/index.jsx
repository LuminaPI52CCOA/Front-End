import { useState } from 'react';
import styles from './styles.module.css';

const normalizar = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export function AutoComplete({ id, label, options, value, onChange, placeholder }) {
  const [busca, setBusca] = useState(value || '');
  const [listaAberta, setListaAberta] = useState(false);

  const resultados = options.filter((opcao) =>
    normalizar(opcao.label).includes(normalizar(busca.trim())),
  );

  const selecionar = (opcaoValor) => {
    setBusca(opcaoValor);
    onChange(opcaoValor);
    setListaAberta(false);
  };

  return (
    <div className={styles.campo}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.envolvedor}>
        <input
          className={styles.campoBusca}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={listaAberta}
          aria-controls={`lista-${id}`}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          value={busca}
          onChange={(evento) => {
            setBusca(evento.target.value);
            onChange('');
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
              selecionar(resultados[0].label);
            }
          }}
        />

        {listaAberta && resultados.length > 0 && (
          <ul className={styles.listaSuspensa} id={`lista-${id}`} role="listbox">
            {resultados.map((opcao) => (
              <li
                className={styles.itemOpcao}
                key={opcao.value}
                role="option"
                aria-selected={opcao.label === busca}
              >
                <button
                  type="button"
                  onMouseDown={(evento) => evento.preventDefault()}
                  onClick={() => selecionar(opcao.label)}
                >
                  {opcao.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AutoComplete;
