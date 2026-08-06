import { useTranslation } from 'react-i18next';
import { setAppLanguage, SUPPORTED_LANGS } from '../i18n';

/**
 * Locale toggle: es-CO (default) ↔ en.
 * Persists in localStorage key practica.lang.
 */
export default function LanguageSwitcher({ compact = false }) {
  const { t, i18n } = useTranslation();
  const current = i18n.language?.startsWith('en') ? 'en' : 'es-CO';

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: compact ? 12 : 13,
        color: 'inherit',
        margin: 0,
      }}
    >
      {!compact && <span style={{ opacity: 0.75 }}>{t('app.language')}</span>}
      <select
        aria-label={t('app.language')}
        value={current}
        onChange={(e) => setAppLanguage(e.target.value)}
        style={{
          border: '1px solid rgba(148,163,184,0.45)',
          borderRadius: 6,
          padding: compact ? '2px 6px' : '4px 8px',
          background: 'transparent',
          color: 'inherit',
          fontSize: 'inherit',
          cursor: 'pointer',
        }}
      >
        {SUPPORTED_LANGS.map((l) => (
          <option key={l.code} value={l.code} style={{ color: '#0f172a' }}>
            {t(l.labelKey)}
          </option>
        ))}
      </select>
    </label>
  );
}
