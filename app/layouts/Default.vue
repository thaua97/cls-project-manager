<template>
  <div class="min-h-screen w-full flex flex-col">
    <ClsHeader />
    <main class="flex-1 h-screen p-8 bg-background">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
