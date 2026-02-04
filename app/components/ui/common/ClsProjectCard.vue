<template>
  <article
    data-testid="project-card"
    :data-project-id="project.id"
    class="lg:h-[430px] lg:w-[300px] sm:w-full bg-white rounded-2xl border border-gray-200"
  >
    <figure class="relative lg:w-[300px] sm:w-full h-[230px]">
      <img
        class="w-full h-full object-cover rounded-tl-2xl rounded-tr-2xl"
        :src="projectCover"
        :alt="project.name"
      />
      <div
        class="absolute bottom-4 right-4 gap-2 flex items-center justify-center"
      >
        <div
          class="cursor-pointer flex items-center"
          data-testid="project-favorite-button"
          :data-favorited="project.isFavorite ? 'true' : 'false'"
          @click="handleFavorite()"
        >
          <Icon
            v-if="project.isFavorite"
            name="ic:baseline-star"
            size="32"
            class="text-yellow-500"
          />
          <Icon v-else name="mdi:star-outline" size="32" class="text-white" />
        </div>
        <ClsProjectCardActions :id="project.id" @remove="handleRemove" />
      </div>
    </figure>
    <article class="flex flex-col gap-4 p-6">
      <section class="flex flex-col gap-1">
        <h3 class="text-xl font-semibold text-primary-800">
          <template v-if="nameParts?.length">
            <template v-for="(part, index) in nameParts" :key="index">
              <span
                :class="
                  part.highlight
                    ? 'bg-yellow-200/70 text-primary-900 rounded px-1'
                    : ''
                "
              >
                {{ part.text }}
              </span>
            </template>
          </template>
          <template v-else>
            {{ project.name }}
          </template>
        </h3>
        <p class="flex items-center gap-2">
          <b class="font-bold text-smoke">Cliente:</b>
          <span class="font-normal text-gray-400">{{ project.client }}</span>
        </p>
      </section>
      <div class="h-px bg-gray-200"></div>
      <section class="flex flex-col gap-4">
        <p class="flex items-center gap-2">
          <Icon name="ic:baseline-event" size="24" class="text-gray-400" />
          <span>{{ startDate }}</span>
        </p>
        <p class="flex items-center gap-2">
          <Icon
            name="ic:baseline-event-available"
            size="24"
            class="text-gray-400"
          />
          <span>{{ endDate }}</span>
        </p>
      </section>
    </article>
  </article>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
dayjs.locale(ptBr);

type HighlightPart = {
  text: string;
  highlight: boolean;
};

const { project, nameParts } = defineProps<{
  project: Project;
  nameParts?: HighlightPart[];
}>();

console.log(project);

const { toggleFavorite, deleteProject } = useProject();
const dialog = useConfirmationDialog();

const startDate = computed(() =>
  dayjs(project.startDate).format("DD [de] MMMM [de] YYYY"),
);
const endDate = computed(() =>
  dayjs(project.endDate).format("DD [de] MMMM [de] YYYY"),
);
const projectCover = computed(
  () => project.backgroundUrl || "/img/project-backdrop.png",
);
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
