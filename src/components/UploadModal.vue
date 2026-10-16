<script setup lang="ts">
import { ref, watch } from 'vue'
import { KATEGORIEN } from '../lib/categories'
import type { CategorySlug } from '../lib/types'
import { istErlaubtesBild } from '../lib/imageCompression'
import { reicheBeitragEin } from '../composables/useContributions'

const props = defineProps<{ offen: boolean; startKategorie?: CategorySlug }>()
const emit = defineEmits<{ geschlossen: []; eingereicht: [] }>()

const kategorie = ref<CategorySlug>('autos')
const menge = ref<number>(1)
const einreicher = ref('')
const datei = ref<File | null>(null)
const fout = ref<string | null>(null)
const laeuft = ref(false)
const fertig = ref(false)

watch(
  () => props.startKategorie,
  (v) => {
    if (v) kategorie.value = v
  },
  { immediate: true },
)

watch(
  () => props.offen,
  (v) => {
    if (v) {
      fout.value = null
      fertig.value = false
    }
  },
)

function onDatei(e: Event) {
  datei.value = (e.target as HTMLInputElement).files?.[0] ?? null
}

async function senden() {
  fout.value = null
  if (!Number.isInteger(menge.value) || menge.value < 1 || menge.value > 175) {
    fout.value = 'Die Menge muss zwischen 1 und 175 liegen.'
    return
  }
  if (!datei.value || !istErlaubtesBild(datei.value)) {
    fout.value = 'Bitte ein Bild wählen (JPEG, PNG oder WebP, max. 10 MB).'
    return
  }

  laeuft.value = true
  try {
    await reicheBeitragEin({
      kategorie: kategorie.value,
      menge: menge.value,
      einreicher: einreicher.value,
      datei: datei.value,
    })
    fertig.value = true
    emit('eingereicht')
  } catch (e) {
    fout.value = e instanceof Error ? e.message : 'Etwas ist schiefgelaufen.'
  } finally {
    laeuft.value = false
  }
}
</script>

<template>
  <div
    v-if="offen"
    class="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-slate-900/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-label="Beitrag einreichen"
    @click.self="emit('geschlossen')"
  >
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <div v-if="fertig" class="text-center">
        <p class="text-3xl">🎉</p>
        <h2 class="mt-2 text-lg font-semibold text-slate-900">
          Danke! Dein Beitrag wird geprüft.
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Sobald er freigegeben ist, erscheint er im Mosaik.
        </p>
        <button
          type="button"
          class="mt-5 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white"
          @click="emit('geschlossen')"
        >
          Schliessen
        </button>
      </div>

      <form v-else class="space-y-4" @submit.prevent="senden">
        <h2 class="text-lg font-semibold text-slate-900">Beitrag einreichen</h2>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Kategorie</span>
          <select
            v-model="kategorie"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option v-for="k in KATEGORIEN" :key="k.slug" :value="k.slug">{{ k.label }}</option>
          </select>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Menge (1–175)</span>
          <input
            v-model.number="menge"
            data-testid="menge"
            type="number"
            min="1"
            max="175"
            inputmode="numeric"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Dein Name & Gemeinde (freiwillig)</span>
          <input
            v-model="einreicher"
            type="text"
            maxlength="120"
            placeholder="z. B. Familie Muster, Gemeinde Schwamendingen"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Foto der Artikel</span>
          <input
            data-testid="foto"
            type="file"
            accept="image/*"
            capture="environment"
            class="mt-1 w-full text-sm"
            @change="onDatei"
          />
        </label>

        <p v-if="fout" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ fout }}</p>

        <div class="flex justify-end gap-2 pt-1">
          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            @click="emit('geschlossen')"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            :disabled="laeuft"
            class="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {{ laeuft ? 'Wird gesendet…' : 'Einreichen' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
