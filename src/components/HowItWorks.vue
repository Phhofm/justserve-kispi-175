<script setup lang="ts">
const SCHRITTE = [
  {
    icon: '🛒',
    titel: 'Trösterli kaufen',
    text: 'In Migros, Coop, Smyths oder wo Du magst – alles zwischen 1 und 3 Franken.',
  },
  {
    icon: '📸',
    titel: 'Foto hochladen',
    text: 'Kurz fotografieren, Kategorie und Menge wählen, absenden. Wir prüfen es und zeigen es im Mosaik.',
  },
  {
    icon: '🤝',
    titel: 'In die Gemeinde bringen',
    text: 'Am Sonntag die Artikel in Deine Kapelle mitnehmen – den Rest übernehmen wir.',
  },
]
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
    <h2 class="text-xl font-semibold text-slate-900">So funktioniert's</h2>
    <p class="mt-1 text-slate-500">
      In drei Schritten dabei – allein, als Familie oder als ganze Gemeinde.
    </p>
    <ol class="mt-5 grid gap-4 sm:grid-cols-3">
      <li v-for="(s, i) in SCHRITTE" :key="s.titel" class="rounded-xl bg-slate-50 p-4">
        <span class="text-2xl" aria-hidden="true">{{ s.icon }}</span>
        <p class="mt-2 font-semibold text-slate-900">{{ i + 1 }}. {{ s.titel }}</p>
        <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ s.text }}</p>
      </li>
    </ol>
  </section>
</template>
