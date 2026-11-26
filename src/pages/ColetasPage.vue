<template>
  <q-page padding>
    <div class="row items-center q-my-md">
      <h1 class="text-h5 q-my-none">Coletas</h1>
      <q-space />
      <q-btn
        label="Nova coleta"
        icon="add"
        color="primary"
        unelevated
        no-caps
        @click="abrirCadastro"
      />
    </div>

    <q-table
      class="cartao"
      flat
      :rows="store.coletasOrdenadas"
      :columns="colunas"
      row-key="id"
      no-data-label="Nenhuma coleta cadastrada ainda."
      :pagination="{ rowsPerPage: 10 }"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="corDoStatus(props.value)" :label="props.value" />
        </q-td>
      </template>
    </q-table>

    <ColetaFormDialog v-model="dialogAberto" @salvar="cadastrar" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import ColetaFormDialog from '@/components/ColetaFormDialog.vue';
import { useColetasStore } from '@/stores/coletas-store';
import type { Coleta, DadosColeta, StatusColeta } from '@/types/coleta';
import { formatarData, formatarKg } from '@/utils/formatacao';

const store = useColetasStore();
const $q = useQuasar();
const dialogAberto = ref(false);

// As colunas da tabela: o que mostrar e como formatar
const colunas: QTableColumn<Coleta>[] = [
  {
    name: 'dataColeta',
    label: 'Data',
    field: 'dataColeta',
    align: 'left',
    format: formatarData,
  },
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' },
  { name: 'tipoResiduo', label: 'Resíduo', field: 'tipoResiduo', align: 'left' },
  { name: 'pesoKg', label: 'Peso', field: 'pesoKg', align: 'right', format: formatarKg },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'observacao', label: 'Observação', field: 'observacao', align: 'left' },
];

function corDoStatus(status: StatusColeta): string {
  if (status === 'Realizada') return 'positive';
  if (status === 'Cancelada') return 'grey-6';
  return 'primary'; // Agendada
}

function abrirCadastro() {
  dialogAberto.value = true;
}

function cadastrar(dados: DadosColeta) {
  store.adicionar(dados);
  $q.notify({ type: 'positive', message: 'Coleta cadastrada.' });
}
</script>
