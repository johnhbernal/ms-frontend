import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { login, saveToken } from '../services/authService';

const schema = yup.object({
  username: yup.string().required('El usuario es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres'),
});

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
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(data.username, data.password);
      saveToken(res.data.sessionToken);
      navigate('/');
    } catch (err) {
      setErrorMsg(
        err.response?.status < 500
          ? err.response?.data?.description || 'Error de conexión'
          : 'Error de conexión'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Brand panel ──────────────────────────────────────── */}
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
      }}>
        {/* subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--slate-400) 1px, transparent 1px), linear-gradient(90deg, var(--slate-400) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '280px' }}>
          {/* logo mark */}
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
            MS Practica
          </h1>
          <p style={{ color: 'var(--slate-400)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
            Gestión de Parámetros del Sistema
          </p>

          {/* divider */}
          <div style={{ margin: '36px auto', width: 40, height: 1, background: 'var(--slate-700)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Seguro', 'Rápido', 'Confiable'].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(37,99,235,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="var(--blue-200)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ color: 'var(--slate-400)', fontSize: '13px' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form panel ──────────────────────────────────────── */}
      <div style={{
        flex: 1,
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Iniciar sesión
            </h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '13.5px', margin: 0 }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-4">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. admin"
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

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  isInvalid={!!errors.password}
                  disabled={loading}
                  style={{ paddingRight: '2.75rem' }}
                  {...register('password')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: 'absolute', right: 11,
                    top: errors.password ? '34%' : '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', padding: 0,
                    color: 'var(--slate-400)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                    transition: 'color var(--t-fast)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--slate-600)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--slate-400)'}
                >
                  <EyeIcon open={showPassword} />
                </button>
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <Form.Check
                type="checkbox"
                id="remember"
                label="Recordarme"
                disabled={loading}
                style={{ fontSize: '13px', color: 'var(--slate-600)' }}
                {...register('remember')}
              />
            </div>

            {errorMsg && (
              <Alert variant="danger" className="mb-4">
                {errorMsg}
              </Alert>
            )}

            <Button type="submit" variant="primary" className="w-100" style={{ padding: '10px 14px' }} disabled={loading}>
              {loading ? (
                <><Spinner size="sm" className="me-2" animation="border" />Iniciando sesión...</>
              ) : (
                'Ingresar'
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
