import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh',
      background: 'var(--slate-50)', color: 'var(--slate-700)',
    }}>
      <p style={{ fontSize: 48, fontWeight: 700, margin: '0 0 4px', color: 'var(--slate-200)' }}>
        404
      </p>
      <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>
        {t('notFound.title')}
      </p>
      <p style={{ fontSize: 13, color: 'var(--slate-400)', margin: '0 0 20px' }}>
        {t('notFound.subtitle')}
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '8px 18px', borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--slate-200)', background: 'white',
          cursor: 'pointer', fontSize: 13, fontWeight: 500,
        }}
      >
        {t('notFound.home')}
      </button>
    </div>
  );
}

export default NotFoundPage;
