import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './styles.module.css';
import { PERGUNTAS_ANAMNESE } from '../../services/anamneseService';

const totalPaginas = 2;

const formatoBase = Object.fromEntries([
  ...PERGUNTAS_ANAMNESE.map((pergunta) => [pergunta.campo, z.boolean().optional()]),
  ...PERGUNTAS_ANAMNESE.filter((pergunta) => pergunta.detalhe).map((pergunta) => [
    pergunta.detalhe.campo,
    z.string().max(100, 'Máximo de 100 caracteres').optional(),
  ]),
]);

const anamneseSchema = z.object(formatoBase).superRefine((dados, ctx) => {
  PERGUNTAS_ANAMNESE.forEach(({ campo }) => {
    if (typeof dados[campo] !== 'boolean') {
      ctx.addIssue({ code: 'custom', path: [campo], message: 'Responda Sim ou Não' });
    }
  });

  PERGUNTAS_ANAMNESE.filter(
    (pergunta) => pergunta.detalhe?.obrigatorio,
  ).forEach(({ campo, detalhe }) => {
    if (dados[campo] === detalhe.quandoValor && !dados[detalhe.campo]?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: [detalhe.campo],
        message: detalhe.mensagemErro,
      });
    }
  });
});

const valoresIniciais = Object.fromEntries([
  ...PERGUNTAS_ANAMNESE.map((pergunta) => [pergunta.campo, undefined]),
  ...PERGUNTAS_ANAMNESE.filter((pergunta) => pergunta.detalhe).map((pergunta) => [
    pergunta.detalhe.campo,
    '',
  ]),
]);

export function AnamneseForm({ onSubmit = async () => {}, onCancel }) {
  const [pagina, setPagina] = useState(1);
  const [enviado, setEnviado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const paginaRef = useRef(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(anamneseSchema),
    defaultValues: { ...valoresIniciais },
  });

  const valores = useWatch({ control });
  const perguntasPagina = PERGUNTAS_ANAMNESE.filter((pergunta) => pergunta.pagina === pagina);
  const camposDaPagina = perguntasPagina.flatMap((pergunta) =>
    pergunta.detalhe ? [pergunta.campo, pergunta.detalhe.campo] : [pergunta.campo],
  );

  const responder = (pergunta, valor) => {
    setValue(pergunta.campo, valor, { shouldValidate: true });
    if (pergunta.detalhe && valor !== pergunta.detalhe.quandoValor) {
      setValue(pergunta.detalhe.campo, '');
    }
  };

  const irParaPagina = (novaPagina) => {
    setPagina(novaPagina);
    requestAnimationFrame(() => paginaRef.current?.focus());
  };

  const avancarPagina = async () => {
    const valido = await trigger(camposDaPagina);
    if (valido) irParaPagina(pagina + 1);
  };

  const enviar = async (dados) => {
    setErroEnvio('');
    setEnviado(false);
    setSalvando(true);
    try {
      await onSubmit(dados);
      setEnviado(true);
    } catch (err) {
      setErroEnvio(err?.message || 'Não foi possível salvar a anamnese. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.titulo}>Anamnese</h3>
          <p className={styles.subtitulo}>Questionário de histórico de saúde do paciente</p>
        </div>
        <span className={styles.progressoTexto}>
          Página {pagina} de {totalPaginas}
        </span>
      </header>

      <div className={styles.barraProgresso}>
        {Array.from({ length: totalPaginas }, (_, indice) => (
          <span
            key={indice}
            className={`${styles.barraSegmento} ${indice < pagina ? styles.barraAtiva : ''}`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit(enviar)} noValidate>
        <div ref={paginaRef} className={styles.grid} tabIndex={-1}>
          {perguntasPagina.map((pergunta) => {
            const detalheAtivo =
              pergunta.detalhe && valores[pergunta.campo] === pergunta.detalhe.quandoValor;

            return (
              <article
                key={pergunta.campo}
                className={`${styles.card} ${pergunta.larguraTotal ? styles.larguraTotal : ''}`}
              >
                <header className={styles.perguntaTopo}>
                  <span className={styles.numero}>{String(pergunta.numero).padStart(2, '0')}</span>
                  <p className={styles.texto}>{pergunta.texto}</p>
                </header>

                <div className={styles.controles}>
                  <div className={styles.toggles}>
                    {[true, false].map((valor) => (
                      <button
                        key={String(valor)}
                        type="button"
                        aria-pressed={valores[pergunta.campo] === valor}
                        aria-invalid={errors[pergunta.campo] ? true : undefined}
                        aria-describedby={
                          errors[pergunta.campo] ? `${pergunta.campo}-erro` : undefined
                        }
                        className={`${styles.toggle} ${
                          valores[pergunta.campo] === valor ? styles.toggleAtivo : ''
                        }`}
                        onClick={() => responder(pergunta, valor)}
                      >
                        {valor ? 'Sim' : 'Não'}
                      </button>
                    ))}
                  </div>

                  {pergunta.detalhe && (
                    <div className={styles.detalheBloco}>
                      <label className={styles.detalheRotulo} htmlFor={pergunta.detalhe.campo}>
                        {pergunta.detalhe.rotulo}
                      </label>
                      <input
                        id={pergunta.detalhe.campo}
                        type="text"
                        maxLength={100}
                        disabled={!detalheAtivo}
                        placeholder={
                          detalheAtivo
                            ? pergunta.detalhe.placeholder
                            : `Marque “${pergunta.detalhe.quandoValor ? 'Sim' : 'Não'}” para especificar…`
                        }
                        className={`${styles.detalheInput} ${
                          errors[pergunta.detalhe.campo] ? styles.detalheInputErro : ''
                        }`}
                        aria-invalid={errors[pergunta.detalhe.campo] ? true : undefined}
                        aria-describedby={
                          errors[pergunta.detalhe.campo]
                            ? `${pergunta.detalhe.campo}-erro`
                            : undefined
                        }
                        {...register(pergunta.detalhe.campo)}
                      />
                    </div>
                  )}

                  {errors[pergunta.campo] && (
                    <p className={styles.erro} id={`${pergunta.campo}-erro`} role="alert">
                      {errors[pergunta.campo].message}
                    </p>
                  )}
                </div>

                {errors[pergunta.detalhe?.campo] && (
                  <p className={styles.erro} id={`${pergunta.detalhe.campo}-erro`} role="alert">
                    {errors[pergunta.detalhe.campo].message}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {enviado && (
          <p className={styles.sucesso} role="status">
            Anamnese registrada com sucesso.
          </p>
        )}

        {erroEnvio && (
          <p className={styles.erroEnvio} role="alert">
            {erroEnvio}
          </p>
        )}

        <footer className={styles.acoes}>
          {onCancel && (
            <button
              type="button"
              className={styles.botaoSecundario}
              onClick={onCancel}
              disabled={salvando}
            >
              Cancelar
            </button>
          )}
          {pagina > 1 && (
            <button
              type="button"
              className={styles.botaoSecundario}
              onClick={() => irParaPagina(pagina - 1)}
              disabled={salvando}
            >
              ← Voltar
            </button>
          )}
          {pagina < totalPaginas ? (
            <button type="button" className={styles.botaoPrimario} onClick={avancarPagina}>
              Próxima página →
            </button>
          ) : (
            <button type="submit" className={styles.botaoPrimario} disabled={salvando}>
              {salvando ? 'Salvando…' : 'Salvar Anamnese'}
            </button>
          )}
        </footer>
      </form>
    </section>
  );
}

export default AnamneseForm;
