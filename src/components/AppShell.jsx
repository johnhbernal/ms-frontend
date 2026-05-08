import { useNavigate } from 'react-router-dom';
import { logout, getUsername } from '../services/authService';

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z"
      fill="white" fillOpacity="0.9" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

function AppShell({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header style={{
        background: 'var(--slate-900)',
        height: 52,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 1px 0 rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <ShieldIcon />
          <span style={{ color: 'white', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>
            MS Practica
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            fontSize: 12, color: 'var(--slate-400)',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px 10px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {getUsername()}
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--slate-400)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px',
              cursor: 'pointer',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'color var(--t-fast), border-color var(--t-fast), background var(--t-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--slate-400)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.background = 'none';
            }}
          >
            <LogOutIcon />
            Salir
          </button>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <nav style={{
          width: 192,
          background: 'var(--slate-800)',
          flexShrink: 0,
          paddingTop: 16,
        }}>
          <div style={{
            padding: '0 16px 8px',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--slate-500)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Menú
          </div>

          <NavItem icon={<SettingsIcon />} label="Parámetros" active />
        </nav>

        {/* Content */}
        <main style={{
          flex: 1,
          background: 'var(--slate-50)',
          padding: '28px 32px',
          overflowY: 'auto',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '9px 16px',
      margin: '2px 8px',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: active ? 600 : 400,
      color: active ? 'white' : 'var(--slate-400)',
      background: active ? 'rgba(37,99,235,0.25)' : 'transparent',
      borderLeft: active ? '2px solid var(--blue-600)' : '2px solid transparent',
      transition: 'all var(--t-fast)',
    }}>
      <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
      {label}
    </div>
  );
}

export default AppShell;
