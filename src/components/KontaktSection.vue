<script setup lang="ts">
// Sobald die allgemeine JustServe-Adresse des Pfahls steht, hier eintragen.
const KONTAKT_EMAIL = ''
</script>

<template>
  <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8">
    <h2 class="text-xl font-semibold text-slate-900">Fragen?</h2>
    <p class="mt-2 leading-relaxed text-slate-600">
      Melde Dich bei <strong>Philip Hofmann</strong>, JustServe-Spezialist Pfahl Zürich.
    </p>
    <a
      v-if="KONTAKT_EMAIL"
      :href="`mailto:${KONTAKT_EMAIL}`"
      class="mt-2 inline-block font-medium text-blue-700 hover:underline"
    >
      {{ KONTAKT_EMAIL }}
    </a>
    <p v-else class="mt-2 text-sm text-slate-400">
      Eine allgemeine E-Mail-Adresse für die Aktion folgt in Kürze.
    </p>
  </section>
</template>
