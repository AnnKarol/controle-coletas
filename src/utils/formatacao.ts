// Funções que mostram os números e as datas no formato brasileiro

// '2026-11-25' -> '25/11/2026'
export function formatarData(dataISO: string): string {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// 1234.5 -> '1.234,5 kg'
export function formatarKg(pesoKg: number): string {
  return `${pesoKg.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`;
}

// 12480 kg -> 12.48 (toneladas)
export function kgParaToneladas(pesoKg: number): number {
  return pesoKg / 1000;
}

// 12.48 -> '12,48 t'
export function formatarToneladas(toneladas: number): string {
  const numero = toneladas.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${numero} t`;
}

// 63.66 -> '63,7%'
export function formatarPercentual(percentual: number): string {
  const numero = percentual.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `${numero}%`;
}

// '2026-11' -> 'nov/26'
export function formatarMes(anoMes: string): string {
  const nomes = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ];
  const [ano = '', mes = '1'] = anoMes.split('-');
  return `${nomes[Number(mes) - 1]}/${ano.slice(2)}`;
}
