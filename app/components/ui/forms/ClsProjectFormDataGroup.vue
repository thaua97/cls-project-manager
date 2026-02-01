<template>
  <div class="flex justify-between items-center gap-4">
    <UFormField class="w-full" label="Data de início">
      <UInputDate
        class="w-full"
        ref="inputDate"
        v-model="modelInitialDate"
        format="DD-MM-YYYY"
      >
        <template #trailing>
          <UPopover :reference="inputDate?.inputsRef[3]?.$el">
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
        ref="inputDate"
        v-model="modelEndDate"
        format="DD-MM-YYYY"
      >
        <template #trailing>
          <UPopover :reference="inputDate?.inputsRef[3]?.$el">
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
              />
            </template>
          </UPopover>
        </template>
      </UInputDate>
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
import { CalendarDate } from "@internationalized/date";

const inputDate = useTemplateRef("inputDate");

const modelInitialDate = shallowRef(new CalendarDate(2022, 1, 10));
const modelEndDate = shallowRef(new CalendarDate(2022, 1, 10));
</script>
