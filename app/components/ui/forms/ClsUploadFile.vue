<template>
  <UFileUpload
    v-model="value"
    icon="i-lucide-image"
    label="Escolha um arquivo .jpeg ou .png no seu dispositivo"
    accept="image/jpeg, image/png"
    class="w-full min-h-43"
    highlight
  >
    <template #actions="{ open }">
      <ClsButton variant="outline" size="sm" @click="open()">
        Selecionar
      </ClsButton>
    </template>

    <template #files-bottom="{ removeFile, files }">
      <ClsButton v-if="files" size="sm" @click="removeFile()">
        Remover Imagem
      </ClsButton>
    </template>
  </UFileUpload>
</template>

<script setup lang="ts">
const value = ref<File | null>(null);
</script>

<style>
.w-full.min-h-43 :where(.bg-default) {
  background-color: transparent !important;
}
</style>
