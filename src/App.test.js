import { render, screen } from '@testing-library/react';
import App from './App';

test('redirects unauthenticated users to login', () => {
  render(<App />);
  expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
});
