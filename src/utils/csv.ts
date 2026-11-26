import type { Coleta } from '@/types/coleta';
import { formatarData } from '@/utils/formatacao';

// Coloca o texto entre aspas quando tem ; aspas ou quebra de linha, para não quebrar as colunas
function celula(valor: string): string {
  if (/[;"\n]/.test(valor)) {
    return `"${valor.replace(/"/g, '""')}"`;
  }
  return valor;
}

// Gera o CSV com ponto e vírgula, que é o separador que o Excel em português espera
export function gerarCsv(coletas: Coleta[]): string {
  const cabecalho = ['Data', 'Cliente', 'Tipo de resíduo', 'Peso (kg)', 'Status', 'Observação'];
  const linhas = coletas.map((coleta) => [
    formatarData(coleta.dataColeta),
    coleta.cliente,
    coleta.tipoResiduo,
    String(coleta.pesoKg).replace('.', ','),
    coleta.status,
    coleta.observacao,
  ]);
  return [cabecalho, ...linhas].map((linha) => linha.map(celula).join(';')).join('\n');
}
