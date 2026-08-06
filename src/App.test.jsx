import { render, screen } from '@testing-library/react';
import i18n from './i18n';
import App from './App';

beforeEach(async () => {
  await i18n.changeLanguage('es-CO');
});

test('redirects unauthenticated users to login', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
});

test('english locale switches login title', async () => {
  await i18n.changeLanguage('en');
  render(<App />);
  expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument();
});

test('setAppLanguage persists english and updates document lang', async () => {
  const { setAppLanguage } = await import('./i18n');
  await setAppLanguage('en');
  expect(i18n.language).toMatch(/^en/);
  expect(document.documentElement.lang).toBe('en');
  expect(i18n.t('parameters.title')).toMatch(/system parameters/i);
  await setAppLanguage('es-CO');
  expect(i18n.t('parameters.title')).toMatch(/parámetros/i);
});
