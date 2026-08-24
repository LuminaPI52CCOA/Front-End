import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultas } from '../../context/ConsultasContexto';
import { hojeISO } from '../../utils/datas';
import FormularioAgendamento from '../../components/agendamento/FormularioAgendamento';
import CalendarioAgendamento from '../../components/agendamento/CalendarioAgendamento';
import HorariosDisponiveis from '../../components/agendamento/HorariosDisponiveis';
import * as S from './styles';

const somarMinutos = (hhmm, minutos) => {
  const [hora, resto] = hhmm.split(':').map(Number);
  const total = hora * 60 + resto + minutos;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(
    total % 60,
  ).padStart(2, '0')}`;
};

export default function NovoAgendamentoPage() {
  const navigate = useNavigate();
  const { adicionarConsulta } = useConsultas();

  const [valores, setValores] = useState({
    paciente: '',
    dentista: '',
    especialidade: '',
    observacoes: '',
  });
  const [dataSelecionada, setDataSelecionada] = useState(hojeISO());
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [duracao, setDuracao] = useState('15');
  const [aviso, setAviso] = useState('');

  const alterarValor = (campo, valor) =>
    setValores((atual) => ({ ...atual, [campo]: valor }));

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

    adicionarConsulta({
      data: dataSelecionada,
      inicio: horarioSelecionado,
      fim: somarMinutos(horarioSelecionado, Number(duracao)),
      paciente: valores.paciente,
      dentista: valores.dentista,
      especialidade: valores.especialidade,
      status: 'Confirmado',
      telefone: '',
      procedimento: '',
      observacoes: valores.observacoes,
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
            onDuracaoChange={setDuracao}
            horarioSelecionado={horarioSelecionado}
            onSelectHorario={(horario) => {
              setHorarioSelecionado(horario);
              setAviso('');
            }}
          />
        </S.GradeColunas>
      </S.Pagina>
    </>
  );
}
