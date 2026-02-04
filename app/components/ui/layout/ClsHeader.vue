<template>
  <header
    v-if="showHeader"
    class="h-[80px] bg-primary-900 text-white flex items-center justify-between px-6 shadow-lg"
  >
    <UButton
      v-if="isAuthenticated"
      size="md"
      data-testid="logout-button"
      @click="logout"
      class="bg-primary-500/10 text-white hover:bg-primary-500/40 rounded-full px-6"
    >
      Sair
    </UButton>

    <ClsLogo class="h-12" />

    <ClsProjectSearch
      v-if="isAuthenticated && showSearchIcon"
      :open="projectSearch.open.value"
      :search-term="projectSearch.searchTerm.value"
      :loading="projectSearch.loading.value"
      :groups="projectSearch.groups.value"
      @update:open="projectSearch.open.value = $event"
      @update:search-term="projectSearch.searchTerm.value = $event"
      @select="projectSearch.select"
      @removeHistoryItem="projectSearch.removeHistoryItem"
    />
    <div v-else></div>
  </header>
</template>

<script lang="ts" setup>
const { openLogin, openRegister } = useAuthModal();
const auth = useAuth();
const projectSearch = useProjectSearch();

const route = useRoute();

const isAuthenticated = auth.isAuthenticated;
const showSearchIcon = computed(() => route.name !== "project-new");

const showHeader = computed(() => {
  return isAuthenticated.value;
});

const logout = () => {
  auth.logout();
};
</script>
