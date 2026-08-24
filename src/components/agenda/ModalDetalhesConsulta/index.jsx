import { useEffect, useRef, useState } from 'react';
import { useConsultas } from '../../../context/ConsultasContexto';
import * as S from './styles';

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

  return (
    <S.Overlay
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onFechar();
      }}
    >
      <S.Dialogo role="dialog" aria-modal="true" aria-labelledby="titulo-modal-consulta">
        <S.Topo>
          <h3 id="titulo-modal-consulta">Detalhes da consulta</h3>
          <S.BotaoFechar
            ref={refBotaoFechar}
            type="button"
            aria-label="Fechar detalhes da consulta"
            onClick={onFechar}
          >
            ✕
          </S.BotaoFechar>
        </S.Topo>

        <S.GradeCampos>
          <S.Campo>
            <dt>Paciente</dt>
            <dd>{consulta.paciente}</dd>
          </S.Campo>
          <S.Campo>
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
          </S.Campo>
          <S.Campo>
            <dt>Dentista responsável</dt>
            <dd>{consulta.dentista}</dd>
          </S.Campo>
          <S.Campo>
            <dt>Especialidade</dt>
            <dd>{consulta.especialidade}</dd>
          </S.Campo>
          <S.Campo>
            <dt>Procedimento</dt>
            <dd>{consulta.procedimento || '—'}</dd>
          </S.Campo>
          <S.Campo>
            <dt>Status</dt>
            <dd>{consulta.status}</dd>
          </S.Campo>
        </S.GradeCampos>

        <S.CampoForm>
          {editando ? (
            <>
              <label htmlFor="horarios-edicao">Horário (início / término)</label>
              <S.ParHorarios id="horarios-edicao">
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
              </S.ParHorarios>
            </>
          ) : (
            <S.GradeCampos style={{ margin: 0 }}>
              <div>
                <dt>Início</dt>
                <dd>{consulta.inicio}</dd>
              </div>
              <div>
                <dt>Término</dt>
                <dd>{consulta.fim}</dd>
              </div>
            </S.GradeCampos>
          )}
        </S.CampoForm>

        <S.CampoForm>
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
            <S.Campo>
              <dt>Observações</dt>
              <dd>
                {consulta.observacoes ? (
                  consulta.observacoes
                ) : (
                  <S.ObservacaoVazia>Nenhuma anotação.</S.ObservacaoVazia>
                )}
              </dd>
            </S.Campo>
          )}
        </S.CampoForm>

        {!editando && (
          <>
            <S.Campo>
              <dt>Alterar status</dt>
              <S.BotoesStatus>
                {OPCOES_STATUS.map((status) => (
                  <S.BotaoStatus
                    key={status}
                    type="button"
                    $ativo={consulta.status === status}
                    $status={status}
                    aria-pressed={consulta.status === status}
                    onClick={() => atualizarConsulta(consulta.id, { status })}
                  >
                    {status === 'Confirmado' ? '✓ Confirmado' : status}
                  </S.BotaoStatus>
                ))}
              </S.BotoesStatus>
            </S.Campo>

            <S.Rodape>
              <S.BotaoSecundario type="button" onClick={() => setEditando(true)}>
                Editar agendamento
              </S.BotaoSecundario>
            </S.Rodape>
          </>
        )}

        {editando && (
          <S.Rodape>
            <S.BotaoSecundario type="button" onClick={() => setEditando(false)}>
              Cancelar edição
            </S.BotaoSecundario>
            <S.BotaoPrimario type="button" onClick={salvarEdicao}>
              Salvar alterações
            </S.BotaoPrimario>
          </S.Rodape>
        )}
      </S.Dialogo>
    </S.Overlay>
  );
}

export default ModalDetalhesConsulta;
