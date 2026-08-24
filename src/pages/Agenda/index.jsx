import { useState } from 'react';
import FiltrosSidebar from '../../components/agenda/FiltrosSidebar';
import CalendarioSelecao from '../../components/agenda/CalendarioSelecao';
import CalendarioGradePrincipal from '../../components/agenda/CalendarioGradePrincipal';
import ListaConsultasDia from '../../components/agenda/ListaConsultasDia';
import { ConsultasProvider } from '../../context/ConsultasContexto';
import { hojeISO } from '../../utils/datas';
import * as S from './styles';

export default function AgendaPage() {
  const [filtros, setFiltros] = useState({
    especialidade: '',
    dentista: '',
    paciente: '',
  });
  const [selectedDate, setSelectedDate] = useState(hojeISO());

  const handleChangeFiltro = (campo, valor) =>
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));

  return (
    <ConsultasProvider>
      <S.BarraSuperior>
        <S.ConteudoBarra>
          <S.Titulo>Agenda</S.Titulo>
        </S.ConteudoBarra>
      </S.BarraSuperior>

      <S.Pagina>
        <S.Grade>
          <S.ColunaLateral>
            <FiltrosSidebar
              filtros={filtros}
              onChangeFiltro={handleChangeFiltro}
              onNovoAgendamento={() => {}}
            />
            <CalendarioSelecao
              selectedDate={selectedDate}
              onSelectData={setSelectedDate}
            />
          </S.ColunaLateral>

          <S.ColunaPrincipal>
            <CalendarioGradePrincipal selectedDate={selectedDate} />
            <ListaConsultasDia selectedDate={selectedDate} />
          </S.ColunaPrincipal>
        </S.Grade>
      </S.Pagina>
    </ConsultasProvider>
  );
}
