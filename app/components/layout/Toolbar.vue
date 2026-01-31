<template>
  <header class="flex justify-between items-center">
    <h1 class="text-2xl font-semibold text-secondary">
      Projetos <span class="text-smoke font-normal text-[17px]">(0)</span>
    </h1>
    <div class="flex justify-between items-center gap-4">
      <div><USwitch default-value></USwitch></div>
      <div>
        <USelect
          v-model="order"
          :items="ordersType"
          class="w-[200px] bg-white text-secondary"
        ></USelect>
      </div>
      <Button>
        <Icon name="mdi-light:plus-circle" size="24" />
        Novo Projeto
      </Button>
    </div>
  </header>
</template>

<script setup lang="ts">
const ordersType = ref([
  { label: "Alfabética", value: "alphabetical" },
  { label: "Data de Início", value: "startDate" },
  { label: "Data de Fim", value: "endDate" },
]);
const order = ref("alphabetical");
</script>
