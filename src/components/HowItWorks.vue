<script setup lang="ts">
const SCHRITTE = [
  {
    icon: '🛒',
    titel: 'Einkaufen & hochladen',
    text: 'Artikel aussuchen (Richtwert 1–3 Franken), kurz fotografieren und hier hochladen.',
  },
  {
    icon: '⛪',
    titel: 'In der Kapelle abgeben',
    text: 'Die Sachen sonntags in die JustServe-Sammelkiste Deiner Kirchengemeinde legen.',
  },
  {
    icon: '📦',
    titel: 'Pfahlkonferenz Herbst 2027',
    text: 'Die Bischofschaften bringen die gesammelten Kisten mit ins Pfahlzentrum Zürich.',
  },
  {
    icon: '🤝',
    titel: 'Sortieren im Institut',
    text: 'Die Jungen Erwachsenen (JAE) sortieren und verpacken alles in durchsichtige JustServe-Boxen.',
  },
  {
    icon: '🎁',
    titel: 'Übergabe ans Kinderspital',
    text: 'JustServe übergibt die Trösterli-Kisten und das Spendenzertifikat offiziell dem Kinderspital Zürich.',
  },
]
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
    <h2 class="text-xl font-semibold text-slate-900">So funktioniert's</h2>
    <p class="mt-1 text-slate-500">
      Vom Einkauf bis zur Übergabe – gemeinsam im ganzen Pfahl Zürich.
    </p>
    <ol class="mt-5 space-y-3">
      <li v-for="(s, i) in SCHRITTE" :key="s.titel" class="flex gap-4 rounded-xl bg-slate-50 p-4">
        <span
          class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-700 text-sm font-bold text-white"
          aria-hidden="true"
        >
          {{ i + 1 }}
        </span>
        <div>
          <p class="font-semibold text-slate-900">
            <span aria-hidden="true">{{ s.icon }}</span> {{ s.titel }}
          </p>
          <p class="mt-0.5 text-sm leading-relaxed text-slate-600">{{ s.text }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>
