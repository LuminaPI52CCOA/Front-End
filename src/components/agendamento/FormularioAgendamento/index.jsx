import { useEffect, useState } from 'react';
import { buscarPacientes } from '../../../services/patientService';
import { userService } from '../../../services/userService';
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

const ATRASO_BUSCA_MS = 300;

/**
 * Busca no servidor enquanto a lista está aberta e nada foi selecionado.
 * O resultado guarda o termo pesquisado para que respostas antigas não sejam exibidas.
 */
function useBuscaRemota(buscar, termo, ativa) {
  const [resultado, setResultado] = useState({ termo: null, itens: [], erro: '' });

  useEffect(() => {
    if (!ativa) return undefined;
    const controlador = new AbortController();
    const temporizador = setTimeout(() => {
      buscar(termo, controlador.signal)
        .then((itens) => {
          if (!controlador.signal.aborted) setResultado({ termo, itens, erro: '' });
        })
        .catch((erro) => {
          if (erro.name === 'AbortError' || controlador.signal.aborted) return;
          setResultado({ termo, itens: [], erro: erro.message });
        });
    }, ATRASO_BUSCA_MS);

    return () => {
      clearTimeout(temporizador);
      controlador.abort();
    };
  }, [buscar, termo, ativa]);

  const atual = resultado.termo === termo;
  return {
    carregando: ativa && !atual,
    itens: atual ? resultado.itens : [],
    erro: atual ? resultado.erro : '',
  };
}

const buscarDentistas = (nome, signal) => userService.buscarDentistas(nome, signal);

function MensagemLista({ texto }) {
  return (
    <li className={styles.itemOpcao} role="option" aria-disabled="true" aria-selected="false">
      <button type="button" disabled onMouseDown={(evento) => evento.preventDefault()}>
        {texto}
      </button>
    </li>
  );
}

export function FormularioAgendamento({ valores, onChange, especialidades, onNovoPaciente }) {
  const [listaAberta, setListaAberta] = useState(false);
  const [listaDentistasAberta, setListaDentistasAberta] = useState(false);

  const termoPaciente = valores.textoPaciente.trim();
  const pacientes = useBuscaRemota(buscarPacientes, termoPaciente, listaAberta && !valores.paciente);

  const termoDentista = valores.textoDentista.trim();
  const dentistas = useBuscaRemota(
    buscarDentistas,
    termoDentista,
    listaDentistasAberta && !valores.dentista,
  );

  const selecionarPaciente = (paciente) => {
    onChange({
      paciente: { id: paciente.idCliente, nome: paciente.nome },
      textoPaciente: paciente.nome,
    });
    setListaAberta(false);
  };

  const selecionarDentista = (dentista) => {
    onChange({
      dentista: { id: dentista.idUsuario, nome: dentista.nome },
      textoDentista: dentista.nome,
    });
    setListaDentistasAberta(false);
  };

  const mensagemPacientes = pacientes.carregando
    ? 'Buscando pacientes...'
    : pacientes.erro || (pacientes.itens.length === 0 ? 'Nenhum paciente encontrado' : '');

  const mensagemDentistas = dentistas.carregando
    ? 'Buscando dentistas...'
    : dentistas.erro || (dentistas.itens.length === 0 ? 'Nenhum dentista ativo encontrado' : '');

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
              aria-expanded={listaAberta && !valores.paciente}
              aria-controls="lista-pacientes"
              aria-autocomplete="list"
              aria-invalid={Boolean(valores.textoPaciente) && !valores.paciente}
              autoComplete="off"
              placeholder="Selecione ou busque o paciente"
              value={valores.textoPaciente}
              onChange={(evento) => {
                onChange({ textoPaciente: evento.target.value, paciente: null });
                setListaAberta(true);
              }}
              onFocus={() => setListaAberta(true)}
              onBlur={() => setListaAberta(false)}
              onKeyDown={(evento) => {
                if (evento.key === 'Escape') setListaAberta(false);
                if (
                  evento.key === 'Enter' &&
                  listaAberta &&
                  pacientes.itens.length > 0
                ) {
                  evento.preventDefault();
                  selecionarPaciente(pacientes.itens[0]);
                }
              }}
            />

            {listaAberta && !valores.paciente && (
              <ul className={styles.listaSuspensa} id="lista-pacientes" role="listbox">
                {mensagemPacientes ? (
                  <MensagemLista texto={mensagemPacientes} />
                ) : (
                  pacientes.itens.map((paciente) => (
                    <li className={styles.itemOpcao} key={paciente.idCliente} role="option" aria-selected="false">
                      <button
                        type="button"
                        onMouseDown={(evento) => evento.preventDefault()}
                        onClick={() => selecionarPaciente(paciente)}
                      >
                        {paciente.nome}
                        {paciente.cpf ? ` · CPF ${paciente.cpf}` : ''}
                      </button>
                    </li>
                  ))
                )}
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
            aria-expanded={listaDentistasAberta && !valores.dentista}
            aria-controls="lista-dentistas"
            aria-autocomplete="list"
            aria-invalid={Boolean(valores.textoDentista) && !valores.dentista}
            autoComplete="off"
            placeholder="Selecione ou busque o dentista"
            value={valores.textoDentista}
            onChange={(evento) => {
              onChange({ textoDentista: evento.target.value, dentista: null });
              setListaDentistasAberta(true);
            }}
            onFocus={() => setListaDentistasAberta(true)}
            onBlur={() => setListaDentistasAberta(false)}
            onKeyDown={(evento) => {
              if (evento.key === 'Escape') setListaDentistasAberta(false);
              if (
                evento.key === 'Enter' &&
                listaDentistasAberta &&
                dentistas.itens.length > 0
              ) {
                evento.preventDefault();
                selecionarDentista(dentistas.itens[0]);
              }
            }}
          />

          {listaDentistasAberta && !valores.dentista && (
            <ul className={styles.listaSuspensa} id="lista-dentistas" role="listbox">
              {mensagemDentistas ? (
                <MensagemLista texto={mensagemDentistas} />
              ) : (
                dentistas.itens.map((dentista) => (
                  <li
                    className={styles.itemOpcao}
                    key={dentista.idUsuario}
                    role="option"
                    aria-selected="false"
                  >
                    <button
                      type="button"
                      onMouseDown={(evento) => evento.preventDefault()}
                      onClick={() => selecionarDentista(dentista)}
                    >
                      {dentista.nome}
                    </button>
                  </li>
                ))
              )}
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
            value={valores.idEspecialidade}
            onChange={(evento) => onChange({ idEspecialidade: evento.target.value })}
          >
            <option value="">Selecione</option>
            {especialidades.map((opcao) => (
              <option key={opcao.idEspecialidade} value={opcao.idEspecialidade}>
                {opcao.nome}
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
          maxLength={500}
          value={valores.observacoes}
          onChange={(evento) => onChange({ observacoes: evento.target.value })}
        />
      </div>
    </section>
  );
}

export default FormularioAgendamento;
