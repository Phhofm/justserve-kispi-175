<script setup lang="ts">
import type { CategorySlug } from '../lib/types'

defineProps<{ offen: boolean; startKategorie?: CategorySlug }>()
defineEmits<{ geschlossen: []; eingereicht: [] }>()
</script>

<template>
  <div
    v-if="offen"
    class="fixed inset-0 z-40 grid place-items-center bg-slate-900/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-label="Beitrag einreichen"
    @click.self="$emit('geschlossen')"
  >
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <h2 class="text-lg font-semibold text-slate-900">Beitrag einreichen</h2>
      <p class="mt-2 text-sm text-slate-500">Das Formular folgt im nächsten Schritt.</p>
      <button
        type="button"
        class="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        @click="$emit('geschlossen')"
      >
        Schliessen
      </button>
    </div>
  </div>
</template>
