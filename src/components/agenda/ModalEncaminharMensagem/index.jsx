import { useEffect, useRef, useState } from 'react';
import { deISO } from '../../../utils/datas';
import { formatarTelefone } from '../../../utils/formatar';
import styles from './styles.module.css';

function IconeConversa() {
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
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.9L3 21l2-4.9a8.4 8.4 0 0 1-1-4.1 8.4 8.4 0 0 1 8.5-8.4A8.4 8.4 0 0 1 21 11.5z" />
    </svg>
  );
}

function IconeConfirmado() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12 11 15 16 9" />
    </svg>
  );
}

const formatarDataMensagem = (iso) => deISO(iso).toLocaleDateString('pt-BR');

export function ModalEncaminharMensagem({ consulta, dataAmanha, onFechar }) {
  const refBotaoFechar = useRef(null);
  const timerRef = useRef(null);
  const nome = consulta.pacienteNome || 'Paciente';
  const dentista = consulta.dentista || 'nossa equipe';
  const [mensagem, setMensagem] = useState(
    `Olá, ${nome}! Lembramos que você tem uma consulta agendada para amanhã, ${formatarDataMensagem(
      dataAmanha,
    )}, às ${consulta.inicio}, com ${dentista}. Por favor, confirme sua presença. — Lumina Odontologia`,
  );
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    refBotaoFechar.current?.focus();
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const aoTeclar = (evento) => {
      if (evento.key === 'Escape') onFechar();
    };

    window.addEventListener('keydown', aoTeclar);

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [onFechar]);

  const enviar = () => {
    if (!mensagem.trim() || enviando) return;

    setEnviando(true);
    timerRef.current = setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
    }, 900);
  };

  return (
    <div
      className={styles.overlay}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onFechar();
      }}
    >
      <div
        className={styles.dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-mensagem-paciente"
      >
        <div className={styles.topo}>
          <div className={styles.titulos}>
            <div className={styles.iconeTitulo}>
              <IconeConversa />
            </div>
            <div>
              <h3 id="titulo-mensagem-paciente">Encaminhar mensagem</h3>
              <p>Lembrete de consulta para o paciente</p>
            </div>
          </div>

          <button
            ref={refBotaoFechar}
            className={styles.botaoFechar}
            type="button"
            aria-label="Fechar encaminhamento de mensagem"
            onClick={onFechar}
          >
            ✕
          </button>
        </div>

        {enviado ? (
          <div className={styles.sucesso} role="status" aria-live="polite">
            <span className={styles.sucessoIcone}>
              <IconeConfirmado />
            </span>
            <h4>Mensagem enviada</h4>
            <p>
              O lembrete foi encaminhado para {nome}
              {consulta.telefone
                ? ` no número ${formatarTelefone(consulta.telefone)}`
                : ''}
              .
            </p>
            <button
              className={styles.botaoPrimario}
              type="button"
              onClick={onFechar}
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className={styles.infoPaciente}>
              <div>
                <span className={styles.rotuloInfo}>Paciente</span>
                <strong>{nome}</strong>
              </div>
              <div>
                <span className={styles.rotuloInfo}>Horário</span>
                <strong>{consulta.inicio}</strong>
              </div>
              <div>
                <span className={styles.rotuloInfo}>Telefone</span>
                <strong>
                  {consulta.telefone
                    ? formatarTelefone(consulta.telefone)
                    : 'Não informado'}
                </strong>
              </div>
            </div>

            <label className={styles.rotuloMensagem} htmlFor="mensagem-paciente">
              Mensagem
            </label>
            <textarea
              id="mensagem-paciente"
              className={styles.campoMensagem}
              value={mensagem}
              rows={6}
              onChange={(evento) => setMensagem(evento.target.value)}
            />

            <p className={styles.avisoSimulacao}>
              Envio simulado — nenhuma mensagem real será disparada.
            </p>

            <div className={styles.rodape}>
              <button
                className={styles.botaoSecundario}
                type="button"
                disabled={enviando}
                onClick={onFechar}
              >
                Cancelar
              </button>
              <button
                className={styles.botaoPrimario}
                type="button"
                disabled={enviando || !mensagem.trim()}
                onClick={enviar}
              >
                {enviando ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ModalEncaminharMensagem;
