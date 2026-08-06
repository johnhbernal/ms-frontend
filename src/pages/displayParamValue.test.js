import { displayParamValue } from './ParametrosPage';

describe('displayParamValue', () => {
  it('masks secret-like parameter values', () => {
    expect(displayParamValue('MASTER_TOKEN_ADMIN', 'abc')).toBe('•••••••• (hidden)');
    expect(displayParamValue('API_SECRET', 'x', '•••••••• (oculto)')).toBe('•••••••• (oculto)');
  });

  it('returns plain value for normal parameters', () => {
    expect(displayParamValue('IVA_PORCENTAJE', '19')).toBe('19');
  });
});
