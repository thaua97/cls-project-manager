<template>
  <section
    class="w-full h-full flex justify-center items-center flex-col gap-4 border border-gray-200 rounded-lg p-8"
  >
    <UForm class="w-full max-w-[704px] flex flex-col gap-4">
      <UFormField class="w-full text-black" label="Nome do projeto">
        <UInput class="w-full" size="lg" color="primary" />
      </UFormField>
      <UFormField class="w-full text-black" label="Cliente">
        <UInput class="w-full bg-white" size="lg" color="primary" />
      </UFormField>
      <ClsProjectFormDataGroup />
      <UFormField label="Capa do projeto">
        <ClsUploadFile />
      </UFormField>
      <ClsButton type="submit" variant="washed"> Salvar Projeto </ClsButton>
    </UForm>
  </section>
</template>

<script lang="ts" setup></script>
