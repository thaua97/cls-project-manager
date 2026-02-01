<template>
  <article class="h-[430px] w-[300px] bg-white rounded-2xl shadow-xl">
    <figure class="relative">
      <img src="/img/project-backdrop.png" alt="" />
      <div
        class="absolute bottom-2 right-2 gap-2 flex items-center justify-center"
      >
        <div class="cursor-pointer" @click="handleFavorite()">
          <Icon
            v-if="project.isFavorite"
            name="ic:baseline-star"
            size="24"
            class="text-yellow-500 drop-shadow-star"
          />
          <Icon v-else name="mdi-light:star" size="24" class="text-white" />
        </div>
        <ClsProjectCardActions :id="project.id" @remove="handleRemove" />
      </div>
    </figure>
    <article class="flex flex-col gap-4 p-6">
      <section class="flex flex-col gap-1">
        <h3 class="text-xl font-semibold text-primary-800">
          {{ project.name }}
        </h3>
        <p class="flex items-center gap-2">
          <b class="font-bold text-smoke">Cliente:</b>
          <span class="font-normal text-gray-400">{{ project.client }}</span>
        </p>
      </section>
      <div class="h-px bg-gray-200"></div>
      <section class="flex flex-col gap-4">
        <p class="flex items-center gap-2">
          <Icon name="mdi-light:calendar" size="24" class="text-gray-400" />
          <span>{{ startDate }}</span>
        </p>
        <p class="flex items-center gap-2">
          <Icon name="mdi-light:calendar" size="24" class="text-gray-400" />
          <span>{{ endDate }}</span>
        </p>
      </section>
    </article>
  </article>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";

const { project } = defineProps<{ project: Project }>();

const { toggleFavorite, deleteProject } = useProject();
const dialog = useConfirmationDialog();

const startDate = computed(() => dayjs(project.startDate).format("DD/MM/YYYY"));
const endDate = computed(() => dayjs(project.endDate).format("DD/MM/YYYY"));

const handleFavorite = () => {
  toggleFavorite(project.id);
};

const handleRemove = () => {
  dialog.open({
    projectName: project.name,
    title: "Remover projeto", // opcional
    description: "Essa ação removerá definitivamente o projeto:", // opcional
    onConfirm: () => {
      deleteProject(project.id);
    },
    onCancel: () => {
      // Opcional: lógica ao cancelar
    },
  });
};
</script>
