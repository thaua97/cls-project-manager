<template>
  <section
    class="flex flex-col justify-between items-start w-full h-[80dvh] gap-6"
  >
    <ClsBreadcrumb :title="pageTitle" />
    <ClsProjectForm
      v-model="form"
      :errors="errors"
      :loading="isSubmitting"
      @submit="handleSubmit"
    />
  </section>
</template>

<script lang="ts" setup>
type ValidationErrors = Partial<Record<keyof CreateProjectInput, string>>;

const { id } = useRoute().params as { id: string };
const { getProjectById, fetchProjects } = useProjectList();
const { updateProject } = useProject();
const { validateProject, hasErrors } = useProjectValidation();

const isSubmitting = ref(false);
const errors = ref<ValidationErrors>({});
const { pending: isLoadingProject, error: loadError } = useAsyncData(
  () => `project:edit:${id}`,
  async () => {
    const existing = getProjectById(id);
    if (!existing) {
      await fetchProjects();
    }
    return true;
  },
);

const project = computed(() => getProjectById(id));

const form = ref<CreateProjectInput>({
  name: "",
  client: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  backgroundUrl: undefined,
});

watch(
  project,
  (value) => {
    if (!value) return;

    form.value = {
      name: value.name,
      client: value.client,
      startDate: value.startDate,
      endDate: value.endDate,
      backgroundUrl: value.backgroundUrl,
    };
  },
  { immediate: true },
);

const pageTitle = computed(() => project.value?.name || "Editar Projeto");

useHead({
  title: pageTitle,
});

const handleSubmit = async (backgroundFile: File | null) => {
  errors.value = validateProject(form.value);
  if (hasErrors(errors.value)) return;

  isSubmitting.value = true;
  try {
    await updateProject({ id, ...form.value }, backgroundFile);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
