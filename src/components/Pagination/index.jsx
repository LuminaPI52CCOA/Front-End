import { useId, useState } from 'react';
import styles from './styles.module.css';

const MAX_VISIVEIS = 7;

function gerarPaginas(atual, total, maxVisiveis = MAX_VISIVEIS) {
  if (total <= 0) return [];
  if (total <= maxVisiveis) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const ultima = total - 1;
  if (atual <= 3) {
    return [0, 1, 2, 3, 4, 'fim', ultima];
  }

  if (atual >= ultima - 3) {
    return [0, 'inicio', ultima - 4, ultima - 3, ultima - 2, ultima - 1, ultima];
  }

  return [0, 'inicio', atual - 1, atual, atual + 1, 'fim', ultima];
}

export function Pagination({ paginaAtual, totalPages, onChange }) {
  const [valorIrPara, setValorIrPara] = useState('');
  const inputId = useId();

  if (totalPages <= 0) return null;

  const itens = gerarPaginas(paginaAtual, totalPages);
  const naPrimeira = paginaAtual <= 0;
  const naUltima = paginaAtual >= totalPages - 1;

  function irParaPagina(e) {
    e.preventDefault();
    const numero = parseInt(valorIrPara, 10);
    if (Number.isNaN(numero)) return;
    const destino = Math.min(Math.max(numero, 1), totalPages) - 1;
    if (destino !== paginaAtual) {
      onChange(destino);
    }
    setValorIrPara('');
  }

  return (
    <div className={styles.paginationControls}>
      <button
        type="button"
        className={styles.pageButton}
        disabled={naPrimeira}
        onClick={() => onChange(Math.max(0, paginaAtual - 1))}
      >
        Anterior
      </button>

      {itens.map((item) => {
        if (typeof item === 'string') {
          return (
            <span key={item} className={styles.ellipsis} aria-hidden="true">
              …
            </span>
          );
        }

        const ativo = item === paginaAtual;
        return (
          <button
            key={item}
            type="button"
            className={`${styles.pageButton} ${ativo ? styles.pageButtonActive : ''}`}
            onClick={() => onChange(item)}
            aria-current={ativo ? 'page' : undefined}
          >
            {item + 1}
          </button>
        );
      })}

      <button
        type="button"
        className={styles.pageButton}
        disabled={naUltima}
        onClick={() => onChange(Math.min(totalPages - 1, paginaAtual + 1))}
      >
        Próxima
      </button>

      {totalPages > MAX_VISIVEIS && (
        <form className={styles.goToPage} onSubmit={irParaPagina}>
          <label htmlFor={inputId} className={styles.goToLabel}>
            Ir para
          </label>
          <input
            id={inputId}
            type="number"
            min={1}
            max={totalPages}
            inputMode="numeric"
            placeholder={`1–${totalPages}`}
            value={valorIrPara}
            onChange={(e) => setValorIrPara(e.target.value)}
            className={styles.goToInput}
            aria-label="Ir para a página"
          />
          <button
            type="submit"
            className={styles.pageButton}
            disabled={!valorIrPara.trim()}
          >
            Ir
          </button>
        </form>
      )}
    </div>
  );
}

export default Pagination;
