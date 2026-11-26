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

    <div class="cartao q-pa-md q-mb-md row q-col-gutter-sm items-center">
      <q-input
        v-model="filtros.busca"
        label="Buscar cliente"
        outlined
        dense
        clearable
        class="col-12 col-sm-4"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-select
        v-model="filtros.status"
        :options="[...STATUS_COLETA]"
        label="Status"
        outlined
        dense
        clearable
        class="col-12 col-sm-3"
      />
      <q-select
        v-model="filtros.tipoResiduo"
        :options="[...TIPOS_RESIDUO]"
        label="Tipo de resíduo"
        outlined
        dense
        clearable
        class="col-12 col-sm-3"
      />
      <div class="col-12 col-sm-2 text-right texto-secundario">
        {{ coletasFiltradas.length }} de {{ store.coletas.length }} coletas
      </div>
    </div>

    <q-table
      class="cartao"
      flat
      :rows="coletasFiltradas"
      :columns="colunas"
      row-key="id"
      :no-data-label="
        store.coletas.length
          ? 'Nenhuma coleta encontrada com esses filtros.'
          : 'Nenhuma coleta cadastrada ainda.'
      "
      :pagination="{ rowsPerPage: 10 }"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="corDoStatus(props.value)" :label="props.value" />
        </q-td>
      </template>

      <template #body-cell-acoes="props">
        <q-td :props="props">
          <q-btn
            icon="edit"
            flat
            round
            dense
            color="grey-8"
            aria-label="Editar"
            @click="abrirEdicao(props.row)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            icon="delete"
            flat
            round
            dense
            color="negative"
            aria-label="Excluir"
            @click="confirmarExclusao(props.row)"
          >
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <ColetaFormDialog v-model="dialogAberto" :coleta="coletaEmEdicao" @salvar="salvar" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import ColetaFormDialog from '@/components/ColetaFormDialog.vue';
import { useColetasStore } from '@/stores/coletas-store';
import { STATUS_COLETA, TIPOS_RESIDUO } from '@/types/coleta';
import type { Coleta, DadosColeta, StatusColeta } from '@/types/coleta';
import { filtrarColetas } from '@/utils/filtros';
import type { FiltrosColeta } from '@/utils/filtros';
import { formatarData, formatarKg } from '@/utils/formatacao';

const store = useColetasStore();
const $q = useQuasar();
const dialogAberto = ref(false);
// Coleta que está sendo editada. Quando é null, o formulário cadastra uma nova.
const coletaEmEdicao = ref<Coleta | null>(null);

// Filtros da lista (requisito 5) e busca por cliente (diferencial)
const filtros = ref<FiltrosColeta>({ status: null, tipoResiduo: null, busca: '' });

// computed: recalcula sozinho sempre que as coletas ou os filtros mudam
const coletasFiltradas = computed(() =>
  filtrarColetas(store.coletasOrdenadas, { ...filtros.value, busca: filtros.value.busca ?? '' }),
);

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
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function corDoStatus(status: StatusColeta): string {
  if (status === 'Realizada') return 'positive';
  if (status === 'Cancelada') return 'grey-6';
  return 'primary'; // Agendada
}

function abrirCadastro() {
  coletaEmEdicao.value = null;
  dialogAberto.value = true;
}

function abrirEdicao(coleta: Coleta) {
  coletaEmEdicao.value = coleta;
  dialogAberto.value = true;
}

// O mesmo formulário serve para cadastrar e para editar
function salvar(dados: DadosColeta) {
  if (coletaEmEdicao.value) {
    store.atualizar(coletaEmEdicao.value.id, dados);
    $q.notify({ type: 'positive', message: 'Coleta atualizada.' });
  } else {
    store.adicionar(dados);
    $q.notify({ type: 'positive', message: 'Coleta cadastrada.' });
  }
}

// Pede confirmação antes de excluir (requisito 4)
function confirmarExclusao(coleta: Coleta) {
  $q.dialog({
    title: 'Excluir coleta',
    message: `Tem certeza que deseja excluir a coleta de ${coleta.cliente} em ${formatarData(coleta.dataColeta)}?`,
    cancel: { label: 'Cancelar', flat: true, color: 'grey-8', noCaps: true },
    ok: { label: 'Excluir', color: 'negative', unelevated: true, noCaps: true },
    persistent: true,
  }).onOk(() => {
    store.excluir(coleta.id);
    $q.notify({ type: 'info', message: 'Coleta excluída.' });
  });
}
</script>
