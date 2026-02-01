<template>
  <UModal
    v-if="isOpen"
    v-model:open="isOpen"
    :ui="{
      wrapper: 'flex flex-col items-center justify-center',
      content: 'overflow-visible',
    }"
  >
    <template #content="{ close }">
      <div class="relative p-8">
        <div
          class="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full flex items-center justify-center shadow-lg z-10"
          style="background-color: rgb(99, 102, 241)"
        >
          <UIcon name="i-lucide-trash-2" class="w-10 h-10 text-white" />
        </div>

        <div class="mt-8 text-center">
          <h2 class="text-3xl font-bold mb-6" style="color: rgb(67, 56, 202)">
            {{ title }}
          </h2>

          <div class="border-t border-gray-200 pt-6 mb-6">
            <p class="text-gray-500 mb-4">
              {{ description }}
            </p>
            <p class="text-xl font-semibold text-gray-900">
              {{ projectName }}
            </p>
          </div>

          <div class="flex gap-4 justify-center mt-8">
            <ClsButton
              variant="outline"
              size="lg"
              class="min-w-[180px]"
              @click="handleCancel(close)"
            >
              Cancelar
            </ClsButton>
            <ClsButton
              variant="primary"
              size="lg"
              class="min-w-[180px]"
              @click="handleConfirm(close)"
            >
              Confirmar
            </ClsButton>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
interface Props {
  modelValue?: boolean;
  title?: string;
  description?: string;
  projectName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: "Remover projeto",
  description: "Essa ação removerá definitivamente o projeto:",
  projectName: "Nome do projeto",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
  cancel: [];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleConfirm = (close: () => void) => {
  emit("confirm");
  close();
};

const handleCancel = (close: () => void) => {
  emit("cancel");
  close();
};
</script>

<style scoped>
:deep(.bg-primary-500) {
  background-color: rgb(99, 102, 241);
}

:deep(.text-primary-700) {
  color: rgb(67, 56, 202);
}
</style>
