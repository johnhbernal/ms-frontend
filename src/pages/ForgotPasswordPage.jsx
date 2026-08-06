import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from '../services/authService';
import LanguageSwitcher from '../components/LanguageSwitcher';

function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const schema = useMemo(
    () =>
      yup.object({
        email: yup.string().email().required(t('forgot.emailRequired')),
      }),
    [t],
  );

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await forgotPassword(data.email);
      setSuccessMsg(t('forgot.success'));
    } catch {
      setErrorMsg(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 24px rgba(15,23,42,0.08)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <LanguageSwitcher compact />
        </div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 6 }}>{t('forgot.title')}</h1>
        <p style={{ color: 'var(--slate-500)', fontSize: 14, marginBottom: 24 }}>
          {t('forgot.subtitle')}
        </p>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>{t('forgot.email')}</Form.Label>
            <Form.Control type="email" autoComplete="email" isInvalid={!!errors.email} disabled={loading} {...register('email')} />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          {successMsg && <Alert variant="success">{successMsg}</Alert>}
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : t('forgot.submit')}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Link to="/login" style={{ fontSize: 13 }}>{t('forgot.back')}</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
