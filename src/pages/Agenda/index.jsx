import { useState } from 'react';
import FiltrosSidebar from '../../components/agenda/FiltrosSidebar';
import CalendarioSelecao from '../../components/agenda/CalendarioSelecao';
import CalendarioGradePrincipal from '../../components/agenda/CalendarioGradePrincipal';
import ListaConsultasDia from '../../components/agenda/ListaConsultasDia';
import { hojeISO } from '../../utils/datas';
import styles from './styles.module.css';

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
    <>
      <header className={styles.barraSuperior}>
        <div className={styles.conteudoBarra}>
          <h1 className={styles.titulo}>Agenda</h1>
        </div>
      </header>

      <main className={styles.pagina}>
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
