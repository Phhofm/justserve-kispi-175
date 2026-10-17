<script setup lang="ts">
import type { Beitrag } from '../lib/types'
import type { KategorieFortschritt } from '../lib/progress'
import ProgressBar from './ProgressBar.vue'
import PhotoGrid from './PhotoGrid.vue'
import ScriptureBand from './ScriptureBand.vue'

defineProps<{ fortschritt: KategorieFortschritt; fotos: Beitrag[] }>()
defineEmits<{ einreichen: [] }>()
</script>

<template>
  <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8">
    <div class="flex flex-wrap items-center gap-2">
      <h2 class="text-xl font-semibold text-slate-900">Wie der Primi mithelfen kann</h2>
      <span class="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-800">
        In Abklärung
      </span>
    </div>

    <p class="mt-3 leading-relaxed text-slate-600">
      Eine Idee speziell für Kinder: <strong>Mutmacher-Karten</strong> malen – zum Beispiel eine
      Superheldin oder einen Superhelden – und starke Worte daraufschreiben:
    </p>

    <ul class="mt-3 flex flex-wrap gap-2 text-sm">
      <li class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">«Du bist mutig»</li>
      <li class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">«Du bist ein Superheld»</li>
      <li class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
        «Du schaffst das – du bist stark»
      </li>
    </ul>

    <div class="mt-5">
      <ProgressBar
        :gesammelt="fortschritt.gesammelt"
        :ziel="fortschritt.ziel"
        :prozent="fortschritt.prozent"
        farbe="#e11d48"
      />
    </div>

    <div class="mt-4">
      <PhotoGrid :fotos="fotos" />
    </div>

    <button
      type="button"
      class="mt-4 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 sm:w-auto"
      @click="$emit('einreichen')"
    >
      Mutmacher-Karte hochladen
    </button>

    <p class="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
      Mutmacher-Karten sind <strong>separat</strong> von den 875 Trösterli und zählen nicht in den
      grossen Zähler. Ob und wie das Kinderspital sie annimmt, klären wir gerade ab – deshalb «in
      Abklärung». Hochladen darfst Du sie aber bereits.
    </p>

    <div class="mt-6 border-t border-slate-100 pt-6">
      <ScriptureBand
        stelle="3. Nephi 17,21"
        zitat="Und er nahm ihre kleinen Kinder, eines nach dem anderen, und segnete sie."
      />
    </div>
  </section>
</template>
