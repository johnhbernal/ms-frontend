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

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(data.username, data.password);
      saveToken(res.data.token, data.remember);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.description || 'Error de conexión';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left panel — Corporate Blue gradient */}
      <div
        style={{
          background: 'linear-gradient(160deg, #1e3a5f, #2563eb)',
          width: '40%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '2rem',
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: '1.5rem' }}
        >
          <path
            d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z"
            fill="rgba(255,255,255,0.9)"
          />
        </svg>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          MS Practica
        </h1>
        <p style={{ fontSize: '0.95rem', opacity: 0.85, textAlign: 'center', margin: 0 }}>
          Gestión de Parámetros del Sistema
        </p>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          background: '#f0f4ff',
          width: '60%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px', padding: '2rem' }}>
          <h2 style={{ color: '#1e3a5f', fontWeight: 700, marginBottom: '1.5rem' }}>
            Iniciar Sesión
          </h2>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su usuario"
                isInvalid={!!errors.username}
                disabled={loading}
                {...register('username')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  isInvalid={!!errors.password}
                  disabled={loading}
                  style={{ paddingRight: '3rem' }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: errors.password ? '30%' : '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#6c757d',
                    fontSize: '1rem',
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                label="Recordarme"
                disabled={loading}
                {...register('remember')}
              />
            </Form.Group>

            {errorMsg && (
              <Alert variant="danger" className="py-2">
                {errorMsg}
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              style={{ background: '#2563eb', border: 'none', width: '100%' }}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Iniciando sesión...
                </>
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
