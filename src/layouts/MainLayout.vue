<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-secondary">
      <q-toolbar>
        <q-icon name="recycling" size="28px" color="primary" />
        <q-toolbar-title class="text-weight-medium">
          EcoColeta <span class="text-grey-5 text-body2">· Controle de Coletas</span>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left" active-color="primary" indicator-color="primary" class="text-grey-4">
        <q-route-tab to="/" exact icon="list_alt" label="Coletas" no-caps />
        <q-route-tab to="/painel" icon="bar_chart" label="Painel" no-caps />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
