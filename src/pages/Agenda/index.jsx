import { useState } from 'react';
import FiltrosSidebar from '../../components/agenda/FiltrosSidebar';
import CalendarioSelecao from '../../components/agenda/CalendarioSelecao';
import CalendarioGradePrincipal from '../../components/agenda/CalendarioGradePrincipal';
import ListaConsultasDia from '../../components/agenda/ListaConsultasDia';
import * as S from './styles';

export default function AgendaPage() {
  const [filtros, setFiltros] = useState({
    especialidade: '',
    dentista: '',
    paciente: '',
  });
  const [diasSelecionados, setDiasSelecionados] = useState([
    27, 28, 29, 30, 31,
  ]);

  const handleChangeFiltro = (campo, valor) =>
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));

  const handleToggleDia = (dia) =>
    setDiasSelecionados((anterior) =>
      anterior.includes(dia)
        ? anterior.filter((d) => d !== dia)
        : [...anterior, dia].sort((a, b) => a - b),
    );

  return (
    <S.Pagina>
      <S.Titulo>Agenda</S.Titulo>

      <S.Grade>
        <S.ColunaLateral>
          <FiltrosSidebar
            filtros={filtros}
            onChangeFiltro={handleChangeFiltro}
            onNovoAgendamento={() => {}}
          />
          <CalendarioSelecao
            diasSelecionados={diasSelecionados}
            onToggleDia={handleToggleDia}
          />
        </S.ColunaLateral>

        <S.ColunaPrincipal>
          <CalendarioGradePrincipal diasSelecionados={diasSelecionados} />
          <ListaConsultasDia />
        </S.ColunaPrincipal>
      </S.Grade>
    </S.Pagina>
  );
}
