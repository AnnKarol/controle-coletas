import { describe, expect, it } from 'vitest';
import type { Coleta } from '@/types/coleta';
import {
  calcularIndicadores,
  coletasAtrasadas,
  composicaoPorResiduo,
  filtrarPorPeriodo,
  toneladasPorMes,
} from '@/utils/painel';
import { formatarPercentual, formatarToneladas } from '@/utils/formatacao';

// Cria uma coleta de teste preenchendo só o que importa em cada caso
function coleta(dados: Partial<Coleta>): Coleta {
  return {
    id: crypto.randomUUID(),
    cliente: 'Cliente Teste',
    tipoResiduo: 'Papelão',
    pesoKg: 1000,
    dataColeta: '2026-11-10',
    status: 'Realizada',
    observacao: '',
    ...dados,
  };
}

const coletas: Coleta[] = [
  coleta({ tipoResiduo: 'Papelão', pesoKg: 2000, dataColeta: '2026-09-05' }),
  coleta({ tipoResiduo: 'Metal', pesoKg: 6000, dataColeta: '2026-11-12' }),
  coleta({ tipoResiduo: 'Papelão', pesoKg: 2000, dataColeta: '2026-11-20' }),
  coleta({ status: 'Agendada', pesoKg: 500, dataColeta: '2026-11-01' }),
  coleta({ status: 'Cancelada', pesoKg: 700, dataColeta: '2026-10-15' }),
];

describe('calcularIndicadores', () => {
  it('conta coletas, realizadas, agendadas e soma o peso só das realizadas', () => {
    const indicadores = calcularIndicadores(coletas);
    expect(indicadores.total).toBe(5);
    expect(indicadores.realizadas).toBe(3);
    expect(indicadores.percentualRealizadas).toBe(60);
    expect(indicadores.agendadas).toBe(1);
    expect(indicadores.pesoDestinadoToneladas).toBe(10); // 2000 + 6000 + 2000 kg
  });

  it('não divide por zero quando não há coletas', () => {
    expect(calcularIndicadores([]).percentualRealizadas).toBe(0);
  });
});

describe('toneladasPorMes', () => {
  it('soma por mês, em ordem, preenchendo meses vazios com zero', () => {
    expect(toneladasPorMes(coletas)).toEqual([
      { mes: '2026-09', toneladas: 2 },
      { mes: '2026-10', toneladas: 0 },
      { mes: '2026-11', toneladas: 8 },
    ]);
  });
});

describe('composicaoPorResiduo', () => {
  it('ordena do tipo com mais peso para o de menos peso, com percentual', () => {
    expect(composicaoPorResiduo(coletas)).toEqual([
      { tipoResiduo: 'Metal', toneladas: 6, percentual: 60 },
      { tipoResiduo: 'Papelão', toneladas: 4, percentual: 40 },
    ]);
  });
});

describe('filtros do painel', () => {
  it('filtra pelo período de meses', () => {
    expect(filtrarPorPeriodo(coletas, '2026-10', '2026-10')).toHaveLength(1);
    expect(filtrarPorPeriodo(coletas, '2026-11', null)).toHaveLength(3);
  });

  it('lista agendadas com a data vencida', () => {
    expect(coletasAtrasadas(coletas, '2026-11-25')).toHaveLength(1);
    expect(coletasAtrasadas(coletas, '2026-10-01')).toHaveLength(0);
  });
});

describe('formato brasileiro', () => {
  it('mostra toneladas e percentual como pede o desafio', () => {
    expect(formatarToneladas(12.48)).toBe('12,48 t');
    expect(formatarPercentual(63.66)).toBe('63,7%');
  });
});
