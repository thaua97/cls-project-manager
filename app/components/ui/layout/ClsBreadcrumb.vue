<template>
  <header class="flex w-full flex-col items-start gap-1 sm:gap-2">
    <NuxtLink
      to="/"
      class="flex items-center gap-2 text-sm sm:text-base text-primary-800"
    >
      <Icon name="mdi-light:arrow-left" size="20" />
      Voltar
    </NuxtLink>
    <h1
      class="max-w-full wrap-break-word text-xl sm:text-2xl font-semibold leading-tight text-primary-800"
    >
      {{ pageTitle }}
    </h1>
  </header>
</template>

<script lang="ts" setup>
const { title } = defineProps<{ title?: string }>();

const pageTitle = computed(() => title || "Novo Projeto");
</script>
