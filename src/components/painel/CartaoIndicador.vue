<template>
  <div class="cartao q-pa-md full-height">
    <div class="row items-center no-wrap">
      <div class="texto-secundario text-caption text-uppercase">{{ titulo }}</div>
      <q-space />
      <slot name="selo" />
    </div>
    <div class="text-h4 text-weight-medium q-mt-sm">{{ valor }}</div>
    <div v-if="detalhe" class="texto-secundario text-caption">{{ detalhe }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
// Um cartão branco com título, número grande e um detalhe embaixo
defineProps<{
  titulo: string;
  valor: string;
  detalhe?: string;
}>();
</script>
