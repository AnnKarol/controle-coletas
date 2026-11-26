import type { Coleta, TipoResiduo } from '@/types/coleta';
import { kgParaToneladas } from '@/utils/formatacao';

// Todas as contas do painel ficam aqui, separadas da tela, para poder testar.

export interface Indicadores {
  total: number;
  realizadas: number;
  percentualRealizadas: number;
  agendadas: number;
  pesoDestinadoToneladas: number;
}

export interface ToneladasNoMes {
  mes: string; // '2026-11'
  toneladas: number;
}

export interface ParteDaComposicao {
  tipoResiduo: TipoResiduo;
  toneladas: number;
  percentual: number;
}

// '2026-11-25' -> '2026-11'
export function mesDaData(dataISO: string): string {
  return dataISO.slice(0, 7);
}

function somenteRealizadas(coletas: Coleta[]): Coleta[] {
  return coletas.filter((coleta) => coleta.status === 'Realizada');
}

function somarKg(coletas: Coleta[]): number {
  return coletas.reduce((soma, coleta) => soma + coleta.pesoKg, 0);
}

// Filtro de período (diferencial): mantém as coletas entre o mês inicial e o final
export function filtrarPorPeriodo(
  coletas: Coleta[],
  mesInicial: string | null,
  mesFinal: string | null,
): Coleta[] {
  return coletas.filter((coleta) => {
    const mes = mesDaData(coleta.dataColeta);
    const depoisDoInicio = !mesInicial || mes >= mesInicial;
    const antesDoFim = !mesFinal || mes <= mesFinal;
    return depoisDoInicio && antesDoFim;
  });
}

// Os quatro cartões do topo
export function calcularIndicadores(coletas: Coleta[]): Indicadores {
  const realizadas = somenteRealizadas(coletas);
  const total = coletas.length;
  return {
    total,
    realizadas: realizadas.length,
    percentualRealizadas: total === 0 ? 0 : (realizadas.length / total) * 100,
    agendadas: coletas.filter((coleta) => coleta.status === 'Agendada').length,
    pesoDestinadoToneladas: kgParaToneladas(somarKg(realizadas)),
  };
}

// Gráfico de barras: toneladas realizadas por mês, em ordem.
// Meses sem coleta no meio do caminho aparecem com zero, para o gráfico não "pular" meses.
export function toneladasPorMes(coletas: Coleta[]): ToneladasNoMes[] {
  const kgPorMes = new Map<string, number>();
  for (const coleta of somenteRealizadas(coletas)) {
    const mes = mesDaData(coleta.dataColeta);
    kgPorMes.set(mes, (kgPorMes.get(mes) ?? 0) + coleta.pesoKg);
  }

  const meses = [...kgPorMes.keys()].sort();
  const primeiro = meses[0];
  const ultimo = meses[meses.length - 1];
  if (!primeiro || !ultimo) {
    return [];
  }

  const resultado: ToneladasNoMes[] = [];
  for (let mes = primeiro; mes <= ultimo; mes = proximoMes(mes)) {
    resultado.push({ mes, toneladas: kgParaToneladas(kgPorMes.get(mes) ?? 0) });
  }
  return resultado;
}

// '2026-12' -> '2027-01'
export function proximoMes(anoMes: string): string {
  const [ano, mes] = anoMes.split('-').map(Number) as [number, number];
  const data = new Date(ano, mes, 1); // o mês do Date começa em 0, então "mes" já é o próximo
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

// Composição por resíduo: do tipo com mais peso para o de menos peso (só realizadas)
export function composicaoPorResiduo(coletas: Coleta[]): ParteDaComposicao[] {
  const realizadas = somenteRealizadas(coletas);
  const totalKg = somarKg(realizadas);

  const kgPorTipo = new Map<TipoResiduo, number>();
  for (const coleta of realizadas) {
    kgPorTipo.set(coleta.tipoResiduo, (kgPorTipo.get(coleta.tipoResiduo) ?? 0) + coleta.pesoKg);
  }

  return [...kgPorTipo.entries()]
    .map(([tipoResiduo, kg]) => ({
      tipoResiduo,
      toneladas: kgParaToneladas(kg),
      percentual: totalKg === 0 ? 0 : (kg / totalKg) * 100,
    }))
    .sort((a, b) => b.toneladas - a.toneladas);
}

// Cartão "Precisa de atenção" (diferencial): agendadas cuja data já passou
export function coletasAtrasadas(coletas: Coleta[], hoje: string): Coleta[] {
  return coletas
    .filter((coleta) => coleta.status === 'Agendada' && coleta.dataColeta < hoje)
    .sort((a, b) => a.dataColeta.localeCompare(b.dataColeta));
}
