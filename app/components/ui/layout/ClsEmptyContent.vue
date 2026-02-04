<template>
  <div data-testid="empty-content">
    <header class="flex flex-col items-center justify-center gap-8">
      <div class="flex flex-col items-center justify-center gap-6">
        <h2 class="text-2xl font-semibold text-primary-800">{{ title }}</h2>
        <p
          class="text-smoke font-regular font-size-[16px] px-6 text-center lg:px-0"
        >
          {{ description }}
        </p>
      </div>
      <ClsButton
        variant="darken"
        data-testid="empty-content-button"
        @click="createProject"
      >
        <Icon v-if="actionIcon" :name="actionIcon" size="32" />
        {{ buttonText }}
      </ClsButton>
    </header>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  description: string;
  buttonText: string;
  actionIcon?: string;
}>();

const createProject = () => {
  navigateTo("/project/new");
};
</script>
