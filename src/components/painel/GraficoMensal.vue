<template>
  <div class="cartao q-pa-md">
    <div class="text-subtitle1 text-weight-medium">Evolução mensal</div>
    <div class="texto-secundario text-caption q-mb-md">Toneladas destinadas por mês</div>

    <div v-if="meses.length === 0" class="texto-secundario q-py-xl text-center">
      Nenhuma coleta realizada no período.
    </div>

    <!-- Gráfico de barras feito só com HTML e CSS -->
    <div v-else class="grafico">
      <div v-for="item in meses" :key="item.mes" class="grafico__coluna">
        <div class="grafico__valor">{{ formatarToneladas(item.toneladas) }}</div>
        <div class="grafico__barra" :style="{ height: alturaDaBarra(item.toneladas) }" />
        <div class="grafico__mes">{{ formatarMes(item.mes) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ToneladasNoMes } from '@/utils/painel';
import { formatarMes, formatarToneladas } from '@/utils/formatacao';

const props = defineProps<{ meses: ToneladasNoMes[] }>();

// A barra mais alta ocupa 100% da altura; as outras são proporcionais
const maior = computed(() => Math.max(...props.meses.map((item) => item.toneladas), 0));

function alturaDaBarra(toneladas: number): string {
  if (maior.value === 0) return '0%';
  return `${(toneladas / maior.value) * 100}%`;
}
</script>

<style scoped lang="scss">
.grafico {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 240px;
  overflow-x: auto;
  padding-top: 24px;
}

.grafico__coluna {
  flex: 1 0 48px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.grafico__valor {
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  margin-bottom: 4px;
}

.grafico__barra {
  width: 70%;
  max-width: 56px;
  background: $primary;
  border-radius: 4px 4px 0 0;
  min-height: 2px;
}

.grafico__mes {
  font-size: 11px;
  color: #727376;
  margin-top: 6px;
  border-top: 1px solid #ececec;
  width: 100%;
  text-align: center;
  padding-top: 4px;
}
</style>
