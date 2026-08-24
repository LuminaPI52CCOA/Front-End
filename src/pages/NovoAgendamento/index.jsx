import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultas } from '../../context/ConsultasContexto';
import { hojeISO } from '../../utils/datas';
import FormularioAgendamento from '../../components/agendamento/FormularioAgendamento';
import CalendarioAgendamento from '../../components/agendamento/CalendarioAgendamento';
import HorariosDisponiveis from '../../components/agendamento/HorariosDisponiveis';
import OdontogramaTratamentos, {
  MAPA_TIPO_DENTES,
} from '../../components/agendamento/OdontogramaTratamentos';
import * as S from './styles';

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

export default function NovoAgendamentoPage() {
  const navigate = useNavigate();
  const { adicionarConsulta, consultas } = useConsultas();

  const [valores, setValores] = useState({
    paciente: '',
    dentista: '',
    especialidade: '',
    observacoes: '',
  });
  const [dataSelecionada, setDataSelecionada] = useState(hojeISO());
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [duracao, setDuracao] = useState('15');
  const [dentesSelecionados, setDentesSelecionados] = useState([]);
  const [dentesDoTipo, setDentesDoTipo] = useState([]);
  const [tipoDente, setTipoDente] = useState('');
  const [pularOdontograma, setPularOdontograma] = useState(false);
  const [aviso, setAviso] = useState('');

  const alterarValor = (campo, valor) =>
    setValores((atual) => ({ ...atual, [campo]: valor }));

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

  const consultasDoDentista = consultas.filter(
    (consulta) =>
      consulta.data === dataSelecionada &&
      valores.dentista !== '' &&
      consulta.dentista === valores.dentista,
  );

  const conflita = (inicioHHMM, minutosDuracao) => {
    const inicioCandidato = paraMinutos(inicioHHMM);
    const fimCandidato = inicioCandidato + minutosDuracao;
    return consultasDoDentista.some((consulta) => {
      const inicioExistente = paraMinutos(consulta.inicio);
      const fimExistente = paraMinutos(consulta.fim);
      return inicioCandidato < fimExistente && inicioExistente < fimCandidato;
    });
  };

  const estaOcupado = (horario) =>
    valores.dentista !== '' && conflita(horario, Number(duracao));

  const aoMudarDuracao = (novaDuracao) => {
    const novoPasso = Number(novaDuracao);
    setDuracao(novaDuracao);

    if (!horarioSelecionado) return;

    const alinhado =
      Math.floor(paraMinutos(horarioSelecionado) / novoPasso) * novoPasso;

    if (
      alinhado >= INICIO_JORNADA &&
      alinhado <= FIM_JORNADA &&
      !conflita(paraHHMM(alinhado), novoPasso)
    ) {
      setHorarioSelecionado(paraHHMM(alinhado));
    } else {
      setHorarioSelecionado('');
    }
  };

  const aoSelecionarHorario = (horario) => {
    if (estaOcupado(horario)) return;
    setHorarioSelecionado(horario);
    setAviso('');
  };

  const confirmar = () => {
    const pendencias = [];
    if (!valores.paciente) pendencias.push('paciente');
    if (!valores.dentista) pendencias.push('dentista');
    if (!valores.especialidade) pendencias.push('especialidade');
    if (!horarioSelecionado) pendencias.push('horário de início');

    if (pendencias.length > 0) {
      setAviso(`Selecione: ${pendencias.join(', ')}.`);
      return;
    }

    if (conflita(horarioSelecionado, Number(duracao))) {
      setAviso(
        'Este horário conflita com outra consulta deste dentista. Escolha outro.',
      );
      return;
    }

    adicionarConsulta({
      data: dataSelecionada,
      inicio: horarioSelecionado,
      fim: paraHHMM(paraMinutos(horarioSelecionado) + Number(duracao)),
      paciente: valores.paciente,
      dentista: valores.dentista,
      especialidade: valores.especialidade,
      status: 'Confirmado',
      telefone: '',
      procedimento: '',
      observacoes: valores.observacoes,
      dentes: dentesSelecionados,
      tipoDente,
      pularOdontograma,
    });

    navigate('/agenda');
  };

  return (
    <>
      <S.BarraSuperior>
        <S.ConteudoBarra>
          <h1>Agendamento de Consulta</h1>
        </S.ConteudoBarra>
      </S.BarraSuperior>

      <S.Pagina>
        <S.TopoPagina>
          <h2>Novo Agendamento</h2>
          <S.BotaoConfirmar type="button" onClick={confirmar}>
            Confirmar Agendamento
          </S.BotaoConfirmar>
        </S.TopoPagina>

        {aviso && <S.Aviso role="alert">{aviso}</S.Aviso>}

        <S.GradeColunas>
          <FormularioAgendamento valores={valores} onChange={alterarValor} />

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
          />
        </S.GradeColunas>

        <OdontogramaTratamentos
          dentesSelecionados={dentesSelecionados}
          onToggleDente={alternarDente}
          tipoDente={tipoDente}
          onTipoDenteChange={aoEscolherTipoDente}
          pular={pularOdontograma}
          onPularChange={setPularOdontograma}
        />
      </S.Pagina>
    </>
  );
}
