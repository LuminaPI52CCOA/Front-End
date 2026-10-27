import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConsultas } from '../../context/ConsultasContexto';
import { consultaService, paraHorarioApi } from '../../services/consultaService';
import { hojeISO } from '../../utils/datas';
import { Button } from '../../components/Button';
import FormularioAgendamento from '../../components/agendamento/FormularioAgendamento';
import CalendarioAgendamento from '../../components/agendamento/CalendarioAgendamento';
import HorariosDisponiveis from '../../components/agendamento/HorariosDisponiveis';
import OdontogramaTratamentos, {
  MAPA_TIPO_DENTES,
} from '../../components/agendamento/OdontogramaTratamentos';
import styles from './styles.module.css';

const INICIO_JORNADA = 8 * 60;
const FIM_JORNADA = 18 * 60;

const paraMinutos = (hhmm) => {
  const [hora, resto] = hhmm.split(':').map(Number);
  return hora * 60 + resto;
};

const paraHHMM = (minutos) =>
  `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(
    minutos % 60,
  ).padStart(2, '0')}`;

// Paciente recém-cadastrado chega com o ID real; texto solto nunca é aceito como seleção.
const valoresIniciais = (novoPaciente) => {
  const selecionado =
    novoPaciente && typeof novoPaciente === 'object' && novoPaciente.idCliente
      ? { id: novoPaciente.idCliente, nome: novoPaciente.nome }
      : null;
  return {
    paciente: selecionado,
    textoPaciente:
      selecionado?.nome ?? (typeof novoPaciente === 'string' ? novoPaciente : ''),
    dentista: null,
    textoDentista: '',
    idEspecialidade: '',
    observacoes: '',
  };
};

export default function NovoAgendamentoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adicionarConsulta } = useConsultas();

  const [valores, setValores] = useState(() =>
    valoresIniciais(location.state?.novoPaciente),
  );
  const [especialidades, setEspecialidades] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(hojeISO());
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [duracao, setDuracao] = useState('15');
  const [dentesSelecionados, setDentesSelecionados] = useState([]);
  const [dentesDoTipo, setDentesDoTipo] = useState([]);
  const [tipoDente, setTipoDente] = useState('');
  const [pularOdontograma, setPularOdontograma] = useState(false);
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [versaoDisponibilidade, setVersaoDisponibilidade] = useState(0);
  const [disponibilidade, setDisponibilidade] = useState({
    chave: null,
    horarios: null,
    erro: '',
  });

  useEffect(() => {
    let ativo = true;
    consultaService
      .listarEspecialidades()
      .then((lista) => {
        if (ativo) setEspecialidades(lista);
      })
      .catch((erro) => {
        if (ativo) setAviso(`Não foi possível carregar as especialidades: ${erro.message}`);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const idDentista = valores.dentista?.id ?? null;
  const chaveDisponibilidade = idDentista
    ? `${idDentista}|${dataSelecionada}|${duracao}|${versaoDisponibilidade}`
    : null;

  // Cada combinação dentista/data/duração tem sua chave: respostas antigas são
  // abortadas e, se chegarem mesmo assim, não substituem a disponibilidade atual.
  useEffect(() => {
    if (!chaveDisponibilidade) return undefined;
    const controlador = new AbortController();
    consultaService
      .buscarHorariosDisponiveis(
        { idUsuario: idDentista, data: dataSelecionada, duracaoMinutos: Number(duracao) },
        controlador.signal,
      )
      .then((lista) => {
        if (controlador.signal.aborted) return;
        const horarios = new Set(lista.map((item) => item.horarioInicio.slice(0, 5)));
        setDisponibilidade({ chave: chaveDisponibilidade, horarios, erro: '' });
        setHorarioSelecionado((atual) => (atual && !horarios.has(atual) ? '' : atual));
      })
      .catch((erro) => {
        if (erro.name === 'AbortError' || controlador.signal.aborted) return;
        setDisponibilidade({ chave: chaveDisponibilidade, horarios: new Set(), erro: erro.message });
      });
    return () => controlador.abort();
  }, [chaveDisponibilidade, idDentista, dataSelecionada, duracao]);

  const disponibilidadeAtual =
    chaveDisponibilidade && disponibilidade.chave === chaveDisponibilidade
      ? disponibilidade
      : null;
  const carregandoHorarios = Boolean(chaveDisponibilidade) && !disponibilidadeAtual;
  const horariosLivres = disponibilidadeAtual?.horarios ?? null;

  let mensagemHorarios = '';
  if (!idDentista) {
    mensagemHorarios = 'Selecione um dentista para ver os horários disponíveis.';
  } else if (carregandoHorarios) {
    mensagemHorarios = 'Carregando horários disponíveis...';
  } else if (disponibilidadeAtual?.erro) {
    mensagemHorarios = disponibilidadeAtual.erro;
  } else if (horariosLivres?.size === 0) {
    mensagemHorarios = 'Nenhum horário disponível nesta data.';
  }

  const alterarValores = (parcial) => {
    setValores((atual) => ({ ...atual, ...parcial }));
    if ('dentista' in parcial && !parcial.dentista) setHorarioSelecionado('');
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

  const estaOcupado = (horario) => !horariosLivres || !horariosLivres.has(horario);

  const aoMudarDuracao = (novaDuracao) => {
    const novoPasso = Number(novaDuracao);
    setDuracao(novaDuracao);

    if (!horarioSelecionado) return;

    // Mantém o início alinhado à grade da nova duração; a nova disponibilidade
    // carregada em seguida limpa a seleção se ela tiver deixado de ser válida.
    const alinhado =
      INICIO_JORNADA +
      Math.floor((paraMinutos(horarioSelecionado) - INICIO_JORNADA) / novoPasso) * novoPasso;

    setHorarioSelecionado(
      alinhado >= INICIO_JORNADA && alinhado + novoPasso <= FIM_JORNADA
        ? paraHHMM(alinhado)
        : '',
    );
  };

  const aoSelecionarHorario = (horario) => {
    if (estaOcupado(horario)) return;
    setHorarioSelecionado(horario);
    setAviso('');
  };

  const confirmar = async () => {
    if (enviando) return;

    const pendencias = [];
    if (!valores.paciente) pendencias.push('paciente');
    if (!valores.dentista) pendencias.push('dentista');
    if (!valores.idEspecialidade) pendencias.push('especialidade');
    if (!horarioSelecionado) pendencias.push('horário de início');

    if (pendencias.length > 0) {
      setAviso(`Selecione: ${pendencias.join(', ')}.`);
      return;
    }

    if (carregandoHorarios) {
      setAviso('Aguarde o carregamento dos horários disponíveis.');
      return;
    }

    if (!horariosLivres?.has(horarioSelecionado)) {
      setAviso('O horário selecionado não está disponível para este dentista. Escolha outro.');
      return;
    }

    setEnviando(true);
    setAviso('');

    try {
      await adicionarConsulta({
        idCliente: valores.paciente.id,
        idUsuario: valores.dentista.id,
        idEspecialidade: Number(valores.idEspecialidade),
        data: dataSelecionada,
        horarioInicio: paraHorarioApi(horarioSelecionado),
        horarioFim: paraHorarioApi(
          paraHHMM(paraMinutos(horarioSelecionado) + Number(duracao)),
        ),
        observacoes: valores.observacoes.trim() || null,
        dentes: pularOdontograma ? [] : dentesSelecionados,
        tipoDente: pularOdontograma ? null : tipoDente || null,
        pularOdontograma,
      });

      navigate('/agenda', { state: { dataAgendada: dataSelecionada } });
    } catch (erro) {
      setAviso(erro.message);
      if (erro.status === 409) {
        setHorarioSelecionado('');
        setVersaoDisponibilidade((versao) => versao + 1);
      }
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
          <Button
            type="button"
            onClick={confirmar}
            disabled={enviando}
            aria-busy={enviando}
          >
            {enviando ? 'Agendando...' : 'Confirmar Agendamento'}
          </Button>
        </div>

        {aviso && <p className={styles.aviso} role="alert">{aviso}</p>}

        <div className={styles.gradeColunas}>
          <FormularioAgendamento
            valores={valores}
            onChange={alterarValores}
            especialidades={especialidades}
            onNovoPaciente={abrirNovoPaciente}
          />

          <CalendarioAgendamento
            dataSelecionada={dataSelecionada}
            onSelect={(iso) => setDataSelecionada(iso)}
          />

          <HorariosDisponiveis
            duracao={duracao}
            onDuracaoChange={aoMudarDuracao}
            horarioSelecionado={horarioSelecionado}
            onSelectHorario={aoSelecionarHorario}
            estaOcupado={estaOcupado}
            mensagem={mensagemHorarios}
          />
        </div>

        <OdontogramaTratamentos
          dentesSelecionados={dentesSelecionados}
          onToggleDente={alternarDente}
          tipoDente={tipoDente}
          onTipoDenteChange={aoEscolherTipoDente}
          pular={pularOdontograma}
          onPularChange={setPularOdontograma}
        />
      </main>
    </>
  );
}
