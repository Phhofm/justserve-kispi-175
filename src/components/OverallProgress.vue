<script setup lang="ts">
import type { GesamtFortschritt } from '../lib/progress'
import ProgressBar from './ProgressBar.vue'

defineProps<{ fortschritt: GesamtFortschritt }>()
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <h2 class="text-xl font-semibold text-slate-900">Unser gemeinsamer Fortschritt</h2>
      <span class="text-2xl font-bold text-blue-700">
        {{ fortschritt.gesammelt }} / {{ fortschritt.ziel }}
      </span>
    </div>
    <p class="mt-1 text-sm text-slate-500">
      {{ fortschritt.prozent }} % von {{ fortschritt.ziel }} Trösterli – jede Spende zählt.
    </p>
    <div class="mt-4">
      <ProgressBar
        :gesammelt="fortschritt.gesammelt"
        :ziel="fortschritt.ziel"
        :prozent="fortschritt.prozent"
      />
    </div>
  </section>
</template>
