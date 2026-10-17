<script setup lang="ts">
const spendenbild = `${import.meta.env.BASE_URL}spendenbild.svg`

const IDEEN = [
  { icon: '🏃', titel: 'Sponsorenlauf', text: 'z. B. einmal rund um den Greifensee.' },
  { icon: '🍰', titel: 'Kuchenverkauf', text: 'Nach der Kirche oder am Gemeindefest.' },
  { icon: '🧸', titel: 'Flohmarkt', text: 'Ausgedientes verkaufen, Erlös spenden.' },
]
</script>

<template>
  <section class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 sm:flex">
    <img
      :src="spendenbild"
      alt="Platzhalterbild der Spendenaktion für das Kinderspital Zürich"
      class="h-44 w-full object-cover sm:h-auto sm:w-2/5"
    />
    <div class="p-5 sm:p-8">
      <h2 class="text-xl font-semibold text-slate-900">Gemeindeaktion?</h2>
      <p class="mt-2 leading-relaxed text-slate-600">
        Ihr möchtet als Gemeinde etwas Gemeinsames auf die Beine stellen? Startet eine Aktion und
        spendet den Erlös – zusätzlich oder anstelle von Trösterli.
      </p>

      <ul class="mt-4 grid gap-2 sm:grid-cols-3">
        <li
          v-for="i in IDEEN"
          :key="i.titel"
          class="rounded-xl bg-slate-50 p-3 text-sm text-slate-700"
        >
          <span class="text-lg" aria-hidden="true">{{ i.icon }}</span>
          <p class="mt-1 font-semibold text-slate-900">{{ i.titel }}</p>
          <p class="text-slate-600">{{ i.text }}</p>
        </li>
      </ul>

      <div class="mt-4 rounded-xl bg-slate-50 p-4">
        <div class="flex items-baseline justify-between">
          <span class="text-sm text-slate-500">Spendenziel</span>
          <span class="text-lg font-bold text-blue-700">1’000 CHF</span>
        </div>
        <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div class="h-full rounded-full bg-blue-600" style="width: 0%" />
        </div>
        <p class="mt-2 text-xs text-slate-500">
          Ab 1’000 CHF Gesamtspende empfängt uns das Kinderspital zur offiziellen Scheck-Übergabe.
          Der Spendenstand wird nach dem Start der Aktion ergänzt.
        </p>
      </div>

      <button
        type="button"
        disabled
        class="mt-4 cursor-not-allowed rounded-full bg-slate-200 px-5 py-2 text-sm font-medium text-slate-500"
      >
        Bald verfügbar
      </button>
    </div>
  </section>
</template>
