<script setup lang="ts">
const ETAPPEN = [
  {
    zeit: 'Frühjahr 2027',
    titel: 'Start',
    text: 'Ankündigung an der Frühjahrs-Pfahlkonferenz.',
  },
  {
    zeit: '2027',
    titel: 'Sammeln',
    text: 'Trösterli sammeln und Sponsorenaktivitäten.',
  },
  {
    zeit: 'Herbst 2027',
    titel: 'Mitnehmen',
    text: 'Die gesammelten Trösterli an die Herbst-Pfahlkonferenz 2027 mitnehmen und bei JustServe abgeben.',
  },
  {
    zeit: 'Ende 2027',
    titel: 'Sortieren & Übergabe',
    text: 'Die Jungen Erwachsenen (JAE) sortieren nach dem Institut alles in JustServe-Kisten. JustServe übergibt alles dem Kinderspital.',
  },
  {
    zeit: '2028',
    titel: 'Jubiläumsfeier',
    text: 'Wir feiern das 175-Jahr-Jubiläum unserer Kirche in der Schweiz in der Swiss Life Arena – JustServe ist mit einem Infostand dabei.',
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
