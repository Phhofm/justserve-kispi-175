<script setup lang="ts">
defineProps<{ zitat: string; stelle: string }>()
</script>

<template>
  <figure class="mx-auto max-w-2xl px-2 text-center">
    <blockquote class="text-lg font-medium leading-relaxed text-slate-700 italic sm:text-xl">
      «{{ zitat }}»
    </blockquote>
    <figcaption class="mt-2 text-sm font-semibold tracking-wide text-blue-700">
      {{ stelle }}
    </figcaption>
  </figure>
</template>
