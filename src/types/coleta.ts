// Modelo de dados de uma coleta, conforme o desafio.

// Listas fixas. O "as const" faz o TypeScript tratar cada texto como um valor exato.
export const TIPOS_RESIDUO = [
  'Papelão',
  'Plástico',
  'Metal',
  'Vidro',
  'Óleo',
  'Eletrônico',
] as const;
export const STATUS_COLETA = ['Agendada', 'Realizada', 'Cancelada'] as const;

// Tipos criados a partir das listas: só aceitam um dos valores acima.
export type TipoResiduo = (typeof TIPOS_RESIDUO)[number];
export type StatusColeta = (typeof STATUS_COLETA)[number];

export interface Coleta {
  id: string; // gerado automaticamente
  cliente: string; // obrigatório, mínimo de 3 caracteres
  tipoResiduo: TipoResiduo;
  pesoKg: number; // obrigatório, maior que zero
  dataColeta: string; // formato AAAA-MM-DD
  status: StatusColeta;
  observacao: string; // opcional
}

// Os dados que o formulário envia: tudo, menos o id.
export type DadosColeta = Omit<Coleta, 'id'>;