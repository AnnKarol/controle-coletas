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
// Coleta que está sendo editada. Quando é null, o formulário cadastra uma nova.
const coletaEmEdicao = ref<Coleta | null>(null);

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
