import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBloqueios } from '../../context/BloqueiosContexto';
import { useConsultas } from '../../context/ConsultasContexto';
import { useHorariosDisponiveis } from '../../hooks/useHorariosDisponiveis';
import { useDentistasOpcoes } from '../../hooks/useDentistasOpcoes';
import { hojeISO } from '../../utils/datas';
import { podeCriarAgendamento } from '../../utils/sessao';
import { Button } from '../../components/Button';
import FormularioAgendamento from '../../components/agendamento/FormularioAgendamento';
import CalendarioAgendamento from '../../components/agendamento/CalendarioAgendamento';
import HorariosDisponiveis from '../../components/agendamento/HorariosDisponiveis';
import OdontogramaTratamentos, {
  MAPA_TIPO_DENTES,
} from '../../components/agendamento/OdontogramaTratamentos';
import styles from './styles.module.css';

export default function NovoAgendamentoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { criar } = useConsultas();
  const { isDataBloqueada } = useBloqueios();
  const { dentistas } = useDentistasOpcoes();

  useEffect(() => {
    if (!podeCriarAgendamento()) {
      navigate('/agenda', { replace: true });
    }
  }, [navigate]);

  const [valores, setValores] = useState(() => ({
    pacienteId: location.state?.pacienteId ? String(location.state.pacienteId) : '',
    pacienteNome: location.state?.novoPaciente ?? '',
    dentistaId: location.state?.dentistaId ? String(location.state.dentistaId) : '',
    dentista: location.state?.dentista ?? '',
    especialidadeId: location.state?.especialidadeId ? String(location.state.especialidadeId) : '',
    especialidade: location.state?.especialidade ?? '',
    observacoes: '',
  }));

  const dentistaIdResolvido =
    valores.dentistaId ||
    (valores.dentista
      ? String(dentistas.find((d) => d.nome === valores.dentista)?.id ?? '')
      : '');

  const dentistaNomeResolvido =
    valores.dentista ||
    dentistas.find((d) => String(d.id) === String(dentistaIdResolvido))?.nome ||
    '';

  const [dataSelecionada, setDataSelecionada] = useState(hojeISO());
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [duracao, setDuracao] = useState('30');
  const [dentesSelecionados, setDentesSelecionados] = useState([]);
  const [dentesDoTipo, setDentesDoTipo] = useState([]);
  const [tipoDente, setTipoDente] = useState('');
  const [pularOdontograma, setPularOdontograma] = useState(false);
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { horarios, carregando: carregandoHorarios, recarregar: recarregarHorarios } =
    useHorariosDisponiveis({
      idUsuario: dentistaIdResolvido,
      dentistaNome: dentistaNomeResolvido,
      data: dataSelecionada,
      duracao: Number(duracao),
    });

  const horarioAtivo = horarios.some((h) => h.inicio === horarioSelecionado)
    ? horarioSelecionado
    : '';

  const diaBloqueado = (iso) =>
    Boolean(dentistaNomeResolvido) &&
    isDataBloqueada(dentistaNomeResolvido, iso, 'dia_todo');

  const alterarValor = (campo, valor) => {
    setValores((atual) => ({ ...atual, [campo]: valor }));
    if (campo === 'dentistaId') {
      setHorarioSelecionado('');
    }
  };

  const abrirNovoPaciente = () => navigate('/pacientes/novo');

  const alternarDente = (numero) =>
    setDentesSelecionados((atual) =>
      atual.includes(numero)
        ? atual.filter((dente) => dente !== numero)
        : [...atual, numero].sort((a, b) => a - b),
    );

  const aoEscolherTipoDente = (tipo) => {
    setTipoDente(tipo);

    setDentesSelecionados((atual) => {
      const semGrupoAnterior = atual.filter(
        (dente) => !dentesDoTipo.includes(dente),
      );
      const grupoNovo = MAPA_TIPO_DENTES[tipo] ?? [];
      return [...new Set([...semGrupoAnterior, ...grupoNovo])].sort(
        (a, b) => a - b,
      );
    });

    setDentesDoTipo(MAPA_TIPO_DENTES[tipo] ?? []);
  };

  const aoAlternarPular = (marcado) => {
    setPularOdontograma(marcado);
    if (marcado) {
      setDentesSelecionados([]);
      setDentesDoTipo([]);
      setTipoDente('');
    }
  };

  const aoMudarDuracao = (novaDuracao) => {
    setDuracao(novaDuracao);
    setHorarioSelecionado('');
  };

  const aoSelecionarData = (iso) => {
    setDataSelecionada(iso);
    setHorarioSelecionado('');
  };

  const aoSelecionarHorario = (horario) => {
    setHorarioSelecionado(horario);
    setAviso('');
  };

  const confirmar = async () => {
    const pendencias = [];
    if (!valores.pacienteId) pendencias.push('paciente');
    if (!dentistaIdResolvido) pendencias.push('dentista');
    if (!valores.especialidadeId) pendencias.push('especialidade');
    if (!horarioAtivo) pendencias.push('horário de início');

    if (pendencias.length > 0) {
      setAviso(`Selecione: ${pendencias.join(', ')}.`);
      return;
    }

    const slotEscolhido = horarios.find((h) => h.inicio === horarioAtivo);
    if (!slotEscolhido) {
      setAviso('O horário selecionado não está mais disponível. Escolha outro horário.');
      recarregarHorarios();
      return;
    }

    setEnviando(true);
    setAviso('');

    try {
      await criar({
        idCliente: Number(valores.pacienteId),
        idUsuario: Number(dentistaIdResolvido),
        idEspecialidade: Number(valores.especialidadeId),
        data: dataSelecionada,
        horarioInicio: slotEscolhido.inicio,
        horarioFim: slotEscolhido.fim,
        observacoes: valores.observacoes,
        pularOdontograma,
        dentes: pularOdontograma ? [] : dentesSelecionados,
        tipoDente: pularOdontograma ? null : (tipoDente || null),
      });

      navigate('/agenda');
    } catch (error) {
      setAviso(error?.message || 'Não foi possível cadastrar a consulta.');
      if (error?.status === 409) {
        setHorarioSelecionado('');
        recarregarHorarios();
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <header className={styles.barraSuperior}>
        <div className={styles.conteudoBarra}>
          <h1>Agendamento de Consulta</h1>
        </div>
      </header>

      <main className={styles.pagina}>
        <div className={styles.topoPagina}>
          <h2>Novo Agendamento</h2>
          <Button type="button" onClick={confirmar} disabled={enviando}>
            {enviando ? 'Salvando...' : 'Confirmar Agendamento'}
          </Button>
        </div>

        {aviso && <p className={styles.aviso} role="alert">{aviso}</p>}

        <div className={styles.gradeColunas}>
          <FormularioAgendamento
            valores={{ ...valores, dentistaId: dentistaIdResolvido }}
            onChange={alterarValor}
            onNovoPaciente={abrirNovoPaciente}
          />

          <CalendarioAgendamento
            dataSelecionada={dataSelecionada}
            onSelect={aoSelecionarData}
            isDiaBloqueado={diaBloqueado}
          />

          <HorariosDisponiveis
            duracao={duracao}
            onDuracaoChange={aoMudarDuracao}
            horarioSelecionado={horarioAtivo}
            onSelectHorario={aoSelecionarHorario}
            horarios={horarios}
            carregando={carregandoHorarios}
            dentistaSelecionado={Boolean(dentistaIdResolvido)}
            diaBloqueado={diaBloqueado(dataSelecionada)}
          />
        </div>

        <OdontogramaTratamentos
          dentesSelecionados={dentesSelecionados}
          onToggleDente={alternarDente}
          tipoDente={tipoDente}
          onTipoDenteChange={aoEscolherTipoDente}
          pular={pularOdontograma}
          onPularChange={aoAlternarPular}
        />
      </main>
    </>
  );
}
