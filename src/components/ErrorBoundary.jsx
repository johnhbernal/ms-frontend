import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh',
          background: 'var(--slate-50)', color: 'var(--slate-700)',
        }}>
          <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>
            Algo salió mal
          </p>
          <p style={{ fontSize: 13, color: 'var(--slate-400)', margin: '0 0 20px' }}>
            Recarga la página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 18px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--slate-200)', background: 'white',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
