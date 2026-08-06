import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { login, saveToken, saveExpiresAt } from '../services/authService';
import LanguageSwitcher from '../components/LanguageSwitcher';

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const resetSuccess = location.state?.resetSuccess;
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const schema = useMemo(
    () =>
      yup.object({
        username: yup.string().required(t('login.usernameRequired')),
        password: yup
          .string()
          .required(t('login.passwordRequired'))
          .min(8, t('login.passwordMin')),
      }),
    [t],
  );

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(data.username, data.password);
      sessionStorage.clear();
      saveToken(res.data.sessionToken);
      if (res.data.expiresAtMs) saveExpiresAt(res.data.expiresAtMs);
      navigate('/');
    } catch (err) {
      setErrorMsg(
        err.response?.status < 500
          ? err.response?.data?.description || t('login.error')
          : t('login.error'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div style={{
        width: '42%',
        background: 'var(--slate-900)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--slate-400) 1px, transparent 1px), linear-gradient(90deg, var(--slate-400) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <LanguageSwitcher compact />
        </div>

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 300 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--blue-600), #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z"
                fill="white" fillOpacity="0.95" />
            </svg>
          </div>

          <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            {t('app.name')}
          </h1>
          <p style={{ color: 'var(--slate-400)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
            {t('app.tagline')}
          </p>

          <div style={{ margin: '36px auto', width: 40, height: 1, background: 'var(--slate-700)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
            <span style={{ color: 'var(--slate-400)', fontSize: 13 }}>{t('login.authN')}</span>
            <span style={{ color: 'var(--slate-400)', fontSize: 13 }}>{t('login.authZ')}</span>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              {t('login.title')}
            </h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '13.5px', margin: 0 }}>
              {t('login.subtitle')}
            </p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {resetSuccess && (
              <Alert variant="success" className="mb-4">{t('login.resetOk')}</Alert>
            )}
            <Form.Group className="mb-4" controlId="username">
              <Form.Label>{t('login.username')}</Form.Label>
              <Form.Control
                id="username"
                type="text"
                autoComplete="username"
                autoFocus
                isInvalid={!!errors.username}
                disabled={loading}
                {...register('username')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>{t('login.password')}</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  isInvalid={!!errors.password}
                  disabled={loading}
                  style={{ paddingRight: '2.75rem' }}
                  {...register('password')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={t('login.password')}
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: 'absolute', right: 11,
                    top: errors.password ? '34%' : '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', padding: 0,
                    color: 'var(--slate-400)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <EyeIcon open={showPassword} />
                </button>
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            {errorMsg && <Alert variant="danger" className="mb-4">{errorMsg}</Alert>}

            <Button type="submit" variant="primary" className="w-100" style={{ padding: '10px 14px' }} disabled={loading}>
              {loading ? (
                <><Spinner size="sm" className="me-2" animation="border" />{t('common.loading')}</>
              ) : (
                t('login.submit')
              )}
            </Button>

            <div className="text-center mt-3">
              <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--blue-600)' }}>
                {t('login.forgot')}
              </Link>
            </div>

            <p style={{
              marginTop: 20, fontSize: 12, color: 'var(--slate-500)',
              lineHeight: 1.5, background: 'var(--slate-50)',
              borderRadius: 8, padding: '10px 12px', border: '1px solid var(--slate-200)',
            }}>
              {t('login.demoHint')}
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
