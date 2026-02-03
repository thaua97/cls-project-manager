<template>
  <button ref="trigger" type="button" @click="emit('update:open', true)">
    <Icon name="mdi-light:magnify" size="24" class="text-white" />
  </button>

  <Teleport to="body">
    <div v-if="open" class="fixed inset-x-0 top-0 z-50 rounded-3xl">
      <div
        ref="panel"
        class="w-screen border-4 border-primary-400 bg-white rounded-xl overflow-x-hidden"
      >
        <UCommandPalette
          :loading="loading"
          :groups="groups"
          :search-term="searchTerm"
          placeholder="Digite o nome do projeto..."
          icon="i-lucide-search"
          size="xl"
          :ui="{
            input:
              '[&>input]:h-[80px] [&>input]:text-sm [&>input]:placeholder:text-gray-400 [&>input]:pl-10',
            content: 'p-2 m-0',
            item: 'pl-4',
            group: 'p-0',
            label: 'pl-4 pt-2 text-xs text-gray-500',
          }"
          class="w-full"
          @update:search-term="emit('update:searchTerm', $event)"
          @update:model-value="emit('select', $event)"
        >
          <template #history-trailing="{ item }">
            <button
              type="button"
              class="ml-auto text-gray-400 hover:text-gray-600"
              @click.stop="emit('removeHistoryItem', item.term)"
            >
              <Icon name="i-lucide-x" size="16" />
            </button>
          </template>
        </UCommandPalette>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  searchTerm: string;
  loading: boolean;
  groups: any[];
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "update:searchTerm", value: string): void;
  (e: "select", value: any): void;
  (e: "removeHistoryItem", term: string): void;
}>();

const trigger = useTemplateRef("trigger");
const panel = useTemplateRef("panel");

onClickOutside(
  panel,
  () => {
    if (props.open) {
      emit("update:open", false);
    }
  },
  { ignore: [trigger] },
);

onKeyStroke("Escape", () => {
  if (props.open) {
    emit("update:open", false);
  }
});
</script>
