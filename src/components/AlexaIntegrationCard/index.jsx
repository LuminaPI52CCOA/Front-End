import { useEffect, useState } from 'react';
import {
  Mic,
  Radio,
  Clock,
  BellRing,
  Unlink,
  CheckCircle2,
} from 'lucide-react';
import { alexaService } from '../../services/alexaService';
import { Button } from '../Button';
import { ModalConectarAlexa } from '../ModalConectarAlexa';
import styles from './styles.module.css';

function formatarDataHora(isoString) {
  if (!isoString) return '';
  try {
    const data = new Date(isoString);
    if (Number.isNaN(data.getTime())) return isoString;
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  } catch {
    return isoString;
  }
}

export function AlexaIntegrationCard({ dentist }) {
  const [status, setStatus] = useState(null);
  const [carregando, setCarregando] = useState(Boolean(dentist?.id));
  const [modalConectarAberto, setModalConectarAberto] = useState(false);
  const [modalDesconectarAberto, setModalDesconectarAberto] = useState(false);
  const [desconectando, setDesconectando] = useState(false);

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      try {
        const dados = await alexaService.obterStatus(dentist?.id);
        if (ativo) {
          setStatus(dados);
          setCarregando(false);
        }
      } catch (err) {
        console.warn('Não foi possível obter status da Alexa:', err);
        if (ativo) {
          setStatus({ conectado: false, dentistaNome: dentist?.nome });
          setCarregando(false);
        }
      }
    };

    if (dentist?.id) {
      carregar();
    }

    return () => {
      ativo = false;
    };
  }, [dentist]);

  const handleDesconectar = async () => {
    setDesconectando(true);
    try {
      await alexaService.desconectar(dentist?.id);
      setStatus({
        conectado: false,
        alexaUserId: null,
        apiEndpoint: null,
        vinculadoEm: null,
        dentistaNome: dentist?.nome,
      });
      setModalDesconectarAberto(false);
    } catch (err) {
      alert(err.message || 'Erro ao desconectar dispositivo Alexa');
    } finally {
      setDesconectando(false);
    }
  };

  const handleSucessoConexao = (dadosNovos) => {
    setStatus(dadosNovos || { conectado: true, dentistaNome: dentist?.nome });
  };

  const isConectado = Boolean(status?.conectado);

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <div className={styles.titleArea}>
          <span className={styles.iconAlexa} aria-hidden="true">
            <Mic size={18} />
          </span>
          <h3 className={styles.cardTitle}>Assistente de Voz Alexa</h3>
        </div>

        {isConectado ? (
          <span className={styles.badgeConnected}>
            <span className={styles.statusDot} />
            Dispositivo Echo Conectado
          </span>
        ) : (
          <span className={styles.badgeDisconnected}>
            <span className={styles.statusDot} />
            Não Conectado
          </span>
        )}
      </header>

      <div className={styles.content}>
        {isConectado ? (
          <div className={styles.connectedDetails}>
            {status?.vinculadoEm && (
              <div className={styles.connectedTimestamp}>
                <Clock size={14} />
                <span>Pareado em {formatarDataHora(status.vinculadoEm)}</span>
              </div>
            )}

            <div className={styles.reminderAlert}>
              <BellRing size={16} />
              <span>Lembretes proativos sonoros 10 min antes de cada atendimento.</span>
            </div>

            <div className={styles.commandsBox}>
              <p className={styles.commandsTitle}>Comandos de Voz Rápidos:</p>
              <ul className={styles.commandsList}>
                <li>
                  <span>&quot;Alexa, qual a próxima consulta?&quot;</span> — Próximo paciente e horário.
                </li>
                <li>
                  <span>&quot;Alexa, quais as consultas de hoje?&quot;</span> — Resumo geral de atendimentos do dia.
                </li>
                <li>
                  <span>&quot;Alexa, alerta de anamnese&quot;</span> — Alergias e alertas clínicos do paciente.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <p className={styles.description}>
              Integre o consultório ao <strong>Amazon Echo</strong> e opere o sistema por voz sem tirar as luvas estéreis.
            </p>

            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <CheckCircle2 size={15} color="var(--cor-dourado)" />
                <span>
                  <strong>Alertas Proativos:</strong> Aviso sonoro automático 10 min antes da consulta.
                </span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle2 size={15} color="var(--cor-dourado)" />
                <span>
                  <strong>Higiene & Assepsia:</strong> Consulte agenda e histórico médico com as mãos livres.
                </span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle2 size={15} color="var(--cor-dourado)" />
                <span>
                  <strong>Agilidade:</strong> Alertas imediatos de anamnese (alergia a fármacos, anestésicos).
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className={styles.footerActions}>
        {isConectado ? (
          <button
            type="button"
            className={styles.disconnectButton}
            onClick={() => setModalDesconectarAberto(true)}
            aria-label="Desconectar dispositivo Alexa"
          >
            <Unlink size={14} />
            Desconectar Alexa
          </button>
        ) : (
          <Button
            variant="primary"
            type="button"
            onClick={() => setModalConectarAberto(true)}
            disabled={carregando}
          >
            <Radio size={16} />
            Conectar Dispositivo Alexa
          </Button>
        )}
      </footer>

      {/* Modal de Conexão com Smart Polling e Tutorial */}
      <ModalConectarAlexa
        dentist={dentist}
        isOpen={modalConectarAberto}
        onClose={() => setModalConectarAberto(false)}
        onConnected={handleSucessoConexao}
      />

      {/* Modal de Confirmação para Desconectar */}
      {modalDesconectarAberto && (
        <div
          className={styles.confirmOverlay}
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalDesconectarAberto(false);
          }}
        >
          <div
            className={styles.confirmBox}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-desconectar-alexa"
          >
            <h3 id="titulo-desconectar-alexa" className={styles.confirmTitle}>
              Desconectar Assistente Alexa?
            </h3>
            <p className={styles.confirmText}>
              O dispositivo Amazon Echo do consultório do(a) <strong>{dentist?.nome}</strong> não receberá mais alertas de consultas nem responderá comandos de voz da Lumina até ser pareado novamente.
            </p>
            <div className={styles.confirmActions}>
              <Button
                variant="outline"
                type="button"
                onClick={() => setModalDesconectarAberto(false)}
                disabled={desconectando}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={handleDesconectar}
                disabled={desconectando}
              >
                {desconectando ? 'Desconectando...' : 'Desconectar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
