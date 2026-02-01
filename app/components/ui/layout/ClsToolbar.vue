<template>
  <header class="flex justify-between items-center pb-6">
    <h1 class="text-2xl font-semibold text-primary-800">
      Projetos
      <span class="text-smoke font-normal text-[17px]">({{ total }})</span>
    </h1>
    <div class="flex justify-between items-center gap-4">
      <div><USwitch default-value color="warning"></USwitch></div>
      <div>
        <USelect
          v-model="order"
          :items="ordersType"
          class="w-[200px] bg-white text-primary-800"
        ></USelect>
      </div>
      <ClsButton variant="primary" size="sm" @click="createProject">
        <Icon name="mdi-light:plus-circle" size="24" />
        Novo Projeto
      </ClsButton>
    </div>
  </header>
</template>

<script setup lang="ts">
const { total } = defineProps<{ total: number }>();

const ordersType = ref([
  { label: "Alfabética", value: "alphabetical" },
  { label: "Data de Início", value: "startDate" },
  { label: "Data de Fim", value: "endDate" },
]);
const order = ref("alphabetical");

const createProject = () => {
  navigateTo("/project/new");
};
</script>
