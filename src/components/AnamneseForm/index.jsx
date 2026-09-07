import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './styles.module.css';

const perguntasAnamnese = [
  {
    numero: 1,
    campo: 'tratamentoMedico',
    texto: 'Está fazendo algum tratamento médico?',
    larguraTotal: true,
    pagina: 1,
    detalhe: {
      campo: 'tratamentoMedicoDetalhes',
      rotulo: 'Qual tratamento?',
      placeholder: 'Descreva o tratamento em andamento…',
      mensagemErro: 'Especifique o tratamento em andamento',
    },
  },
  {
    numero: 2,
    campo: 'doresCabecaFace',
    texto: 'Sente dores de cabeça, dores na face, ouvido ou articulação?',
    larguraTotal: true,
    pagina: 1,
  },
  {
    numero: 3,
    campo: 'alergiaMedicamento',
    texto: 'Tem alergia a algum medicamento?',
    pagina: 1,
    detalhe: {
      campo: 'alergiaMedicamentoDetalhes',
      rotulo: 'Qual medicamento?',
      placeholder: 'Informe o medicamento…',
      mensagemErro: 'Especifique a alergia a medicamento',
    },
  },
  { numero: 4, campo: 'reacaoAnestesia', texto: 'Teve alguma reação a anestesia local?', pagina: 1 },
  { numero: 5, campo: 'sensibilidadeDentes', texto: 'Sente sensibilidade nos dentes?', pagina: 1 },
  { numero: 6, campo: 'rangeDentes', texto: 'Range os dentes ou tem apertamento?', pagina: 1 },
  { numero: 7, campo: 'gengivaSangra', texto: 'Sua gengiva sangra com frequência?', pagina: 1 },
  {
    numero: 8,
    campo: 'habito',
    texto: 'Tem algum hábito?',
    larguraTotal: true,
    pagina: 2,
    detalhe: {
      campo: 'habitoDetalhes',
      rotulo: 'Qual hábito?',
      placeholder: 'Ex.: fumar, roer unhas…',
      mensagemErro: 'Especifique o hábito',
    },
  },
  {
    numero: 9,
    campo: 'diabeticoFamilia',
    texto: 'É diabético? Tem alguém da família que é diabético?',
    larguraTotal: true,
    pagina: 2,
  },
  { numero: 10, campo: 'sangramentoCortes', texto: 'Quando você se corta, sangra muito?', pagina: 2 },
  {
    numero: 11,
    campo: 'problemaCardiaco',
    texto: 'Tem algum problema cardíaco?',
    pagina: 2,
    detalhe: {
      campo: 'problemaCardiacoDetalhes',
      rotulo: 'Qual problema?',
      placeholder: 'Descreva o problema cardíaco…',
      mensagemErro: 'Especifique o problema cardíaco',
    },
  },
  { numero: 12, campo: 'pressaoArterialNormal', texto: 'Sua pressão arterial é normal?', pagina: 2 },
  {
    numero: 13,
    campo: 'desmaioConvulsao',
    texto: 'Teve algum desmaio, tem ataques nervosos, epilepsia ou convulsão?',
    pagina: 2,
  },
  { numero: 14, campo: 'gravidez', texto: 'Está grávida?', pagina: 2 },
];

const totalPaginas = 2;

const formatoBase = Object.fromEntries([
  ...perguntasAnamnese.map((pergunta) => [pergunta.campo, z.boolean().optional()]),
  ...perguntasAnamnese
    .filter((pergunta) => pergunta.detalhe)
    .map((pergunta) => [pergunta.detalhe.campo, z.string().optional()]),
]);

const anamneseSchema = z.object(formatoBase).superRefine((dados, ctx) => {
  perguntasAnamnese.forEach(({ campo }) => {
    if (typeof dados[campo] !== 'boolean') {
      ctx.addIssue({ code: 'custom', path: [campo], message: 'Responda Sim ou Não' });
    }
  });

  perguntasAnamnese
    .filter((pergunta) => pergunta.detalhe)
    .forEach(({ campo, detalhe }) => {
      if (dados[campo] === true && !dados[detalhe.campo]?.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: [detalhe.campo],
          message: detalhe.mensagemErro,
        });
      }
    });
});

const valoresIniciais = Object.fromEntries([
  ...perguntasAnamnese.map((pergunta) => [pergunta.campo, undefined]),
  ...perguntasAnamnese
    .filter((pergunta) => pergunta.detalhe)
    .map((pergunta) => [pergunta.detalhe.campo, '']),
]);

export function AnamneseForm({ onSubmit = (dados) => console.log('Dados simulados:', dados) }) {
  const [pagina, setPagina] = useState(1);
  const [enviado, setEnviado] = useState(false);
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
    defaultValues: valoresIniciais,
  });

  const valores = useWatch({ control });
  const perguntasPagina = perguntasAnamnese.filter((p) => p.pagina === pagina);
  const camposDaPagina = perguntasPagina.flatMap((p) =>
    p.detalhe ? [p.campo, p.detalhe.campo] : [p.campo],
  );

  const responder = (pergunta, valor) => {
    setValue(pergunta.campo, valor, { shouldValidate: true });
    if (valor !== true && pergunta.detalhe) {
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

  const enviar = (dados) => {
    onSubmit(dados);
    setEnviado(true);
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
          {perguntasPagina.map((pergunta) => (
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
                      disabled={valores[pergunta.campo] !== true}
                      placeholder={
                        valores[pergunta.campo] === true
                          ? pergunta.detalhe.placeholder
                          : 'Marque “Sim” para especificar…'
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
          ))}
        </div>

        {enviado && (
          <p className={styles.sucesso} role="status">
            Anamnese registrada com sucesso.
          </p>
        )}

        <footer className={styles.acoes}>
          {pagina > 1 && (
            <button
              type="button"
              className={styles.botaoSecundario}
              onClick={() => irParaPagina(pagina - 1)}
            >
              ← Voltar
            </button>
          )}
          {pagina < totalPaginas ? (
            <button type="button" className={styles.botaoPrimario} onClick={avancarPagina}>
              Próxima página →
            </button>
          ) : (
            <button type="submit" className={styles.botaoPrimario}>
              Salvar Anamnese
            </button>
          )}
        </footer>
      </form>
    </section>
  );
}

export default AnamneseForm;
