<script setup lang="ts">
const FARBEN = ['#2563eb', '#db2777', '#f59e0b', '#16a34a', '#7c3aed']

defineProps<{ aktiv: boolean }>()
</script>

<template>
  <div
    v-if="aktiv"
    class="pointer-events-none fixed inset-0 z-50 motion-reduce:hidden"
    aria-hidden="true"
  >
    <span
      v-for="i in 24"
      :key="i"
      class="absolute h-2.5 w-2.5 animate-bounce rounded-full opacity-90"
      :style="{
        left: `${i * 4}%`,
        top: `${(i % 6) * 12}%`,
        backgroundColor: FARBEN[i % 5],
        animationDelay: `${(i % 5) * 80}ms`,
      }"
    />
  </div>
</template>
