import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from './lib/ErrorBoundary';
import { App } from './App';
import './styles/high-velocity.css';
import './styles/halston-animations.css';
import './styles/grail-hunter-animations.css';
import './index.css';

const ErrorFallback: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      background: '#0A0A0F',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      color: 'white',
      padding: '2rem',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        fontSize: '10px',
        fontWeight: 900,
        letterSpacing: '0.3em',
        color: '#FF3B3B',
        textTransform: 'uppercase',
        marginBottom: '1rem',
      }}
    >
      SYSTEM FAULT
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>CRITICAL ERROR</div>
    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
      The intelligence network encountered an unrecoverable fault.
    </div>
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: '1rem 2rem',
        background: '#2BF3C0',
        color: 'black',
        border: 'none',
        borderRadius: '1rem',
        fontWeight: 900,
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      REBOOT SYSTEM
    </button>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
