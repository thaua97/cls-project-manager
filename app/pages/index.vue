<template>
  <USkeleton v-if="!auth.isAuthenticated.value" class="h-[80dvh] w-[600px]" />
  <template v-else>
    <ClsToolbar
      v-if="shouldShowToolbar"
      :total="total"
      v-model:sortBy="sortBy"
      v-model:showFavoritesOnly="showFavoritesOnly"
      @create="onCreate"
    />

    <section v-if="projects.length">
      <ClsProjectList>
        <ClsProjectCard
          v-for="project in projects"
          :key="project?.id"
          :project="project"
        />
      </ClsProjectList>
    </section>

    <section
      v-else
      class="flex justify-center items-center w-full h-[80dvh] bg-white rounded-lg shadow-xl"
    >
      <ClsEmptyContent
        title="Nenhum projeto"
        description="Clique no botão abaixo para criar o primeiro e gerenciá-lo."
        button-text="Novo Projeto"
        action-icon="mdi-light:plus-circle"
      />
    </section>
  </template>
</template>

<script lang="ts" setup>
const auth = useAuth();
const { projects, fetchProjects, totalProjectCount } = useProjectList();
const { sortBy, showFavoritesOnly } = useProjectFilters();
const total = computed(() => projects.value.length);

const hasEverHadProjects = ref(false);
watch(
  totalProjectCount,
  (count) => {
    if (count > 0) {
      hasEverHadProjects.value = true;
    }
  },
  { immediate: true },
);

const shouldShowToolbar = computed(
  () => totalProjectCount.value > 0 || hasEverHadProjects.value,
);

watch(
  () => auth.isAuthenticated.value,
  (isAuth) => {
    if (isAuth) {
      fetchProjects();
    }
  },
  { immediate: true },
);

const onCreate = () => {
  navigateTo("/project/new");
};

useHead({
  title: computed(() => `(${total.value}) Gerenciador de Projetos`),
});
</script>
