import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Coleta, DadosColeta } from '@/types/coleta';
import { gerarDadosExemplo } from '@/utils/dados-exemplo';

// Nome da "gaveta" onde as coletas ficam guardadas no navegador
const CHAVE_STORAGE = 'ecocoleta:coletas';

// Lê as coletas salvas no navegador. Se não houver nada, começa com a lista vazia.
function carregarDoNavegador(): Coleta[] {
  const salvo = localStorage.getItem(CHAVE_STORAGE);
  if (!salvo) {
    return [];
  }
  try {
    return JSON.parse(salvo) as Coleta[];
  } catch {
    return []; // dado corrompido: começa do zero em vez de quebrar a tela
  }
}

export const useColetasStore = defineStore('coletas', {
  // state: os dados guardados
  state: () => ({
    coletas: carregarDoNavegador(),
  }),

  // getters: dados calculados a partir do state
  getters: {
    // Da mais recente para a mais antiga (requisito 3)
    coletasOrdenadas: (state) =>
      [...state.coletas].sort((a, b) => b.dataColeta.localeCompare(a.dataColeta)),
  },

  // actions: as ações que mudam os dados
  actions: {
    adicionar(dados: DadosColeta) {
      this.coletas.push({ id: crypto.randomUUID(), ...dados });
      this.salvar();
    },

    atualizar(id: string, dados: DadosColeta) {
      const posicao = this.coletas.findIndex((coleta) => coleta.id === id);
      if (posicao === -1) {
        return;
      }
      this.coletas[posicao] = { id, ...dados };
      this.salvar();
    },

    // Preenche com dados fictícios para demonstração
    carregarExemplos() {
      for (const dados of gerarDadosExemplo()) {
        this.coletas.push({ id: crypto.randomUUID(), ...dados });
      }
      this.salvar();
    },

    excluir(id: string) {
      this.coletas = this.coletas.filter((coleta) => coleta.id !== id);
      this.salvar();
    },

    // Grava a lista no navegador, para não perder ao recarregar a página (requisito 7)
    salvar() {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(this.coletas));
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useColetasStore, import.meta.hot));
}
