import type { Coleta, StatusColeta, TipoResiduo } from '@/types/coleta';

// Filtros da lista. null quer dizer "todos".
export interface FiltrosColeta {
  status: StatusColeta | null;
  tipoResiduo: TipoResiduo | null;
  busca: string;
}

// Deixa o texto em minúsculas e sem acentos, para "Joao" encontrar "João"
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

// Devolve só as coletas que passam em todos os filtros ao mesmo tempo
export function filtrarColetas(coletas: Coleta[], filtros: FiltrosColeta): Coleta[] {
  const busca = normalizar(filtros.busca);

  return coletas.filter((coleta) => {
    const passaStatus = !filtros.status || coleta.status === filtros.status;
    const passaTipo = !filtros.tipoResiduo || coleta.tipoResiduo === filtros.tipoResiduo;
    const passaBusca = !busca || normalizar(coleta.cliente).includes(busca);
    return passaStatus && passaTipo && passaBusca;
  });
}
