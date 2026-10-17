<script setup lang="ts">
import ShareButton from './ShareButton.vue'

defineProps<{ gesamtziel: number }>()
defineEmits<{ beitragen: [] }>()
</script>

<template>
  <header class="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
    <div class="mx-auto max-w-5xl px-4 py-14 text-center sm:py-24">
      <p class="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium tracking-wide">
        175 Jahre Kirche in der Schweiz
      </p>
      <h1 class="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
        Trösterli für das Kinderspital Zürich
      </h1>
      <p class="mx-auto mt-5 max-w-2xl text-base text-blue-50 sm:text-lg">
        Viele Kinder im Kinderspital Zürich haben Schweres hinter sich. Mit einem kleinen Trösterli
        möchten wir ihnen Mitgefühl schenken: ein Lächeln ins Gesicht und ein wenig Ablenkung vor
        einer Operation. Mach mit – allein, als Familie, als Klasse/Gruppe oder Gemeinde:
        {{ gesamtziel }} Trösterli, 175 aus jeder der fünf Kategorien. Als Pfahl Zürich zum
        175-Jahr-Jubiläum unserer Kirche in der Schweiz.
      </p>

      <div class="mx-auto mt-8 flex max-w-md gap-3">
        <a
          href="#mosaik"
          class="flex-1 rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 sm:text-base"
        >
          Unser Mosaik
        </a>
        <button
          type="button"
          class="flex-1 rounded-full px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/50 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-base"
          @click="$emit('beitragen')"
        >
          Beitrag einreichen
        </button>
      </div>

      <div class="mt-4 flex justify-center">
        <ShareButton auf-dunkel />
      </div>
    </div>
  </header>
</template>
