import { useNavigate } from 'react-router-dom';
import { logout, getUsername } from '../services/authService';

function AppShell({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{
        background: 'linear-gradient(160deg, #1e3a5f, #2563eb)',
        color: 'white',
        padding: '0 24px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z" fill="rgba(255,255,255,0.9)" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>MS Practica</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
          <span style={{ opacity: 0.85 }}>{getUsername()}</span>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontSize: '12px' }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '180px', background: '#1e2d3d', color: 'white', flexShrink: 0, paddingTop: '16px' }}>
          <div style={{ padding: '6px 16px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '4px' }}>
            MENÚ
          </div>
          <div style={{ padding: '10px 16px', background: '#2563eb', fontSize: '13px', fontWeight: 600, borderLeft: '3px solid white' }}>
            ⚙ Parámetros
          </div>
        </div>

        <div style={{ flex: 1, background: '#f0f4ff', padding: '24px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AppShell;
