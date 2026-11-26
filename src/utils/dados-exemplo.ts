import type { DadosColeta, StatusColeta, TipoResiduo } from '@/types/coleta';
import { TIPOS_RESIDUO } from '@/types/coleta';

// Dados FICTÍCIOS para demonstrar o sistema (o desafio pede para não usar empresas reais)
const CLIENTES = [
  'Mercado Boa Compra',
  'Fábrica Alfa Embalagens',
  'Escritório Central Contábil',
  'Padaria Pão Dourado',
  'Indústria Beta Metais',
  'Restaurante Sabor da Serra',
  'Oficina Roda Viva',
  'Condomínio Jardim das Flores',
];

// Peso típico (kg) de cada tipo de resíduo, só para os exemplos parecerem reais
const PESO_BASE: Record<TipoResiduo, number> = {
  Papelão: 900,
  Plástico: 600,
  Metal: 1400,
  Vidro: 500,
  Óleo: 200,
  Eletrônico: 120,
};

// Gera coletas dos últimos 6 meses até o próximo, sempre iguais (sem sorteio)
export function gerarDadosExemplo(hoje: Date = new Date()): DadosColeta[] {
  const coletas: DadosColeta[] = [];

  for (let i = 0; i < 36; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - 6, 3);
    data.setDate(data.getDate() + i * 6); // uma coleta a cada 6 dias

    const tipoResiduo = TIPOS_RESIDUO[i % TIPOS_RESIDUO.length] as TipoResiduo;
    const dataColeta = formatarISO(data);
    const noFuturo = data > hoje;

    let status: StatusColeta = 'Realizada';
    if (noFuturo || i % 9 === 4) status = 'Agendada'; // algumas agendadas já vencidas
    if (!noFuturo && i % 11 === 7) status = 'Cancelada';

    coletas.push({
      cliente: CLIENTES[i % CLIENTES.length] as string,
      tipoResiduo,
      pesoKg: PESO_BASE[tipoResiduo] + ((i * 137) % 400),
      dataColeta,
      status,
      observacao: i % 5 === 0 ? 'Retirar pela doca 2' : '',
    });
  }

  return coletas;
}

function formatarISO(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}
