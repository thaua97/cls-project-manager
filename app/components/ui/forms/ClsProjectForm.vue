<template>
  <section
    class="w-full h-full flex justify-center items-center flex-col gap-4 border border-gray-200 rounded-lg p-8"
    data-testid="project-form"
  >
    <UForm
      class="w-full max-w-[704px] flex flex-col gap-4"
      @submit.prevent="onSubmit"
    >
      <UFormField class="w-full text-black" label="Nome do projeto">
        <UInput
          v-model="modelValue.name"
          class="w-full"
          data-testid="project-name-input"
          :class="
            errors?.name
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : ''
          "
          size="lg"
          color="primary"
        />
        <p
          v-if="errors?.name"
          class="text-red-600 text-sm"
          data-testid="project-name-error"
        >
          {{ errors.name }}
        </p>
      </UFormField>
      <UFormField class="w-full text-black" label="Cliente">
        <UInput
          v-model="modelValue.client"
          class="w-full bg-white"
          data-testid="project-client-input"
          :class="
            errors?.client
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : ''
          "
          size="lg"
          color="primary"
        />
        <p
          v-if="errors?.client"
          class="text-red-600 text-sm"
          data-testid="project-client-error"
        >
          {{ errors.client }}
        </p>
      </UFormField>
      <ClsProjectFormDataGroup
        :start-date="startDate"
        :end-date="endDate"
        @update:start-date="(v) => (startDate = v)"
        @update:end-date="(v) => (endDate = v)"
      />
      <div
        v-if="errors?.startDate || errors?.endDate"
        class="flex flex-col gap-1"
      >
        <p v-if="errors?.startDate" class="text-red-600 text-sm">
          {{ errors.startDate }}
        </p>
        <p v-if="errors?.endDate" class="text-red-600 text-sm">
          {{ errors.endDate }}
        </p>
      </div>
      <UFormField v-if="!isGuest" label="Capa do projeto">
        <ClsUploadFile
          v-model:file="backgroundFile"
          v-model:url="backgroundUrl"
        />
      </UFormField>
      <UAlert
        v-else
        variant="subtle"
        description="Upload disponível apenas com credenciais"
        color="primary"
        size="md"
        icon="i-ludide-bell"
      />
      <ClsButton
        type="submit"
        variant="washed"
        :disabled="loading"
        data-testid="project-submit-button"
      >
        Salvar Projeto
      </ClsButton>
    </UForm>
  </section>
</template>

<script lang="ts" setup>
type ValidationErrors = Partial<Record<keyof CreateProjectInput, string>>;

const auth = useAuth();
const props = defineProps<{
  modelValue: CreateProjectInput;
  errors?: ValidationErrors;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: CreateProjectInput): void;
  (e: "submit", file: File | null): void;
}>();

const backgroundFile = ref<File | null>(null);

const updateModel = (patch: Partial<CreateProjectInput>) => {
  emit("update:modelValue", {
    ...props.modelValue,
    ...patch,
  });
};

const name = computed({
  get: () => props.modelValue.name,
  set: (value) => updateModel({ name: value }),
});

const client = computed({
  get: () => props.modelValue.client,
  set: (value) => updateModel({ client: value }),
});

const startDate = computed({
  get: () => props.modelValue.startDate,
  set: (value) => updateModel({ startDate: value }),
});

const endDate = computed({
  get: () => props.modelValue.endDate,
  set: (value) => updateModel({ endDate: value }),
});

const backgroundUrl = computed({
  get: () => props.modelValue.backgroundUrl,
  set: (value) => updateModel({ backgroundUrl: value }),
});

const errors = computed(() => props.errors);
const loading = computed(() => props.loading);
const isGuest = computed(() => auth.isGuest.value);

const onSubmit = () => {
  emit("submit", backgroundFile.value);
};
</script>
