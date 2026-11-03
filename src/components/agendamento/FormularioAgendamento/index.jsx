import { useMemo, useState } from 'react';
import { useDentistasOpcoes } from '../../../hooks/useDentistasOpcoes';
import { useEspecialidades } from '../../../hooks/useEspecialidades';
import { usePatients } from '../../../hooks/usePatients';
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
  String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export function FormularioAgendamento({
  valores,
  onChange,
  onNovoPaciente,
  camposBloqueados = [],
}) {
  const { dentistas } = useDentistasOpcoes();
  const { especialidades } = useEspecialidades();
  const { pacientes } = usePatients();

  const bloqueado = (campo) => camposBloqueados.includes(campo);

  const [listaAberta, setListaAberta] = useState(false);
  const [buscaPaciente, setBuscaPaciente] = useState(null);
  const [buscaDentista, setBuscaDentista] = useState(null);
  const [listaDentistasAberta, setListaDentistasAberta] = useState(false);

  const pacienteSelecionado = useMemo(() => {
    if (!valores.pacienteId || !pacientes?.length) return null;
    return pacientes.find((item) => String(item.id) === String(valores.pacienteId));
  }, [valores.pacienteId, pacientes]);

  const dentistaSelecionado = useMemo(() => {
    if (!dentistas?.length) return null;
    if (valores.dentistaId) {
      return dentistas.find((d) => String(d.id) === String(valores.dentistaId));
    }
    if (valores.dentista) {
      return dentistas.find((d) => d.nome === valores.dentista);
    }
    return null;
  }, [valores.dentistaId, valores.dentista, dentistas]);

  const textoPaciente =
    buscaPaciente !== null
      ? buscaPaciente
      : pacienteSelecionado?.nome || valores.pacienteNome || '';

  const textoDentista =
    buscaDentista !== null
      ? buscaDentista
      : dentistaSelecionado?.label || valores.dentista || '';

  const opcoesPacientes = useMemo(
    () => (pacientes || []).map((p) => ({ value: String(p.id), label: p.nome })),
    [pacientes],
  );

  const opcoesDentistas = useMemo(
    () =>
      (dentistas || []).map((d) => ({
        value: String(d.id),
        label: d.label || d.nome,
        nome: d.nome,
      })),
    [dentistas],
  );

  const resultados = useMemo(
    () =>
      opcoesPacientes.filter((opcao) =>
        normalizar(opcao.label).includes(normalizar((textoPaciente || '').trim())),
      ),
    [opcoesPacientes, textoPaciente],
  );

  const selecionarPaciente = (opcao) => {
    setBuscaPaciente(opcao.label);
    onChange('pacienteId', opcao.value);
    setListaAberta(false);
  };

  const resultadosDentistas = useMemo(
    () =>
      opcoesDentistas.filter((opcao) =>
        normalizar(opcao.label).includes(normalizar((textoDentista || '').trim())),
      ),
    [opcoesDentistas, textoDentista],
  );

  const selecionarDentista = (opcao) => {
    setBuscaDentista(opcao.label);
    onChange('dentistaId', opcao.value);
    onChange('dentista', opcao.nome);
    setListaDentistasAberta(false);
  };

  const valorEspecialidade = useMemo(() => {
    if (valores.especialidadeId) return String(valores.especialidadeId);
    if (valores.especialidade && especialidades?.length) {
      const encontrada = especialidades.find(
        (e) => e.nome === valores.especialidade || String(e.id) === String(valores.especialidade),
      );
      if (encontrada) return String(encontrada.id);
    }
    return '';
  }, [valores.especialidadeId, valores.especialidade, especialidades]);

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
              disabled={bloqueado('paciente')}
              placeholder="Selecione ou busque o paciente"
              value={textoPaciente}
              onChange={(evento) => {
                setBuscaPaciente(evento.target.value);
                onChange('pacienteId', '');
                setListaAberta(true);
              }}
              onFocus={() => !bloqueado('paciente') && setListaAberta(true)}
              onBlur={() => setListaAberta(false)}
              onKeyDown={(evento) => {
                if (evento.key === 'Escape') setListaAberta(false);
                if (
                  evento.key === 'Enter' &&
                  listaAberta &&
                  resultados.length > 0
                ) {
                  evento.preventDefault();
                  selecionarPaciente(resultados[0]);
                }
              }}
            />

            {!bloqueado('paciente') && listaAberta && resultados.length > 0 && (
              <ul className={styles.listaSuspensa} id="lista-pacientes" role="listbox">
                {resultados.map((opcao) => (
                  <li
                    className={styles.itemOpcao}
                    key={opcao.value}
                    role="option"
                    aria-selected={String(valores.pacienteId) === String(opcao.value)}
                  >
                    <button
                      type="button"
                      onMouseDown={(evento) => evento.preventDefault()}
                      onClick={() => selecionarPaciente(opcao)}
                    >
                      {opcao.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {onNovoPaciente && !bloqueado('paciente') && (
            <button
              className={styles.botaoNovoPaciente}
              type="button"
              onClick={onNovoPaciente}
              title="Cadastrar novo paciente"
              aria-label="Cadastrar novo paciente"
            >
              <IconeNovaPessoa />
            </button>
          )}
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
            disabled={bloqueado('dentista')}
            placeholder="Selecione ou busque o dentista"
            value={textoDentista}
            onChange={(evento) => {
              setBuscaDentista(evento.target.value);
              onChange('dentistaId', '');
              onChange('dentista', '');
              setListaDentistasAberta(true);
            }}
            onFocus={() => !bloqueado('dentista') && setListaDentistasAberta(true)}
            onBlur={() => setListaDentistasAberta(false)}
            onKeyDown={(evento) => {
              if (evento.key === 'Escape') setListaDentistasAberta(false);
              if (
                evento.key === 'Enter' &&
                listaDentistasAberta &&
                resultadosDentistas.length > 0
              ) {
                evento.preventDefault();
                selecionarDentista(resultadosDentistas[0]);
              }
            }}
          />

          {!bloqueado('dentista') && listaDentistasAberta && resultadosDentistas.length > 0 && (
            <ul className={styles.listaSuspensa} id="lista-dentistas" role="listbox">
              {resultadosDentistas.map((opcao) => (
                <li
                  className={styles.itemOpcao}
                  key={opcao.value}
                  role="option"
                  aria-selected={String(valores.dentistaId) === String(opcao.value)}
                >
                  <button
                    type="button"
                    onMouseDown={(evento) => evento.preventDefault()}
                    onClick={() => selecionarDentista(opcao)}
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
            disabled={bloqueado('especialidade')}
            value={valorEspecialidade}
            onChange={(evento) => {
              const idSel = evento.target.value;
              const esp = especialidades.find((e) => String(e.id) === String(idSel));
              onChange('especialidadeId', idSel);
              onChange('especialidade', esp?.nome ?? '');
            }}
          >
            <option value="">Selecione</option>
            {especialidades.map((opcao) => (
              <option key={opcao.id} value={String(opcao.id)}>
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
          disabled={bloqueado('observacoes')}
          value={valores.observacoes}
          onChange={(evento) => onChange('observacoes', evento.target.value)}
        />
      </div>
    </section>
  );
}

export default FormularioAgendamento;
