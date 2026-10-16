<script setup lang="ts">
const spendenbild = `${import.meta.env.BASE_URL}spendenbild.svg`
</script>

<template>
  <section class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 sm:flex">
    <img
      :src="spendenbild"
      alt="Platzhalterbild der Spendenaktion für das Kinderspital Zürich"
      class="h-48 w-full object-cover sm:h-auto sm:w-2/5"
    />
    <div class="p-6 sm:p-8">
      <h2 class="text-xl font-semibold text-slate-900">Lieber spenden?</h2>
      <p class="mt-2 text-slate-600">
        Wer keine Sachspende abgeben möchte, kann die Aktion auch mit einer Geldspende unterstützen –
        zusätzlich oder anstelle von Trösterli.
      </p>

      <div class="mt-4 rounded-xl bg-slate-50 p-4">
        <div class="flex items-baseline justify-between">
          <span class="text-sm text-slate-500">Spendenziel</span>
          <span class="text-lg font-bold text-blue-700">1’000 CHF</span>
        </div>
        <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div class="h-full rounded-full bg-blue-600" style="width: 0%" />
        </div>
        <p class="mt-2 text-xs text-slate-400">Spendenstand wird nach dem Start der Aktion ergänzt.</p>
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
