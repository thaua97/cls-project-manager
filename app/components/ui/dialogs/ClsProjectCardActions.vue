<template>
  <UDropdownMenu
    size="xl"
    :items="items"
    :content="{
      align: 'end',
    }"
    :ui="{
      content: 'w-48',
    }"
  >
    <UButton
      size="md"
      data-testid="project-actions-button"
      class="rounded-full text-primary-500"
      icon="i-lucide-ellipsis"
      color="neutral"
      variant="outline"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { id } = defineProps<{ id: string }>();

const emit = defineEmits<{ (e: "remove"): void }>();

const items = ref<DropdownMenuItem[]>([
  {
    label: "Editar",
    icon: "i-lucide-edit",
    onSelect: () => {
      navigateTo(`/project/${id}`);
    },
  },
  {
    label: "Remover",
    icon: "i-lucide-trash",
    onSelect: () => {
      emit("remove");
    },
  },
]);
</script>
