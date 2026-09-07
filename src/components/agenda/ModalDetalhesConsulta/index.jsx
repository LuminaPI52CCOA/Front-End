import { useEffect, useRef, useState } from 'react';
import { useConsultas } from '../../../context/ConsultasContexto';
import styles from './styles.module.css';

const OPCOES_STATUS = ['Confirmado', 'Pendente', 'Cancelado'];

export function ModalDetalhesConsulta({ consulta, onFechar }) {
  const { atualizarConsulta } = useConsultas();
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState(() => ({
    telefone: consulta.telefone ?? '',
    inicio: consulta.inicio,
    fim: consulta.fim,
    observacoes: consulta.observacoes ?? '',
  }));
  const refBotaoFechar = useRef(null);

  useEffect(() => {
    refBotaoFechar.current?.focus();

    const aoTeclar = (evento) => {
      if (evento.key === 'Escape') onFechar();
    };
    window.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [onFechar]);

  const atualizarCampo = (campo) => (evento) =>
    setFormulario((atual) => ({ ...atual, [campo]: evento.target.value }));

  const salvarEdicao = () => {
    atualizarConsulta(consulta.id, formulario);
    setEditando(false);
  };

  const classeStatus = (status) => {
    if (status === 'Confirmado') return styles.confirmado;
    if (status === 'Pendente') return styles.pendente;
    return styles.cancelado;
  };

  return (
    <div
      className={styles.overlay}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onFechar();
      }}
    >
      <div className={styles.dialogo} role="dialog" aria-modal="true" aria-labelledby="titulo-modal-consulta">
        <div className={styles.topo}>
          <h3 id="titulo-modal-consulta">Detalhes da consulta</h3>
          <button
            ref={refBotaoFechar}
            className={styles.botaoFechar}
            type="button"
            aria-label="Fechar detalhes da consulta"
            onClick={onFechar}
          >
            ✕
          </button>
        </div>

        <dl className={styles.gradeCampos}>
          <div className={styles.campo}>
            <dt>Paciente</dt>
            <dd>{consulta.paciente}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Telefone</dt>
            <dd>
              {editando ? (
                <input
                  type="tel"
                  value={formulario.telefone}
                  onChange={atualizarCampo('telefone')}
                  aria-label="Telefone do paciente"
                />
              ) : (
                consulta.telefone || '—'
              )}
            </dd>
          </div>
          <div className={styles.campo}>
            <dt>Dentista responsável</dt>
            <dd>{consulta.dentista}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Especialidade</dt>
            <dd>{consulta.especialidade}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Procedimento</dt>
            <dd>{consulta.procedimento || '—'}</dd>
          </div>
          <div className={styles.campo}>
            <dt>Status</dt>
            <dd>{consulta.status}</dd>
          </div>
        </dl>

        <div className={styles.campoForm}>
          {editando ? (
            <>
              <label htmlFor="horarios-edicao">Horário (início / término)</label>
              <div className={styles.parHorarios} id="horarios-edicao">
                <input
                  type="time"
                  value={formulario.inicio}
                  onChange={atualizarCampo('inicio')}
                  aria-label="Horário de início"
                />
                <input
                  type="time"
                  value={formulario.fim}
                  onChange={atualizarCampo('fim')}
                  aria-label="Horário de término"
                />
              </div>
            </>
          ) : (
            <dl className={styles.gradeCampos} style={{ margin: 0 }}>
              <div>
                <dt>Início</dt>
                <dd>{consulta.inicio}</dd>
              </div>
              <div>
                <dt>Término</dt>
                <dd>{consulta.fim}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className={styles.campoForm}>
          {editando ? (
            <>
              <label htmlFor="observacoes-edicao">Observações</label>
              <textarea
                id="observacoes-edicao"
                value={formulario.observacoes}
                onChange={atualizarCampo('observacoes')}
                placeholder="Anotações sobre a consulta..."
              />
            </>
          ) : (
            <div className={styles.campo}>
              <dt>Observações</dt>
              <dd>
                {consulta.observacoes ? (
                  consulta.observacoes
                ) : (
                  <em className={styles.observacaoVazia}>Nenhuma anotação.</em>
                )}
              </dd>
            </div>
          )}
        </div>

        {!editando && (
          <>
            <div className={styles.campo}>
              <dt>Alterar status</dt>
              <div className={styles.botoesStatus}>
                {OPCOES_STATUS.map((status) => (
                  <button
                    key={status}
                    className={`${styles.botaoStatus}${
                      consulta.status === status
                        ? ` ${styles.ativo} ${classeStatus(status)}`
                        : ''
                    }`}
                    type="button"
                    aria-pressed={consulta.status === status}
                    onClick={() => atualizarConsulta(consulta.id, { status })}
                  >
                    {status === 'Confirmado' ? '✓ Confirmado' : status}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.rodape}>
              <button className={styles.botaoSecundario} type="button" onClick={() => setEditando(true)}>
                Editar agendamento
              </button>
            </div>
          </>
        )}

        {editando && (
          <div className={styles.rodape}>
            <button className={styles.botaoSecundario} type="button" onClick={() => setEditando(false)}>
              Cancelar edição
            </button>
            <button className={styles.botaoPrimario} type="button" onClick={salvarEdicao}>
              Salvar alterações
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalDetalhesConsulta;
