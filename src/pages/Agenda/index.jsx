import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import FiltrosSidebar from '../../components/agenda/FiltrosSidebar';
import CalendarioSelecao from '../../components/agenda/CalendarioSelecao';
import CalendarioGradePrincipal from '../../components/agenda/CalendarioGradePrincipal';
import ListaConsultasDia from '../../components/agenda/ListaConsultasDia';
import FaixaDiasMobile from '../../components/agenda/FaixaDiasMobile';
import ModalDetalhesConsultaMobile from '../../components/agenda/ModalDetalhesConsultaMobile';
import PainelMensagensWhatsapp from '../../components/agenda/PainelMensagensWhatsapp';
import { useConsultas } from '../../context/ConsultasContexto';
import { aplicarFiltros } from '../../utils/filtragem';
import { CORES_ESPECIALIDADES, PROCEDIMENTOS } from '../../data/agenda';
import { hojeISO } from '../../utils/datas';
import styles from './styles.module.css';

function classeStatus(status) {
  if (status === 'Finalizada') return styles.statusRealizado;
  if (status === 'Cancelado') return styles.statusCancelado;
  if (status === 'Confirmado') return styles.statusAndamento;
  return styles.statusPendente;
}

export default function AgendaPage() {
  const [filtros, setFiltros] = useState({
    especialidade: '',
    dentista: '',
    paciente: '',
  });
  const [selectedDate, setSelectedDate] = useState(hojeISO());
  const [consultaAberta, setConsultaAberta] = useState(null);
  const { consultas } = useConsultas();

  const handleChangeFiltro = (campo, valor) =>
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));

  const consultasDoDia = useMemo(
    () =>
      aplicarFiltros(consultas, filtros)
        .filter((consulta) => consulta.data === selectedDate)
        .sort((a, b) => a.inicio.localeCompare(b.inicio)),
    [consultas, filtros, selectedDate],
  );

  const totalPacientes = consultasDoDia.length;

  return (
    <>
      <header className={styles.barraSuperior}>
        <div className={styles.conteudoBarra}>
          <h1 className={styles.titulo}>Agenda</h1>
        </div>
      </header>

      <div className={styles.mobileConteudo}>
        <FaixaDiasMobile
          selectedDate={selectedDate}
          onSelectData={setSelectedDate}
        />

        <div className={styles.resumoDia}>
          <span className={styles.resumoIcone}>
            <Users size={18} />
          </span>
          <div className={styles.resumoTextos}>
            <span className={styles.resumoNumero}>{totalPacientes}</span>
            <span className={styles.resumoRotulo}>
              {totalPacientes === 1 ? 'PACIENTE' : 'PACIENTES'}
            </span>
          </div>
        </div>

        <h2 className={styles.mobileSecaoTitulo}>Próximos Atendimentos</h2>

        <div className={styles.mobileLista}>
          {consultasDoDia.length > 0 ? (
            consultasDoDia.map((consulta) => {
              const cor =
                CORES_ESPECIALIDADES[consulta.especialidade]?.ponto ||
                '#8C7A5E';

              return (
                <div
                  key={consulta.id}
                  className={styles.mobileCard}
                  style={{ '--cor-indicador': cor }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Consulta de ${consulta.pacienteNome || 'paciente não identificado'} às ${consulta.inicio}. Ver detalhes`}
                  onClick={() => setConsultaAberta(consulta)}
                  onKeyDown={(evento) => {
                    if (evento.key === 'Enter' || evento.key === ' ') {
                      evento.preventDefault();
                      setConsultaAberta(consulta);
                    }
                  }}
                >
                  <div className={styles.mobileCardTopo}>
                    <span className={styles.mobileCardHorario}>
                      {consulta.inicio} – {consulta.fim}
                    </span>
                    <span
                      className={`${styles.mobileCardStatus} ${classeStatus(consulta.status)}`}
                    >
                      {consulta.status}
                    </span>
                  </div>

                  <span className={styles.mobileCardPaciente}>
                    {consulta.pacienteNome || 'Paciente não identificado'}
                  </span>

                  <span className={styles.mobileCardProcedimento}>
                    {PROCEDIMENTOS[consulta.especialidade] ||
                      consulta.procedimento}
                  </span>

                  <span className={styles.mobileCardDentista}>
                    {consulta.dentista}
                  </span>
                </div>
              );
            })
          ) : (
            <p className={styles.mobileVazio}>
              Nenhuma consulta encontrada para este dia.
            </p>
          )}
        </div>
      </div>

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
          </div>
        </div>

        <div className={styles.secaoInferior}>
          <div className={styles.colunaMeio}>
            <PainelMensagensWhatsapp />
          </div>
          <div className={styles.colunaMeio}>
            <ListaConsultasDia
              selectedDate={selectedDate}
              filtros={filtros}
            />
          </div>
        </div>
      </main>

      {consultaAberta && (
        <ModalDetalhesConsultaMobile
          consulta={consultaAberta}
          onFechar={() => setConsultaAberta(null)}
        />
      )}
    </>
  );
}
