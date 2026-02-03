<template>
  <button :class="buttonClasses" @click="(e) => emit('click', e)">
    <slot />
  </button>
</template>

<script lang="ts" setup>
interface Props {
  variant?: "primary" | "secondary" | "darken" | "outline" | "ghost" | "washed";
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
});

const emit = defineEmits<{
  click: [MouseEvent];
}>();

const buttonClasses = computed(() => {
  const baseClasses =
    "flex justify-center items-center rounded-4xl gap-2 transition-all font-medium";

  const sizeClasses = {
    sm: "h-[40px] py-2 px-4 text-base",
    md: "h-[52px] py-4 px-8 text-xl",
    lg: "h-[60px] py-5 px-10 text-2xl",
  };

  const variantClasses = {
    primary:
      "bg-primary-500 text-white hover:shadow-lg hover:shadow-primary-500",
    secondary:
      "bg-secondary-500 text-white hover:shadow-lg hover:shadow-secondary-500",
    darken:
      "bg-primary-800 text-white hover:shadow-lg hover:shadow-primary-800",
    washed:
      "bg-primary-200 hover:bg-primary-500 text-white hover:shadow-lg hover:shadow-primary-500",
    outline:
      "bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",
    ghost: "bg-transparent text-primary-500 hover:bg-primary-500/10",
  };

  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
  ].join(" ");
});
</script>
