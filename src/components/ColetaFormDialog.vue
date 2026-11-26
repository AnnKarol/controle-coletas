<template>
  <q-dialog v-model="aberto" persistent>
    <q-card class="cartao" style="width: 520px; max-width: 95vw">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ coleta ? 'Editar coleta' : 'Nova coleta' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup aria-label="Fechar" />
      </q-card-section>

      <q-form @submit="salvar" novalidate>
        <q-card-section class="q-gutter-y-sm">
          <q-input
            v-model="form.cliente"
            label="Cliente *"
            outlined
            :error="!!erros.cliente"
            :error-message="erros.cliente"
          />

          <q-select
            v-model="form.tipoResiduo"
            :options="[...TIPOS_RESIDUO]"
            label="Tipo de resíduo *"
            outlined
            :error="!!erros.tipoResiduo"
            :error-message="erros.tipoResiduo"
          />

          <div class="row q-col-gutter-sm">
            <q-input
              v-model.number="form.pesoKg"
              type="number"
              step="0.01"
              label="Peso *"
              suffix="kg"
              outlined
              class="col-12 col-sm-6"
              :error="!!erros.pesoKg"
              :error-message="erros.pesoKg"
            />
            <q-input
              v-model="form.dataColeta"
              type="date"
              label="Data da coleta *"
              stack-label
              outlined
              class="col-12 col-sm-6"
              :error="!!erros.dataColeta"
              :error-message="erros.dataColeta"
            />
          </div>

          <q-select
            v-model="form.status"
            :options="[...STATUS_COLETA]"
            label="Status *"
            outlined
            :error="!!erros.status"
            :error-message="erros.status"
          />

          <q-input
            v-model="form.observacao"
            type="textarea"
            autogrow
            label="Observação (opcional)"
            outlined
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Cancelar" flat color="grey-8" no-caps v-close-popup />
          <q-btn label="Salvar" type="submit" color="primary" unelevated no-caps />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { STATUS_COLETA, TIPOS_RESIDUO } from '@/types/coleta';
import type { Coleta, DadosColeta } from '@/types/coleta';
import { hojeISO, validarColeta } from '@/utils/validacao';
import type { ErrosColeta, FormularioColeta } from '@/utils/validacao';

// "aberto" liga e desliga a janela. Quem usa o componente controla com v-model.
const aberto = defineModel<boolean>({ required: true });

// Se receber uma coleta, o formulário serve para editar. Se não, para cadastrar.
const props = defineProps<{ coleta?: Coleta | null }>();

// Avisa a tela "mãe" quando os dados forem salvos
const emit = defineEmits<{ salvar: [dados: DadosColeta] }>();

const form = ref<FormularioColeta>(formularioVazio());
const erros = ref<ErrosColeta>({});

function formularioVazio(): FormularioColeta {
  return {
    cliente: '',
    tipoResiduo: null,
    pesoKg: null,
    dataColeta: hojeISO(),
    status: 'Agendada',
    observacao: '',
  };
}

// Toda vez que a janela abre, preenche o formulário (vazio ou com a coleta a editar)
watch(aberto, (estaAberto) => {
  if (estaAberto) {
    form.value = props.coleta ? { ...props.coleta } : formularioVazio();
    erros.value = {};
  }
});

function salvar() {
  erros.value = validarColeta(form.value);
  const temErro = Object.keys(erros.value).length > 0;
  if (temErro) {
    return; // as mensagens aparecem ao lado de cada campo
  }
  // Depois da validação, sabemos que nenhum campo obrigatório está vazio
  emit('salvar', { ...form.value, cliente: form.value.cliente.trim() } as DadosColeta);
  aberto.value = false;
}
</script>
