import { Component } from 'react';

const PADRAO_ERRO_CHUNK =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i;

export class ChunkErrorBoundary extends Component {
  state = { erroChunk: false };

  static getDerivedStateFromError(error) {
    if (PADRAO_ERRO_CHUNK.test(error?.message ?? '')) {
      return { erroChunk: true };
    }
    throw error;
  }

  render() {
    if (!this.state.erroChunk) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          minHeight: '60vh',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'var(--font-base)',
          color: 'var(--cor-texto)',
        }}
      >
        <p>Uma nova versão do sistema está disponível ou a conexão falhou ao carregar esta página.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: 'var(--raio-controle)',
            background: 'var(--cor-dourado)',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Recarregar página
        </button>
      </div>
    );
  }
}

export default ChunkErrorBoundary;
