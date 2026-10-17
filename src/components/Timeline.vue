<script setup lang="ts">
const ETAPPEN = [
  {
    zeit: 'Frühjahr 2027',
    titel: 'Start',
    text: 'Ankündigung an der Pfahlkonferenz, Flyer mit QR-Code zur Webseite.',
  },
  {
    zeit: '2027',
    titel: 'Sammeln',
    text: 'Kaufen oder malen, Foto hochladen, sonntags in die Sammelkiste der Gemeinde.',
  },
  {
    zeit: 'Herbst 2027',
    titel: 'Sortieren & übergeben',
    text: 'Die JAE sortieren und verpacken; JustServe übergibt alles dem Kinderspital.',
  },
  {
    zeit: '2028',
    titel: '175-Jahr-Jubiläum',
    text: 'Die Kirche in der Schweiz feiert – wir sind mit einem JustServe-Stand dabei.',
  },
]
</script>

<template>
  <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8">
    <h2 class="text-xl font-semibold text-slate-900">Unser Weg</h2>
    <p class="mt-1 text-slate-500">Von der Ankündigung bis zum Jubiläum.</p>

    <ol class="mt-5 ml-2 border-l-2 border-slate-200">
      <li v-for="e in ETAPPEN" :key="e.titel" class="relative pb-6 pl-6 last:pb-0">
        <span
          class="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-700 ring-4 ring-white"
          aria-hidden="true"
        />
        <p class="text-xs font-semibold uppercase tracking-wide text-blue-700">{{ e.zeit }}</p>
        <p class="font-semibold text-slate-900">{{ e.titel }}</p>
        <p class="mt-0.5 text-sm leading-relaxed text-slate-600">{{ e.text }}</p>
      </li>
    </ol>
  </section>
</template>
