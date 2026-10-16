<script setup lang="ts">
import type { Beitrag, CategorySlug, Kategorie } from '../lib/types'
import type { KategorieFortschritt } from '../lib/progress'
import ProgressBar from './ProgressBar.vue'
import PhotoGrid from './PhotoGrid.vue'

defineProps<{
  kategorie: Kategorie
  fortschritt: KategorieFortschritt
  fotos: Beitrag[]
}>()

defineEmits<{ einreichen: [slug: CategorySlug] }>()
</script>

<template>
  <article class="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
    <h3 class="text-lg font-semibold text-slate-900">{{ kategorie.label }}</h3>
    <p class="mt-1 text-sm text-slate-500">{{ kategorie.beschreibung }}</p>

    <div class="mt-4">
      <ProgressBar
        :gesammelt="fortschritt.gesammelt"
        :ziel="fortschritt.ziel"
        :prozent="fortschritt.prozent"
        :farbe="kategorie.farbe"
      />
    </div>

    <div class="mt-4 grow">
      <PhotoGrid :fotos="fotos" />
    </div>

    <button
      type="button"
      class="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      @click="$emit('einreichen', kategorie.slug)"
    >
      Beitrag einreichen
    </button>
  </article>
</template>
