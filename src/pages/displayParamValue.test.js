import { displayParamValue } from './ParametrosPage';

describe('displayParamValue', () => {
  it('masks master tokens and secrets', () => {
    expect(displayParamValue('MASTER_TOKEN_ADMIN', 'abc')).toBe('•••••••• (oculto)');
    expect(displayParamValue('API_SECRET', 'x')).toBe('•••••••• (oculto)');
  });

  it('shows normal values', () => {
    expect(displayParamValue('IVA_PORCENTAJE', '19')).toBe('19');
  });
});
