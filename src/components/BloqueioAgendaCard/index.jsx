import { useState, useCallback } from 'react';
import { useBloqueios } from '../../context/BloqueiosContexto';
import { useConsultas } from '../../context/ConsultasContexto';
import { FormSelect } from '../PatientRegistration/FormSelect/FormSelect';
import { FormInput } from '../PatientRegistration/FormInput/FormInput';
import { Button } from '../Button';
import { hojeISO, deISO } from '../../utils/datas';
import { Trash2, Calendar } from 'lucide-react';
import styles from './styles.module.css';

const TIPOS_BLOQUEIO = [
  { value: 'dia_especifico', label: 'Dia Específico' },
  { value: 'periodo_semana', label: 'Período / Semana' },
];

const TURNOS = [
  { value: 'manha', label: 'Manhã (08:00 - 12:00)' },
  { value: 'tarde', label: 'Tarde (13:00 - 18:00)' },
  { value: 'dia_todo', label: 'Dia Todo (08:00 - 18:00)' },
];

const consultaPertenceAoTurno = (consulta, turnoBloqueio) => {
  if (turnoBloqueio === 'dia_todo') return true;
  const hora = Number(String(consulta.inicio || '').slice(0, 2));
  return turnoBloqueio === 'manha' ? hora < 13 : hora >= 13;
};

export function BloqueioAgendaCard({ dentista }) {
  const { adicionarBloqueio, removerBloqueio, obterBloqueiosPorDentista } = useBloqueios();
  const { consultas, cancelar } = useConsultas();

  const [tipoBloqueio, setTipoBloqueio] = useState('dia_especifico');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [turno, setTurno] = useState('dia_todo');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const bloqueiosDentista = obterBloqueiosPorDentista(dentista?.nome || '');

  const formatarDataExibicao = (iso) => {
    const data = deISO(iso);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatarTurnoExibicao = (turnoValor) => {
    const t = TURNOS.find((op) => op.value === turnoValor);
    return t?.label || turnoValor;
  };

  const validarFormulario = useCallback(() => {
    if (!dataInicio) {
      setErro('Selecione uma data inicial');
      return false;
    }
    
    if (tipoBloqueio === 'periodo_semana' && !dataFim) {
      setErro('Selecione uma data final para o período');
      return false;
    }
    
    if (tipoBloqueio === 'periodo_semana' && dataFim < dataInicio) {
      setErro('A data final deve ser posterior à data inicial');
      return false;
    }
    
    if (!turno) {
      setErro('Selecione um turno');
      return false;
    }
    
    setErro('');
    return true;
  }, [dataInicio, dataFim, tipoBloqueio, turno]);

  const obterConsultasAfetadas = () => {
    const nome = dentista?.nome || '';
    if (!nome) return [];

    const inicio = dataInicio;
    const fim = tipoBloqueio === 'periodo_semana' ? dataFim : dataInicio;

    return consultas.filter((consulta) => {
      const mesmoDentista =
        consulta.dentista === nome || consulta.dentistaNome === nome;
      const statusAtivo =
        consulta.statusApi === 'AGENDADA' || consulta.statusApi === 'CONFIRMADA';

      return (
        mesmoDentista &&
        statusAtivo &&
        consulta.data >= inicio &&
        consulta.data <= fim &&
        consultaPertenceAoTurno(consulta, turno)
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (enviando || !validarFormulario()) return;

    const consultasAfetadas = obterConsultasAfetadas();

    if (consultasAfetadas.length > 0) {
      const confirmou = window.confirm(
        `Este bloqueio cancela ${consultasAfetadas.length} consulta(s) agendada(s). Deseja continuar?`,
      );
      if (!confirmou) return;
    }

    setEnviando(true);

    adicionarBloqueio({
      dentista: dentista?.nome || '',
      dentistaId: dentista?.id ?? null,
      tipo: tipoBloqueio,
      dataInicio,
      dataFim: tipoBloqueio === 'periodo_semana' ? dataFim : dataInicio,
      turno,
    });

    const resultados = await Promise.allSettled(
      consultasAfetadas.map((consulta) => cancelar(consulta.id)),
    );
    const canceladas = resultados.filter(
      (resultado) => resultado.status === 'fulfilled',
    ).length;
    const falhas = resultados.length - canceladas;

    if (falhas > 0) {
      setErro(
        `Bloqueio salvo, mas ${falhas} consulta(s) não puderam ser canceladas.`,
      );
      setSucesso('');
    } else {
      setErro('');
      setSucesso(
        canceladas > 0
          ? `Bloqueio registrado e ${canceladas} consulta(s) cancelada(s).`
          : 'Bloqueio registrado com sucesso!',
      );
      setTimeout(() => setSucesso(''), 3000);
    }

    setDataInicio('');
    setDataFim('');
    setTurno('dia_todo');
    setTipoBloqueio('dia_especifico');
    setEnviando(false);
  };

  const handleRemover = (id) => {
    if (window.confirm('Tem certeza que deseja remover este bloqueio?')) {
      removerBloqueio(id);
    }
  };

  const hoje = hojeISO();
  const minData = hoje;

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <div className={styles.titleArea}>
          <span className={styles.cardIcon} aria-hidden="true">
            <Calendar size={18} />
          </span>
          <h3 className={styles.cardTitle}>Bloquear Agenda</h3>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.formRow}>
          <div className={styles.fieldGroup}>
            <FormSelect
              label="Tipo de Bloqueio"
              options={TIPOS_BLOQUEIO}
              value={tipoBloqueio}
              onChange={(e) => setTipoBloqueio(e.target.value)}
              placeholder="Selecione"
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <FormSelect
              label="Turno"
              options={TURNOS}
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              placeholder="Selecione"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.fieldGroup}>
            <FormInput
              label="Data Inicial"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              min={minData}
              required
            />
          </div>
          
          {tipoBloqueio === 'periodo_semana' && (
            <div className={styles.fieldGroup}>
              <FormInput
                label="Data Final"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                min={dataInicio || minData}
                required
              />
            </div>
          )}
        </div>

        {erro && (
          <div className={styles.errorAlert} role="alert">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className={styles.successAlert} role="status">
            {sucesso}
          </div>
        )}

        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="primary"
            className={styles.submitButton}
            disabled={enviando}
          >
            {enviando ? 'Bloqueando...' : 'Desabilitar Horários'}
          </Button>
        </div>
      </form>

      <div className={styles.divider} />

      <div className={styles.listSection}>
        <h4 className={styles.listTitle}>Bloqueios Ativos</h4>
        
        {bloqueiosDentista.length === 0 ? (
          <p className={styles.emptyState}>
            Nenhum bloqueio cadastrado para este dentista.
          </p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table} role="table">
              <thead>
                <tr>
                  <th scope="col">Data / Período</th>
                  <th scope="col">Turno</th>
                  <th scope="col">Ação</th>
                </tr>
              </thead>
              <tbody>
                {bloqueiosDentista.map((bloqueio) => (
                  <tr key={bloqueio.id}>
                    <td className={styles.tableCell}>
                      {bloqueio.dataInicio === bloqueio.dataFim ? (
                        formatarDataExibicao(bloqueio.dataInicio)
                      ) : (
                        <>
                          {formatarDataExibicao(bloqueio.dataInicio)} 
                          <span className={styles.periodSeparator}> a </span>
                          {formatarDataExibicao(bloqueio.dataFim)}
                        </>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {formatarTurnoExibicao(bloqueio.turno)}
                    </td>
                    <td className={styles.tableCell}>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => handleRemover(bloqueio.id)}
                        aria-label={`Remover bloqueio de ${formatarDataExibicao(bloqueio.dataInicio)}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  );
}

export default BloqueioAgendaCard;