<template>
  <q-page padding>
    <div class="row items-center q-my-md q-gutter-y-sm">
      <h1 class="text-h5 q-my-none">Painel</h1>
      <q-space />
      <!-- Filtro de período (diferencial): atualiza todo o painel -->
      <div class="row q-col-gutter-sm" style="min-width: 300px">
        <q-select
          v-model="mesInicial"
          :options="opcoesDeMes"
          emit-value
          map-options
          clearable
          outlined
          dense
          label="De"
          bg-color="white"
          class="col-6"
        />
        <q-select
          v-model="mesFinal"
          :options="opcoesDeMes"
          emit-value
          map-options
          clearable
          outlined
          dense
          label="Até"
          bg-color="white"
          class="col-6"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <CartaoIndicador
          titulo="Coletas"
          :valor="String(indicadores.total)"
          detalhe="cadastradas no período"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <CartaoIndicador
          titulo="Realizadas"
          :valor="String(indicadores.realizadas)"
          :detalhe="`${formatarPercentual(indicadores.percentualRealizadas)} do total`"
        >
          <q-linear-progress
            :value="indicadores.percentualRealizadas / 100"
            color="positive"
            track-color="grey-3"
            rounded
            size="8px"
            class="q-mt-sm"
          />
        </CartaoIndicador>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <CartaoIndicador
          titulo="Agendadas"
          :valor="String(indicadores.agendadas)"
          detalhe="aguardando coleta"
        >
          <template #selo>
            <q-badge v-if="indicadores.agendadas > 0" color="negative" label="atenção" />
          </template>
        </CartaoIndicador>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <CartaoIndicador
          titulo="Peso destinado"
          :valor="formatarToneladas(indicadores.pesoDestinadoToneladas)"
          detalhe="soma das coletas realizadas"
        />
      </div>

      <div class="col-12 col-md-7">
        <ComposicaoResiduos :partes="composicao" />
      </div>

      <!-- Cartão escuro "Precisa de atenção" (diferencial) -->
      <div class="col-12 col-md-5">
        <div class="cartao cartao--escuro q-pa-md full-height">
          <div class="row items-center">
            <div class="text-subtitle1 text-weight-medium">Precisa de atenção</div>
            <q-space />
            <q-badge v-if="atrasadas.length" color="negative" :label="atrasadas.length" />
          </div>
          <div class="text-caption text-grey-5 q-mb-sm">Agendadas com a data já vencida</div>

          <div v-if="atrasadas.length === 0" class="text-grey-5 q-py-lg text-center">
            Nenhuma coleta atrasada. 👍
          </div>
          <q-list v-else dark dense separator>
            <q-item v-for="coleta in atrasadas" :key="coleta.id">
              <q-item-section>
                <q-item-label>{{ coleta.cliente }}</q-item-label>
                <q-item-label caption class="text-grey-5">
                  {{ coleta.tipoResiduo }} · {{ formatarKg(coleta.pesoKg) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge outline color="red-3" :label="formatarData(coleta.dataColeta)" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <div class="col-12">
        <GraficoMensal :meses="meses" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CartaoIndicador from '@/components/painel/CartaoIndicador.vue';
import ComposicaoResiduos from '@/components/painel/ComposicaoResiduos.vue';
import GraficoMensal from '@/components/painel/GraficoMensal.vue';
import { useColetasStore } from '@/stores/coletas-store';
import {
  formatarData,
  formatarKg,
  formatarMes,
  formatarPercentual,
  formatarToneladas,
} from '@/utils/formatacao';
import {
  calcularIndicadores,
  coletasAtrasadas,
  composicaoPorResiduo,
  filtrarPorPeriodo,
  mesDaData,
  toneladasPorMes,
} from '@/utils/painel';
import { hojeISO } from '@/utils/validacao';

const store = useColetasStore();

const mesInicial = ref<string | null>(null);
const mesFinal = ref<string | null>(null);

// Os meses que têm coletas viram as opções do filtro de período
const opcoesDeMes = computed(() => {
  const meses = new Set(store.coletas.map((coleta) => mesDaData(coleta.dataColeta)));
  return [...meses].sort().map((mes) => ({ label: formatarMes(mes), value: mes }));
});

// Tudo no painel parte desta lista, já filtrada pelo período
const coletasDoPeriodo = computed(() =>
  filtrarPorPeriodo(store.coletas, mesInicial.value, mesFinal.value),
);

const indicadores = computed(() => calcularIndicadores(coletasDoPeriodo.value));
const meses = computed(() => toneladasPorMes(coletasDoPeriodo.value));
const composicao = computed(() => composicaoPorResiduo(coletasDoPeriodo.value));
const atrasadas = computed(() => coletasAtrasadas(coletasDoPeriodo.value, hojeISO()));
</script>
