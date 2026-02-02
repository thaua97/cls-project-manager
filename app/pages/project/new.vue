<template>
  <section
    class="flex flex-col justify-between items-start w-full h-[80dvh] gap-6"
  >
    <ClsBreadcrumb />
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

const { createProject } = useProject();
const { validateProject, hasErrors } = useProjectValidation();

const isSubmitting = ref(false);
const errors = ref<ValidationErrors>({});

const form = ref<CreateProjectInput>({
  name: "",
  client: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  userId: "",
  background: undefined,
});

const pageTitle = computed(() => "Novo Projeto");

useHead({
  title: pageTitle,
});

const handleSubmit = async () => {
  errors.value = validateProject(form.value);
  if (hasErrors(errors.value)) return;

  isSubmitting.value = true;
  try {
    await createProject(form.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
