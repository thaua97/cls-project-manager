<template>
  <header class="flex justify-between items-center pb-6" data-testid="toolbar">
    <h1 class="text-2xl font-semibold align-middle text-primary-800">
      Projetos
      <span class="text-smoke font-normal text-[17px]">({{ total }})</span>
    </h1>

    <div class="flex justify-between items-center gap-4">
      <div class="hidden lg:flex items-center gap-2">
        <div class="flex items-center gap-2">
          <USwitch
            v-model="modelShowFavoritesOnly"
            color="warning"
            data-testid="filter-favorites-toggle"
          ></USwitch>
          <p class="text-smoke font-normal font-sm">Apenas Favoritos</p>
        </div>
        <USelect
          v-model="modelSortBy"
          :items="ordersType"
          class="w-[200px] bg-white text-primary-800"
          data-testid="sort-select"
        ></USelect>
      </div>

      <div class="block lg:hidden">
        <UPopover
          :content="{
            align: 'end',
            side: 'bottom',
          }"
        >
          <UButton
            color="primary"
            variant="ghost"
            icon="i-lucide-list-filter"
            size="xl"
            class="rounded-full"
          />

          <template #content>
            <aside class="flex flex-col gap-4 p-4">
              <p class="text-smoke font-normal font-sm">Filtros</p>
              <div class="flex items-center justify-between gap-2">
                <p>Apenas Favoritos</p>
                <USwitch
                  v-model="modelShowFavoritesOnly"
                  color="warning"
                ></USwitch>
              </div>
              <USeparator />
              <UFormField label="Ordenar por">
                <URadioGroup
                  v-model="modelSortBy"
                  :items="ordersType"
                  class="g-white text-primary-800 pt-2"
                />
              </UFormField>
            </aside>
          </template>
        </UPopover>
      </div>

      <ClsButton
        variant="primary"
        size="sm"
        data-testid="create-project-button"
        @click="onCreate"
      >
        <Icon name="mdi-light:plus-circle" size="24" />
        Novo Projeto
      </ClsButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  total: number;
  sortBy: SortOption;
  showFavoritesOnly: boolean;
}>();

const items = [
  {
    label: "Apenas Favoritos",
    icon: "i-lucide-star",
    slot: "favorite" as const,
  },
  {
    label: "Ordenar por",
    icon: "i-lucide-credit-card",
    content: {
      side: "bottom",
      align: "center",
      sideOffset: -2,
    },
    children: [
      {
        label: "Alfabética",
        icon: "i-lucide-credit-card",
        onClick: () => emit("update:sortBy", "alphabetical"),
        slot: "sort" as const,
      },
      {
        label: "Data de Início",
        icon: "i-lucide-credit-card",
        onClick: () => emit("update:sortBy", "startDate"),
        slot: "sort" as const,
      },
      {
        label: "Data de Fim",
        icon: "i-lucide-credit-card",
        onClick: () => emit("update:sortBy", "endDate"),
        slot: "sort" as const,
      },
    ],
  },
] satisfies DropdownMenuItem[];

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
