import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../services/authService';
import LanguageSwitcher from '../components/LanguageSwitcher';

const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const schema = useMemo(
    () =>
      yup.object({
        newPassword: yup
          .string()
          .required(t('login.passwordRequired'))
          .min(8, t('login.passwordMin'))
          .matches(PASSWORD_RULE, t('login.passwordMin')),
        confirmPassword: yup
          .string()
          .required(t('reset.confirm'))
          .oneOf([yup.ref('newPassword')], t('reset.mismatch')),
      }),
    [t],
  );

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { token: tokenFromUrl },
  });

  const onSubmit = async (data) => {
    const token = data.token || tokenFromUrl;
    if (!token) {
      setErrorMsg(t('reset.tokenMissing'));
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await resetPassword(token, data.newPassword);
      navigate('/login', { state: { resetSuccess: true } });
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
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 6 }}>{t('reset.title')}</h1>

        <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          {!tokenFromUrl && (
            <Form.Group className="mb-3" controlId="token">
              <Form.Label>Token</Form.Label>
              <Form.Control type="text" disabled={loading} {...register('token')} />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>{t('reset.password')}</Form.Label>
            <Form.Control type="password" autoComplete="new-password" isInvalid={!!errors.newPassword} disabled={loading} {...register('newPassword')} />
            <Form.Control.Feedback type="invalid">{errors.newPassword?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>{t('reset.confirm')}</Form.Label>
            <Form.Control type="password" autoComplete="new-password" isInvalid={!!errors.confirmPassword} disabled={loading} {...register('confirmPassword')} />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
          </Form.Group>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : t('reset.submit')}
          </Button>
        </Form>

        <div className="text-center">
          <Link to="/login" style={{ fontSize: 13 }}>{t('forgot.back')}</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
