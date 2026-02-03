<template>
  <UFileUpload
    v-model="model"
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
        v-if="files"
        type="button"
        size="sm"
        @click.prevent="handleRemove(removeFile)"
      >
        Remover Imagem
      </ClsButton>
    </template>
  </UFileUpload>
</template>

<script setup lang="ts">
const model = defineModel<File | null>({ default: null });

const handleRemove = (removeFile: () => void) => {
  removeFile();
  model.value = null;
};
</script>

<style>
.w-full.min-h-43 :where(.bg-default) {
  background-color: transparent !important;
}
</style>
