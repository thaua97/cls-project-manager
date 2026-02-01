<template>
  <UApp class="antialiased">
    <NuxtRouteAnnouncer />
    <NuxtLayout name="default">
      <NuxtPage />
    </NuxtLayout>
    <ClsConfirmationDialog
      v-model="dialog.state.isOpen"
      :title="dialog.state.title"
      :description="dialog.state.description"
      :project-name="dialog.state.projectName"
      @confirm="dialog.confirm"
      @cancel="dialog.cancel"
    />
  </UApp>
</template>
<script lang="ts" setup>
const dialog = useConfirmationDialog();
</script>
