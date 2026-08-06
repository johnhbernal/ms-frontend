import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout, getUsername, isAdminNavVisible, canSeeInventory } from '../services/authService';
import { useSessionRenew } from '../hooks/useSessionRenew';
import LanguageSwitcher from './LanguageSwitcher';

const ShieldIcon = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z"
      fill="white" fillOpacity="0.9" />
  </svg>
);

const SettingsIcon = () => (
  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogOutIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const WarnIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const CheckIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

function SessionBanner({ phase, secLeft }) {
  const { t } = useTranslation();
  if (phase === 'ok' || phase === 'renewing') return null;
  const isWarning = phase === 'warning';
  return (
    <div style={{
      padding: '9px 32px',
      background: isWarning ? '#fef3c7' : '#d1fae5',
      borderBottom: `1px solid ${isWarning ? '#fcd34d' : '#6ee7b7'}`,
      color: isWarning ? '#92400e' : '#065f46',
      fontSize: 13,
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      flexShrink: 0,
    }}>
      {isWarning ? <WarnIcon /> : <CheckIcon />}
      {isWarning ? t('session.expiresIn', { seconds: secLeft }) : t('session.renewed')}
    </div>
  );
}

const UsersIcon = () => (
  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FolderIcon = () => (
  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

function AppShell({ children }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { phase, secLeft } = useSessionRenew();
  const showAdmin = isAdminNavVisible();
  const showInventory = canSeeInventory();
  const path = location.pathname;

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
            {t('app.name')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'white' }}>
          <LanguageSwitcher compact />
          <div style={{
            fontSize: 12, color: 'var(--slate-400)',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px 10px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {t('nav.signedInAs')}: {getUsername()}
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
            {t('nav.logout')}
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
          <NavItem
            icon={<SettingsIcon />}
            label={t('nav.parameters')}
            active={path === '/'}
            onClick={() => navigate('/')}
          />
          {showInventory && (
            <NavItem
              icon={<FolderIcon />}
              label={t('nav.inventory')}
              active={path === '/inventario'}
              onClick={() => navigate('/inventario')}
            />
          )}
          {showAdmin && (
            <NavItem
              icon={<UsersIcon />}
              label={t('nav.admin')}
              active={path.startsWith('/admin')}
              onClick={() => navigate('/admin/rbac')}
            />
          )}
          <NavItem
            icon={<FolderIcon />}
            label={t('nav.directory')}
            active={path === '/directory/me'}
            onClick={() => navigate('/directory/me')}
          />
        </nav>

        {/* Content */}
        <main style={{
          flex: 1,
          background: 'var(--slate-50)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <SessionBanner phase={phase} secLeft={secLeft} />
          <div style={{ padding: '28px 32px', flex: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      aria-current={active ? 'page' : undefined}
      style={{
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
        outline: 'none',
      }}
      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--blue-600)'; }}
      onBlur={(e)  => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <span aria-hidden="true" style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
      {label}
    </div>
  );
}

export default AppShell;
