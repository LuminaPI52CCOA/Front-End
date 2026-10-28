import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalEncaminharMensagem from '../../components/agenda/ModalEncaminharMensagem';
import { useConsultasAmanha } from '../../hooks/useConsultasAmanha';
import { deISO } from '../../utils/datas';
import styles from './styles.module.css';

function IconeVoltar() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconeCalendario() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconeDentista() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconeConversa() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.9L3 21l2-4.9a8.4 8.4 0 0 1-1-4.1 8.4 8.4 0 0 1 8.5-8.4A8.4 8.4 0 0 1 21 11.5z" />
    </svg>
  );
}

function IconeVazio() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

const formatarDataLonga = (iso) => {
  const texto = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(deISO(iso));

  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const classeStatus = (status) => {
  if (status === 'Confirmado') return styles.statusConfirmado;
  if (status === 'Finalizada') return styles.statusFinalizada;
  if (status === 'Cancelado') return styles.statusCancelado;
  return styles.statusPendente;
};

export default function ConsultasAmanhaPage() {
  const navigate = useNavigate();
  const { dataAmanha, consultasAmanha, carregando } = useConsultasAmanha();
  const [consultaMensagem, setConsultaMensagem] = useState(null);
  const fecharMensagem = useCallback(() => setConsultaMensagem(null), []);

  return (
    <div className={styles.page}>
      <button
        className={styles.voltar}
        type="button"
        onClick={() => navigate('/agenda')}
      >
        <IconeVoltar />
        Voltar para agenda
      </button>

      <div className={styles.cabecalho}>
        <div className={styles.titulos}>
          <div className={styles.iconeTitulo}>
            <IconeCalendario />
          </div>
          <div>
            <h1 className={styles.pageTitle}>Consultas de Amanhã</h1>
            <p className={styles.subtitulo}>{formatarDataLonga(dataAmanha)}</p>
          </div>
        </div>

        <span className={styles.contador}>
          {consultasAmanha.length} consulta
          {consultasAmanha.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className={styles.container}>
        {carregando ? (
          <p className={styles.estado}>Carregando consultas...</p>
        ) : consultasAmanha.length === 0 ? (
          <div className={styles.vazio}>
            <span className={styles.vazioIcone}>
              <IconeVazio />
            </span>
            <h2>Nenhuma consulta para amanhã</h2>
            <p>A agenda do dia seguinte está livre no momento.</p>
            <button
              className={styles.botaoVoltar}
              type="button"
              onClick={() => navigate('/agenda')}
            >
              Voltar para a agenda
            </button>
          </div>
        ) : (
          <div className={styles.grade}>
            {consultasAmanha.map((consulta) => (
              <article className={styles.card} key={consulta.id}>
                <div className={styles.cardTopo}>
                  <span className={styles.horario}>{consulta.inicio}</span>
                  <span
                    className={`${styles.status} ${classeStatus(
                      consulta.status,
                    )}`}
                  >
                    {consulta.status}
                  </span>
                </div>

                <div className={styles.paciente}>
                  <h2>{consulta.pacienteNome || 'Paciente'}</h2>
                  <span className={styles.especialidade}>
                    {consulta.especialidade || 'Consulta de Rotina'}
                  </span>
                </div>

                <p className={styles.dentista}>
                  <IconeDentista />
                  {consulta.dentista || 'Dentista não informado'}
                </p>

                <hr className={styles.divisor} />

                <button
                  className={styles.botaoMensagem}
                  type="button"
                  onClick={() => setConsultaMensagem(consulta)}
                >
                  <IconeConversa />
                  Encaminhar Mensagem
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {consultaMensagem && (
        <ModalEncaminharMensagem
          key={consultaMensagem.id}
          consulta={consultaMensagem}
          dataAmanha={dataAmanha}
          onFechar={fecharMensagem}
        />
      )}
    </div>
  );
}
