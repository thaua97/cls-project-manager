<template>
  <section
    class="w-full h-full flex justify-center items-center flex-col gap-4 border border-gray-200 rounded-lg p-8"
  >
    <UForm
      class="w-full max-w-[704px] flex flex-col gap-4"
      @submit.prevent="onSubmit"
    >
      <UFormField class="w-full text-black" label="Nome do projeto">
        <UInput
          v-model="model.name"
          class="w-full"
          :class="
            errors?.name
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : ''
          "
          size="lg"
          color="primary"
        />
        <p v-if="errors?.name" class="text-red-600 text-sm">
          {{ errors.name }}
        </p>
      </UFormField>
      <UFormField class="w-full text-black" label="Cliente">
        <UInput
          v-model="model.client"
          class="w-full bg-white"
          :class="
            errors?.client
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : ''
          "
          size="lg"
          color="primary"
        />
        <p v-if="errors?.client" class="text-red-600 text-sm">
          {{ errors.client }}
        </p>
      </UFormField>
      <ClsProjectFormDataGroup
        :start-date="model.startDate"
        :end-date="model.endDate"
        @update:start-date="(v) => (model.startDate = v)"
        @update:end-date="(v) => (model.endDate = v)"
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
      <UFormField label="Capa do projeto">
        <ClsUploadFile v-model="backgroundFile" />
      </UFormField>
      <ClsButton type="submit" variant="washed" :disabled="loading">
        Salvar Projeto
      </ClsButton>
    </UForm>
  </section>
</template>

<script lang="ts" setup>
type ValidationErrors = Partial<Record<keyof CreateProjectInput, string>>;

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

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const errors = computed(() => props.errors);
const loading = computed(() => props.loading);

const onSubmit = () => {
  emit("submit", backgroundFile.value);
};
</script>
