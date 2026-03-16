import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { App } from './App';
import { TicketStoreProvider } from './store/ticketStore';

const PASS_KEY = 'gunmaas-auth';
const CORRECT_PASS = 'gunmaas2026';

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const [authed, setAuthed] = useState(() => localStorage.getItem(PASS_KEY) === 'ok');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  if (authed) return <>{children}</>;

  const submit = () => {
    if (input === CORRECT_PASS) {
      localStorage.setItem(PASS_KEY, 'ok');
      setAuthed(true);
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: '#F7FAF8' }}>
      <div style={{ textAlign: 'center', padding: '0 24px', maxWidth: 320, width: '100%' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#2D6A4F', marginBottom: 24 }}>プロトタイプ閲覧</div>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="パスワードを入力"
          style={{
            width: '100%', padding: '12px 16px', fontSize: 16, borderRadius: 8, boxSizing: 'border-box',
            border: error ? '2px solid #E07A5F' : '2px solid #E2EDE6', outline: 'none',
          }}
          autoFocus
        />
        {error && <div style={{ color: '#E07A5F', fontSize: 13, marginTop: 8 }}>パスワードが違います</div>}
        <button
          onClick={submit}
          style={{
            width: '100%', marginTop: 16, padding: '12px 0', fontSize: 15, fontWeight: 700,
            background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer',
          }}
        >
          開く
        </button>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthGate>
      <BrowserRouter>
        <TicketStoreProvider>
          <App />
        </TicketStoreProvider>
      </BrowserRouter>
    </AuthGate>
  </StrictMode>
);
