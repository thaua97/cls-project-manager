<template>
  <section v-if="projects.length">
    <ClsToolbar
      :total="total"
      v-model:sortBy="sortBy"
      v-model:showFavoritesOnly="showFavoritesOnly"
      @create="onCreate"
    />
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

<script lang="ts" setup>
const { projects, fetchProjects } = useProjectList();
const { sortBy, showFavoritesOnly } = useProjectFilters();
const total = computed(() => projects.value.length);

onMounted(() => {
  fetchProjects();
});

const onCreate = () => {
  navigateTo("/project/new");
};

useHead({
  title: computed(() => `(${total.value}) Gerenciador de Projetos`),
});
</script>
