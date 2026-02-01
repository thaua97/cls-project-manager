<template>
  <section v-if="projects.length">
    <ClsToolbar :total="projects.length" />
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
import { computed, onMounted } from "vue";
import { useProjectStore } from "../stores/project";

const store = useProjectStore();
const projects = computed(() => store.filteredProjects);
const total = computed(() => projects.value.length);

onMounted(() => {
  store.fetchProjects();
});

useHead({
  title: computed(() => `(${total.value}) Gerenciador de Projetos`),
});
</script>
