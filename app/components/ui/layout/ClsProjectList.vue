<template>
  <div class="w-full">
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
    >
      <div
        v-for="i in skeletonCount"
        :key="`skeleton-${i}`"
        class="h-[430px] w-[300px] bg-gray-200 rounded-2xl animate-pulse"
      />
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  projects?: Project[];
  loading?: boolean;
  isEmpty?: boolean;
  skeletonCount?: number;
}

withDefaults(defineProps<Props>(), {
  projects: () => [],
  loading: false,
  isEmpty: false,
  skeletonCount: 8,
});
</script>
