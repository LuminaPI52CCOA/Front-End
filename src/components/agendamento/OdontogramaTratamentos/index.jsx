import * as S from './styles';

const VIEW_W = 800;
const GAP = 6;

const ARCADA_SUPERIOR = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
];
const ARCADA_INFERIOR = [
  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];

// eslint-disable-next-line react-refresh/only-export-components
export const MAPA_TIPO_DENTES = {
  'Incisivo Central': [11, 21, 31, 41],
  'Incisivo Lateral': [12, 22, 32, 42],
  Canino: [13, 23, 33, 43],
  'Primeiro Pré-molar': [14, 24, 34, 44],
  'Segundo Pré-molar': [15, 25, 35, 45],
  'Primeiro Molar': [16, 26, 36, 46],
  'Segundo Molar': [17, 27, 37, 47],
  'Terceiro Molar (Siso)': [18, 28, 38, 48],
};

const LARGURA_POR_DIGITO = { 1: 25, 2: 22, 3: 24, 4: 28, 5: 28, 6: 36, 7: 35, 8: 31 };
const ALTURA_POR_DIGITO = { 1: 46, 2: 42, 3: 47, 4: 41, 5: 41, 6: 39, 7: 38, 8: 36 };

const posicionarArcada = (numeros, yCentro, curvatura) => {
  const larguraTotal =
    numeros.reduce((soma, num) => soma + LARGURA_POR_DIGITO[num % 10], 0) +
    GAP * (numeros.length - 1);

  let x = (VIEW_W - larguraTotal) / 2;
  const meio = (numeros.length - 1) / 2;

  return numeros.map((num, indice) => {
    const digito = num % 10;
    const largura = LARGURA_POR_DIGITO[digito];
    const altura = ALTURA_POR_DIGITO[digito];
    const t = ((indice - meio) / meio) ** 2;
    const cy = yCentro + curvatura * t;
    const cx = x + largura / 2;
    x += largura + GAP;

    return { num, digito, x: cx - largura / 2, y: cy - altura / 2, largura, altura, cx, cy };
  });
};

const trilhaDaArcada = (dentes) => {
  const pontos = dentes.map((dente) => `${dente.cx},${dente.cy}`);
  return `M ${pontos.join(' L ')}`;
};

export function OdontogramaTratamentos({
  dentesSelecionados,
  onToggleDente,
  tipoDente,
  onTipoDenteChange,
  pular,
  onPularChange,
}) {
  const superior = posicionarArcada(ARCADA_SUPERIOR, 64, 26);
  const inferior = posicionarArcada(ARCADA_INFERIOR, 268, -26);
  const desabilitado = pular;

  const renderizarDente = (dente) => {
    const selecionado = dentesSelecionados.includes(dente.num);
    return (
      <S.DenteSvg
        key={dente.num}
        $desabilitado={desabilitado}
        role="button"
        tabIndex={desabilitado ? -1 : 0}
        aria-pressed={selecionado}
        aria-label={`Dente ${dente.num}`}
        onClick={() => onToggleDente(dente.num)}
        onKeyDown={(evento) => {
          if (evento.key === 'Enter' || evento.key === ' ') {
            evento.preventDefault();
            onToggleDente(dente.num);
          }
        }}
      >
        <rect
          x={dente.x}
          y={dente.y}
          width={dente.largura}
          height={dente.altura}
          rx={9}
          fill={selecionado ? '#F6E9CF' : '#FFFFFF'}
          stroke={selecionado ? '#CC9B2E' : '#C9C3B8'}
          strokeWidth={selecionado ? 2.5 : 1.5}
          style={
            selecionado
              ? { filter: 'drop-shadow(0 0 7px rgba(204, 155, 46, 0.55))' }
              : undefined
          }
        />
        <text
          x={dente.cx}
          y={dente.cy}
          dy="0.35em"
          textAnchor="middle"
          fontFamily="Montserrat, sans-serif"
          fontSize="12.5"
          fontWeight="600"
          fill="#4A3728"
          style={{ pointerEvents: 'none' }}
        >
          {dente.num}
        </text>
      </S.DenteSvg>
    );
  };

  const renderizarLinha = (numeros) => {
    const metade = numeros.length / 2;
    return (
      <S.LinhaArcada>
        <S.GrupoDentes>
          {numeros.slice(0, metade).map((numero) => (
            <S.BotaoDente
              key={numero}
              type="button"
              disabled={desabilitado}
              $selecionado={dentesSelecionados.includes(numero)}
              aria-pressed={dentesSelecionados.includes(numero)}
              onClick={() => onToggleDente(numero)}
            >
              {numero}
            </S.BotaoDente>
          ))}
        </S.GrupoDentes>
        <S.GrupoDentes>
          {numeros.slice(metade).map((numero) => (
            <S.BotaoDente
              key={numero}
              type="button"
              disabled={desabilitado}
              $selecionado={dentesSelecionados.includes(numero)}
              aria-pressed={dentesSelecionados.includes(numero)}
              onClick={() => onToggleDente(numero)}
            >
              {numero}
            </S.BotaoDente>
          ))}
        </S.GrupoDentes>
      </S.LinhaArcada>
    );
  };

  const resumoDentes = pular
    ? 'Odontograma pulado'
    : dentesSelecionados.length > 0
      ? `Dentes selecionados: ${dentesSelecionados.join('/ ')}`
      : 'Nenhum dente selecionado';

  return (
    <S.Card aria-label="Odontograma interativo de tratamentos">
      <S.Topo>
        <h3>Tratamentos 🦷</h3>
      </S.Topo>

      <S.Ilustracao>
        <svg
          viewBox={`0 0 ${VIEW_W} 340`}
          role="img"
          aria-label="Ilustração das arcadas dentárias"
        >
          <path
            d={trilhaDaArcada(superior)}
            fill="none"
            stroke="#F6EFE0"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={trilhaDaArcada(inferior)}
            fill="none"
            stroke="#F6EFE0"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {superior.map(renderizarDente)}
          {inferior.map(renderizarDente)}
        </svg>
      </S.Ilustracao>

      <S.Matriz>
        {renderizarLinha(ARCADA_SUPERIOR)}
        {renderizarLinha(ARCADA_INFERIOR)}
      </S.Matriz>

      <S.Rodape>
        <S.EnvolvedorSeletor>
          <S.SeletorTipo
            aria-label="Tipo de dente ou procedimento"
            value={tipoDente}
            disabled={pular}
            onChange={(evento) => onTipoDenteChange(evento.target.value)}
          >
            <option value="">Tipo de dente</option>
            {Object.keys(MAPA_TIPO_DENTES).map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </S.SeletorTipo>
        </S.EnvolvedorSeletor>

        <S.Resumo>
          <S.QuadradoIndicador aria-hidden="true" />
          <p>{resumoDentes}</p>
        </S.Resumo>

        <S.RotuloPular>
          <input
            type="checkbox"
            checked={pular}
            onChange={(evento) => onPularChange(evento.target.checked)}
          />
          Pular
        </S.RotuloPular>
      </S.Rodape>
    </S.Card>
  );
}

export default OdontogramaTratamentos;
