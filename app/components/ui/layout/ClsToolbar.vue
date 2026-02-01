<template>
  <header class="flex justify-between items-center pb-6">
    <h1 class="text-2xl font-semibold text-primary-800">
      Projetos
      <span class="text-smoke font-normal text-[17px]">({{ total }})</span>
    </h1>
    <div class="flex justify-between items-center gap-4">
      <div class="flex items-center gap-2">
        <USwitch v-model="modelShowFavoritesOnly" color="warning"></USwitch>
        <p class="text-smoke font-normal font-sm">Apenas Favoritos</p>
      </div>
      <div>
        <USelect
          v-model="modelSortBy"
          :items="ordersType"
          class="w-[200px] bg-white text-primary-800"
        ></USelect>
      </div>
      <ClsButton variant="primary" size="sm" @click="onCreate">
        <Icon name="mdi-light:plus-circle" size="24" />
        Novo Projeto
      </ClsButton>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  total: number;
  sortBy: SortOption;
  showFavoritesOnly: boolean;
}>();

const emit = defineEmits<{
  (e: "update:sortBy", value: SortOption): void;
  (e: "update:showFavoritesOnly", value: boolean): void;
  (e: "create"): void;
}>();

const ordersType = [
  { label: "Alfabética", value: "alphabetical" },
  { label: "Data de Início", value: "startDate" },
  { label: "Data de Fim", value: "endDate" },
];

const modelSortBy = computed({
  get: () => props.sortBy,
  set: (value) => emit("update:sortBy", value),
});

const modelShowFavoritesOnly = computed({
  get: () => props.showFavoritesOnly,
  set: (value) => emit("update:showFavoritesOnly", value),
});

const onCreate = () => {
  emit("create");
};
</script>
