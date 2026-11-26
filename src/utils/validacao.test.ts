import { describe, expect, it } from 'vitest';
import { validarColeta } from '@/utils/validacao';
import type { FormularioColeta } from '@/utils/validacao';

const HOJE = '2026-11-25';

// Um formulário válido, que cada teste modifica só no campo que quer testar
function formularioValido(): FormularioColeta {
  return {
    cliente: 'Mercado Boa Compra',
    tipoResiduo: 'Papelão',
    pesoKg: 120,
    dataColeta: '2026-11-20',
    status: 'Realizada',
    observacao: '',
  };
}

describe('validarColeta', () => {
  it('não acusa erro quando todos os campos estão certos', () => {
    expect(validarColeta(formularioValido(), HOJE)).toEqual({});
  });

  it('exige cliente com pelo menos 3 caracteres, ignorando espaços', () => {
    const erros = validarColeta({ ...formularioValido(), cliente: '  ab  ' }, HOJE);
    expect(erros.cliente).toBeDefined();
  });

  it('exige peso maior que zero', () => {
    expect(validarColeta({ ...formularioValido(), pesoKg: 0 }, HOJE).pesoKg).toBeDefined();
    expect(validarColeta({ ...formularioValido(), pesoKg: -5 }, HOJE).pesoKg).toBeDefined();
    expect(validarColeta({ ...formularioValido(), pesoKg: null }, HOJE).pesoKg).toBeDefined();
  });

  it('não aceita data futura quando o status é Realizada', () => {
    const erros = validarColeta({ ...formularioValido(), dataColeta: '2026-12-01' }, HOJE);
    expect(erros.dataColeta).toBe('Uma coleta realizada não pode ter data futura.');
  });

  it('aceita data futura quando o status é Agendada', () => {
    const form: FormularioColeta = {
      ...formularioValido(),
      dataColeta: '2026-12-01',
      status: 'Agendada',
    };
    expect(validarColeta(form, HOJE)).toEqual({});
  });

  it('exige tipo de resíduo e status', () => {
    const erros = validarColeta({ ...formularioValido(), tipoResiduo: null, status: null }, HOJE);
    expect(erros.tipoResiduo).toBeDefined();
    expect(erros.status).toBeDefined();
  });
});
