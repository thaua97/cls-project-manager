<template>
  <div>
    <section class="flex flex-col items-center justify-center gap-8">
      <div class="flex flex-col items-center justify-center gap-6">
        <h2 class="text-2xl font-semibold text-secondary">{{ title }}</h2>
        <p class="text-smoke font-regular font-size-[16px]">
          {{ description }}
        </p>
      </div>
      <Button>
        <Icon v-if="actionIcon" :name="actionIcon" size="32" />
        {{ buttonText }}
      </Button>
    </section>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  description: string;
  buttonText: string;
  actionIcon?: string;
}>();
</script>
