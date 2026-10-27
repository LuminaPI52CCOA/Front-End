import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsultas } from '../../context/ConsultasContexto';
import FiltrosSidebar from '../../components/agenda/FiltrosSidebar';
import CalendarioSelecao from '../../components/agenda/CalendarioSelecao';
import CalendarioGradePrincipal from '../../components/agenda/CalendarioGradePrincipal';
import ListaConsultasDia from '../../components/agenda/ListaConsultasDia';
import { adicionarDias, hojeISO, inicioDaSemanaISO } from '../../utils/datas';
import styles from './styles.module.css';

export default function AgendaPage() {
  const [filtros, setFiltros] = useState({
    especialidade: '',
    dentista: '',
    paciente: '',
  });
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(
    () => location.state?.dataAgendada || hojeISO(),
  );
  const { carregarPeriodo, erro } = useConsultas();

  const inicioSemana = inicioDaSemanaISO(selectedDate);

  // A grade mostra a semana da data selecionada: carrega do servidor a cada troca de semana.
  useEffect(() => {
    carregarPeriodo(inicioSemana, adicionarDias(inicioSemana, 6));
  }, [inicioSemana, carregarPeriodo]);

  const handleChangeFiltro = (campo, valor) =>
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));

  return (
    <>
      <header className={styles.barraSuperior}>
        <div className={styles.conteudoBarra}>
          <h1 className={styles.titulo}>Agenda</h1>
        </div>
      </header>

      <main className={styles.pagina}>
        {erro && (
          <p className={styles.aviso} role="alert">
            Não foi possível carregar a agenda: {erro}
          </p>
        )}
        <div className={styles.grade}>
          <div className={styles.colunaLateral}>
            <FiltrosSidebar
              filtros={filtros}
              onChangeFiltro={handleChangeFiltro}
            />
            <CalendarioSelecao
              selectedDate={selectedDate}
              onSelectData={setSelectedDate}
            />
          </div>

          <div className={styles.colunaPrincipal}>
            <CalendarioGradePrincipal
              selectedDate={selectedDate}
              filtros={filtros}
            />
            <ListaConsultasDia
              selectedDate={selectedDate}
              filtros={filtros}
            />
          </div>
        </div>
      </main>
    </>
  );
}
