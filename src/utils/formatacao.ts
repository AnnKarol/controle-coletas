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
