<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ zitat: string; stelle: string }>()

// Einfache Auszeichnung: **fett** wird hervorgehoben.
const teile = computed(() =>
  props.zitat.split(/\*\*(.+?)\*\*/g).map((text, i) => ({ text, fett: i % 2 === 1 })),
)
</script>

<template>
  <figure class="mx-auto max-w-2xl px-2 text-center">
    <blockquote class="text-lg font-medium leading-relaxed text-slate-700 italic sm:text-xl">
      «<span
        v-for="(t, i) in teile"
        :key="i"
        :class="t.fett ? 'font-bold not-italic text-slate-900' : ''"
        >{{ t.text }}</span
      >»
    </blockquote>
    <figcaption class="mt-2 text-sm font-semibold tracking-wide text-blue-700">
      {{ stelle }}
    </figcaption>
  </figure>
</template>
