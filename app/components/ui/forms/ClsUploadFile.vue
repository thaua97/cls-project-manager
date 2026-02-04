<template>
  <div class="w-full flex flex-col gap-2">
    <div v-if="previewSrc" class="w-full relative">
      <UButton
        class="absolute top-[-8px] right-[-8px] z-20 rounded-full"
        @click="handleRemove"
      >
        <Icon size="16px" name="i-lucide-x" />
      </UButton>
      <img
        :src="previewSrc"
        alt="Preview"
        class="w-full max-h-56 object-cover rounded-md relative"
      />
    </div>

    <UFileUpload
      v-else
      v-model="fileModel"
      icon="i-lucide-image"
      label="Escolha um arquivo .jpeg ou .png no seu dispositivo"
      accept="image/jpeg, image/png"
      class="w-full min-h-43"
      highlight
      :multiple="false"
    >
      <template #actions="{ open }">
        <ClsButton
          type="button"
          variant="outline"
          size="sm"
          @click.stop.prevent="open()"
        >
          Selecionar
        </ClsButton>
      </template>

      <template #files-bottom="{ removeFile, files }">
        <ClsButton
          v-if="files || urlModel"
          type="button"
          size="sm"
          @click.prevent="handleRemoveFromSlot(removeFile)"
        >
          Remover Imagem
        </ClsButton>
      </template>
    </UFileUpload>
  </div>
</template>

<script setup lang="ts">
const fileModel = defineModel<File | null>("file", { default: null });
const urlModel = defineModel<string | undefined>("url", { default: undefined });

const objectUrl = ref<string | null>(null);

const previewSrc = computed(() => objectUrl.value || urlModel.value || null);

watch(
  fileModel,
  (file) => {
    if (objectUrl.value) {
      URL.revokeObjectURL(objectUrl.value);
      objectUrl.value = null;
    }
    if (file) {
      urlModel.value = undefined;
      objectUrl.value = URL.createObjectURL(file);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
  }
});

const handleRemove = (_event?: MouseEvent) => {
  fileModel.value = null;
  urlModel.value = urlModel.value !== undefined ? "" : undefined;
};

const handleRemoveFromSlot = (removeFile: (index?: number) => void) => {
  removeFile();
  handleRemove();
};
</script>

<style>
.w-full.min-h-43 :where(.bg-default) {
  background-color: transparent !important;
}
</style>
