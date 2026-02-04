<template>
  <div class="flex flex-col justify-between items-center md:flex-row gap-4">
    <UFormField class="w-full" label="Data de início">
      <UInputDate
        class="w-full"
        data-testid="project-start-date"
        ref="inputStartDate"
        v-model="modelInitialDate"
        format="DD-MM-YYYY"
      >
        <template #trailing>
          <UPopover :reference="inputStartDate?.inputsRef[3]?.$el">
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-calendar"
              aria-label="Select a date"
              class="px-0"
            />

            <template #content>
              <UCalendar
                v-model="modelInitialDate"
                class="p-2"
                format="DD-MM-YYYY"
              />
            </template>
          </UPopover>
        </template>
      </UInputDate>
    </UFormField>

    <UFormField class="w-full" label="Data de término">
      <UInputDate
        class="w-full"
        data-testid="project-end-date"
        ref="inputEndDate"
        v-model="modelEndDate"
        format="DD-MM-YYYY"
        :min-value="modelInitialDate"
      >
        <template #trailing>
          <UPopover :reference="inputEndDate?.inputsRef[3]?.$el">
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-calendar"
              aria-label="Select a date"
              class="px-0"
            />

            <template #content>
              <UCalendar
                v-model="modelEndDate"
                class="p-2"
                format="DD-MM-YYYY"
                :min-value="modelInitialDate"
              />
            </template>
          </UPopover>
        </template>
      </UInputDate>
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  startDate?: string;
  endDate?: string;
}>();

const emit = defineEmits<{
  (e: "update:startDate", value: string): void;
  (e: "update:endDate", value: string): void;
}>();

const inputStartDate = useTemplateRef("inputStartDate");
const inputEndDate = useTemplateRef("inputEndDate");

const { parseCalendarDate } = useCalendarDate();

const modelInitialDate = shallowRef(parseCalendarDate(props.startDate));
const modelEndDate = shallowRef(parseCalendarDate(props.endDate));

const ensureEndDateIsNotBeforeStartDate = () => {
  const start = modelInitialDate.value?.toString();
  const end = modelEndDate.value?.toString();
  if (start && end && end < start) {
    modelEndDate.value = parseCalendarDate(start);
  }
};

watch(
  () => props.startDate,
  (value) => {
    modelInitialDate.value = parseCalendarDate(value);
    ensureEndDateIsNotBeforeStartDate();
  },
);

watch(
  () => props.endDate,
  (value) => {
    modelEndDate.value = parseCalendarDate(value);
    ensureEndDateIsNotBeforeStartDate();
  },
);

watch(
  modelInitialDate,
  (value) => {
    emit("update:startDate", value.toString());
    ensureEndDateIsNotBeforeStartDate();
  },
  { deep: true },
);

watch(
  modelEndDate,
  (value) => {
    const start = modelInitialDate.value?.toString();
    const end = value?.toString();
    if (start && end && end < start) {
      modelEndDate.value = parseCalendarDate(start);
      return;
    }

    emit("update:endDate", value.toString());
  },
  { deep: true },
);
</script>
