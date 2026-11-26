<template>
  <div class="cartao q-pa-md full-height">
    <div class="row items-center">
      <div class="text-subtitle1 text-weight-medium">Composição por resíduo</div>
      <q-space />
      <div class="texto-secundario text-caption">{{ formatarToneladas(totalToneladas) }}</div>
    </div>
    <div class="texto-secundario text-caption q-mb-md">Coletas realizadas</div>

    <div v-if="partes.length === 0" class="texto-secundario q-py-xl text-center">
      Nenhuma coleta realizada no período.
    </div>

    <div v-for="parte in partes" :key="parte.tipoResiduo" class="row items-center q-mb-sm">
      <div class="col-3 text-body2">{{ parte.tipoResiduo }}</div>
      <div class="col q-px-sm">
        <!-- trilho cinza com a barra laranja proporcional ao percentual -->
        <div class="trilho">
          <div class="trilho__barra" :style="{ width: `${parte.percentual}%` }" />
        </div>
      </div>
      <div class="col-auto text-right text-body2 text-weight-medium" style="width: 72px">
        {{ formatarToneladas(parte.toneladas) }}
      </div>
      <div class="col-auto text-right texto-secundario text-caption" style="width: 52px">
        {{ formatarPercentual(parte.percentual) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ParteDaComposicao } from '@/utils/painel';
import { formatarPercentual, formatarToneladas } from '@/utils/formatacao';

const props = defineProps<{ partes: ParteDaComposicao[] }>();

const totalToneladas = computed(() =>
  props.partes.reduce((soma, parte) => soma + parte.toneladas, 0),
);
</script>

<style scoped lang="scss">
.trilho {
  height: 8px;
  background: #ececec;
  border-radius: 4px;
  overflow: hidden;
}

.trilho__barra {
  height: 100%;
  background: $primary;
  border-radius: 4px;
}
</style>
