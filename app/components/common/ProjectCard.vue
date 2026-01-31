<template>
  <article class="h-[430px] w-[300px] bg-white rounded-lg shadow-xl">
    <figure>
      <img src="/img/project-backdrop.png" alt="" />
    </figure>
    <article class="flex flex-col gap-4 p-6">
      <section class="flex flex-col gap-1">
        <h3 class="text-xl font-semibold text-secondary">Projeto 1</h3>
        <p class="flex items-center gap-2">
          <b class="font-bold text-smoke">Cliente:</b>
          <span class="font-normal text-gray-400">Clicksign</span>
        </p>
      </section>
      <div class="h-px bg-gray-200"></div>
      <section class="flex flex-col gap-4">
        <p class="flex items-center gap-2">
          <Icon name="mdi-light:calendar" size="24" class="text-gray-400" />
          <span>01/01/2024</span>
        </p>
        <p class="flex items-center gap-2">
          <Icon name="mdi-light:calendar" size="24" class="text-gray-400" />
          <span>01/01/2024</span>
        </p>
      </section>
    </article>
  </article>
</template>

<script lang="ts" setup></script>
