import { useEffect, useState } from 'react';
import { Alert, Badge, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getDirectoryMe } from '../services/rbacService';

function TagList({ title, items, variant = 'secondary' }) {
  if (!items?.length) {
    return (
      <div className="mb-3">
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate-500)', marginBottom: 6 }}>{title}</div>
        <span style={{ color: 'var(--slate-400)', fontSize: 13 }}>—</span>
      </div>
    );
  }
  return (
    <div className="mb-3">
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate-500)', marginBottom: 6 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {items.map((item) => (
          <Badge key={item} bg={variant} style={{ fontWeight: 500 }}>{item}</Badge>
        ))}
      </div>
    </div>
  );
}

function DirectoryMePage() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDirectoryMe()
      .then(setData)
      .catch((err) => setError(err.response?.data?.description || t('common.error')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>{t('directory.title')}</h2>
      <p style={{ color: 'var(--slate-500)', fontSize: 14, marginBottom: 24 }}>
        {t('directory.subtitle')}
      </p>

      <div style={{ background: 'white', borderRadius: 10, border: '1px solid var(--slate-200)', padding: '1.25rem 1.5rem', maxWidth: 640 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{data.fullName || data.username}</div>
          <div style={{ color: 'var(--slate-500)', fontSize: 13 }}>{data.email}</div>
          {data.distinguishedName && (
            <div style={{ color: 'var(--slate-400)', fontSize: 12, marginTop: 4, fontFamily: 'monospace' }}>
              {t('directory.dn')}: {data.distinguishedName}
            </div>
          )}
        </div>

        <TagList title={t('directory.primaryRole')} items={data.primaryRole ? [data.primaryRole] : []} variant="primary" />
        <TagList title={t('directory.groups')} items={data.groups || data.memberOf} variant="info" />
        <TagList title={t('directory.roles')} items={data.roles} variant="success" />
        <TagList title={t('directory.permissions')} items={data.permissions} variant="dark" />
      </div>
    </div>
  );
}

export default DirectoryMePage;
