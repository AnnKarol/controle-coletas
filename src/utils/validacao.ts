import { date } from 'quasar';
import { STATUS_COLETA, TIPOS_RESIDUO } from '@/types/coleta';
import type { StatusColeta, TipoResiduo } from '@/types/coleta';

// O que o formulário guarda enquanto a pessoa preenche.
// Alguns campos começam vazios (null) até a pessoa escolher.
export interface FormularioColeta {
  cliente: string;
  tipoResiduo: TipoResiduo | null;
  pesoKg: number | null;
  dataColeta: string;
  status: StatusColeta | null;
  observacao: string;
}

// Uma mensagem de erro para cada campo inválido
export type ErrosColeta = Partial<Record<keyof FormularioColeta, string>>;

// Data de hoje no formato AAAA-MM-DD, no fuso do computador
export function hojeISO(): string {
  return date.formatDate(Date.now(), 'YYYY-MM-DD');
}

// Aplica as regras do modelo de dados do desafio.
// Recebe "hoje" como parâmetro para facilitar os testes automatizados.
export function validarColeta(form: FormularioColeta, hoje: string = hojeISO()): ErrosColeta {
  const erros: ErrosColeta = {};

  if (form.cliente.trim().length < 3) {
    erros.cliente = 'Informe o cliente com pelo menos 3 caracteres.';
  }

  if (!form.tipoResiduo || !TIPOS_RESIDUO.includes(form.tipoResiduo)) {
    erros.tipoResiduo = 'Escolha o tipo de resíduo.';
  }

  if (form.pesoKg === null || !(form.pesoKg > 0)) {
    erros.pesoKg = 'Informe um peso maior que zero.';
  }

  if (!form.status || !STATUS_COLETA.includes(form.status)) {
    erros.status = 'Escolha o status.';
  }

  if (!form.dataColeta) {
    erros.dataColeta = 'Informe a data da coleta.';
  } else if (form.status === 'Realizada' && form.dataColeta > hoje) {
    erros.dataColeta = 'Uma coleta realizada não pode ter data futura.';
  }

  return erros;
}
