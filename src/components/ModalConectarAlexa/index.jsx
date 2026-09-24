import { useCallback, useEffect, useRef, useState } from 'react';
import {
  X,
  Copy,
  Check,
  Clock,
  RefreshCw,
  Mic,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { alexaService } from '../../services/alexaService';
import { Button } from '../Button';
import styles from './styles.module.css';

function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

export function ModalConectarAlexa({ dentist, isOpen, onClose, onConnected }) {
  const dentistId = dentist?.id;
  const dentistNome = dentist?.nome;

  const [pin, setPin] = useState('');
  const [tempoRestante, setTempoRestante] = useState(600);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [conectado, setConectado] = useState(false);

  const tempoRestanteRef = useRef(tempoRestante);
  useEffect(() => {
    tempoRestanteRef.current = tempoRestante;
  }, [tempoRestante]);

  const timerRef = useRef(null);
  const pollingRef = useRef(null);

  const limparTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (pollingRef.current) clearInterval(pollingRef.current);
    timerRef.current = null;
    pollingRef.current = null;
  }, []);

  const gerarNovoPin = async () => {
    limparTimers();
    setCarregando(true);
    setErro(null);
    setCopiado(false);

    try {
      const res = await alexaService.gerarPin(dentistId);
      setPin(res.codigo);
      const minutos = res.expiraEmMinutos || 10;
      setTempoRestante(minutos * 60);
      setConectado(false);
    } catch (err) {
      setErro(err.message || 'Não foi possível gerar o código. Verifique se o servidor está ativo.');
    } finally {
      setCarregando(false);
    }
  };

  // Ao abrir o modal, gera PIN inicial
  useEffect(() => {
    if (!isOpen) {
      limparTimers();
      return undefined;
    }

    let ativo = true;

    const iniciar = async () => {
      try {
        const res = await alexaService.gerarPin(dentistId);
        if (ativo) {
          setPin(res.codigo);
          const minutos = res.expiraEmMinutos || 10;
          setTempoRestante(minutos * 60);
          setConectado(false);
          setCarregando(false);
          setErro(null);
        }
      } catch (err) {
        if (ativo) {
          setErro(err.message || 'Não foi possível gerar o código. Verifique se o servidor está ativo.');
          setCarregando(false);
        }
      }
    };

    iniciar();

    return () => {
      ativo = false;
      limparTimers();
    };
  }, [isOpen, dentistId, limparTimers]);

  // Contagem regressiva de 1 em 1 segundo
  useEffect(() => {
    if (!isOpen || conectado || carregando) return undefined;

    const intervalId = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    timerRef.current = intervalId;

    return () => {
      clearInterval(intervalId);
    };
  }, [isOpen, conectado, carregando]);

  // Smart Polling: Consulta GET /alexa/status a cada 3 segundos
  useEffect(() => {
    if (!isOpen || conectado || !pin) return undefined;

    let cancelado = false;

    const checarStatus = async () => {
      if (tempoRestanteRef.current <= 0) return;

      try {
        const status = await alexaService.obterStatus(dentistId);
        if (!cancelado && status?.conectado) {
          limparTimers();
          setConectado(true);
          if (onConnected) {
            onConnected(status);
          }
        }
      } catch (e) {
        console.debug('Polling Alexa status:', e);
      }
    };

    // Executa imediatamente e depois a cada 3 segundos ininterruptamente
    checarStatus();
    const intervalId = setInterval(checarStatus, 3000);
    pollingRef.current = intervalId;

    return () => {
      cancelado = true;
      clearInterval(intervalId);
    };
  }, [isOpen, conectado, pin, dentistId, onConnected, limparTimers]);

  // Fechar com tecla Escape
  useEffect(() => {
    if (!isOpen) return undefined;
    const aoTeclar = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [isOpen, onClose]);

  const copiarPin = async () => {
    if (!pin) return;
    try {
      await navigator.clipboard.writeText(pin);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-conectar-alexa"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        {conectado ? (
          /* Estado de Celebração / Pareamento Concluído */
          <div className={styles.celebrationCard}>
            <div className={styles.celebrationIcon}>
              <Sparkles size={36} />
            </div>
            <h2 className={styles.celebrationTitle}>Dispositivo Conectado com Sucesso!</h2>
            <p className={styles.celebrationDesc}>
              🎉 O dispositivo Amazon Echo foi vinculado ao consultório do(a){' '}
              <strong>{dentistNome}</strong>. Agora você já pode usar comandos de voz e receber alertas sonoros 10 minutos antes de cada atendimento.
            </p>

            <div className={styles.cheatSheet}>
              <p className={styles.cheatSheetTitle}>Comandos de Voz Rápidos:</p>
              <ul className={styles.cheatList}>
                <li>
                  <span>&quot;Alexa, qual a próxima consulta?&quot;</span> — Informa paciente e horário.
                </li>
                <li>
                  <span>&quot;Alexa, quais as consultas de hoje?&quot;</span> — Resumo de atendimentos do dia.
                </li>
                <li>
                  <span>&quot;Alexa, alerta de anamnese&quot;</span> — Alergias e histórico clínico do paciente.
                </li>
              </ul>
            </div>

            <Button variant="primary" type="button" onClick={onClose}>
              Concluir
            </Button>
          </div>
        ) : (
          /* Estado Ativo de Pareamento */
          <>
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <Mic size={24} />
              </div>
              <div className={styles.headerTexts}>
                <h2 id="titulo-conectar-alexa">Conectar Assistente Alexa</h2>
                <p>Pareie o dispositivo Amazon Echo do consultório do(a) {dentistNome}</p>
              </div>
            </div>

            {carregando ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner} />
                <p>Gerando código temporário de pareamento...</p>
              </div>
            ) : erro ? (
              <div className={styles.expiredBox}>
                <p className={styles.expiredText}>{erro}</p>
                <Button variant="outline" type="button" onClick={gerarNovoPin}>
                  <RefreshCw size={14} />
                  Tentar Novamente
                </Button>
              </div>
            ) : (
              <>
                <div className={styles.pinContainer}>
                  <p className={styles.pinLabel}>Código de Pareamento de 6 Dígitos</p>
                  <div className={styles.pinDisplayWrapper}>
                    <span className={styles.pinDigits}>
                      {pin ? pin.split('').join(' ') : '------'}
                    </span>
                    <button
                      type="button"
                      className={styles.copyButton}
                      onClick={copiarPin}
                      aria-label="Copiar código PIN"
                    >
                      {copiado ? <Check size={16} /> : <Copy size={16} />}
                      {copiado ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>

                  {tempoRestante > 0 ? (
                    <div className={styles.timerPill}>
                      <Clock size={14} />
                      <span>Expira em {formatarTempo(tempoRestante)}</span>
                    </div>
                  ) : (
                    <div className={styles.expiredBox}>
                      <p className={styles.expiredText}>Código expirado!</p>
                      <Button variant="outline" type="button" onClick={gerarNovoPin}>
                        <RefreshCw size={14} />
                        Gerar Novo Código
                      </Button>
                    </div>
                  )}
                </div>

                <section className={styles.tutorialSection}>
                  <h3 className={styles.sectionTitle}>Como vincular em 3 passos:</h3>
                  <div className={styles.stepsList}>
                    <div className={styles.stepItem}>
                      <span className={styles.stepBadge}>1</span>
                      <p className={styles.stepText}>
                        No consultório, ligue seu <strong>Amazon Echo</strong> ou abra o aplicativo Alexa no smartphone.
                      </p>
                    </div>

                    <div className={styles.stepItem}>
                      <span className={styles.stepBadge}>2</span>
                      <p className={styles.stepText}>
                        Diga em voz alta e com clareza:
                        <span className={styles.speechQuote}>
                          &quot;Alexa, abra a Lumina e vincule o código {pin}&quot;
                        </span>
                      </p>
                    </div>

                    <div className={styles.stepItem}>
                      <span className={styles.stepBadge}>3</span>
                      <p className={styles.stepText}>
                        Aguarde a confirmação de sucesso da Alexa. Esta janela detectará a vinculação automaticamente!
                      </p>
                    </div>
                  </div>
                </section>

                <div className={styles.pollingBanner}>
                  <div className={styles.pulsingDot} />
                  <span>Aguardando pareamento de voz com seu dispositivo Echo...</span>
                </div>

                <div className={styles.cheatSheet}>
                  <p className={styles.cheatSheetTitle}>
                    <Volume2 size={13} style={{ display: 'inline', marginRight: 4 }} />
                    Dica de Produtividade:
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--cor-texto-medio)' }}>
                    Com a Alexa conectada, você consulta a ficha clínica e a próxima consulta sem tirar as luvas estéreis e sem tocar no computador.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
