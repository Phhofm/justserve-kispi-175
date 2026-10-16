<script setup lang="ts">
defineProps<{ gesamtziel: number }>()
defineEmits<{ beitragen: [] }>()
</script>

<template>
  <header class="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
    <div class="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
      <p class="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium tracking-wide">
        175 Jahre Kirche in der Schweiz
      </p>
      <h1 class="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
        Trösterli für das Kinderspital Zürich
      </h1>
      <p class="mx-auto mt-5 max-w-2xl text-lg text-blue-50">
        Gemeinsam sammeln wir Trösterli für die tapferen Kinder im Kinderspital Zürich:
        {{ gesamtziel }} kleine Freuden, 175 aus jeder der fünf Kategorien. Als Pfahl Zürich zum
        175-Jahr-Jubiläum der Kirche in der Schweiz.
      </p>
      <button
        type="button"
        class="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700"
        @click="$emit('beitragen')"
      >
        Jetzt beitragen
      </button>
    </div>
  </header>
</template>
