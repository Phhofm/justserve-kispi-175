<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useModeration } from '../composables/useModeration'
import { fotoUrl } from '../lib/supabase'
import { kategorieLabel } from '../lib/categories'

const { angemeldet, fehler: authFehler, init, anmelden, abmelden } = useAuth()
const { offene, laden, freigeben, ablehnen } = useModeration()

const email = ref('')
const passwort = ref('')
const laeuft = ref(false)

onMounted(async () => {
  await init()
  if (angemeldet.value) await laden()
})

async function submitLogin() {
  laeuft.value = true
  try {
    await anmelden(email.value, passwort.value)
    if (angemeldet.value) await laden()
  } finally {
    laeuft.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-slate-900 px-4 py-6 text-white">
      <div class="mx-auto flex max-w-4xl items-center justify-between">
        <h1 class="text-lg font-semibold">Moderation</h1>
        <button
          v-if="angemeldet"
          type="button"
          class="text-sm text-slate-300 hover:text-white"
          @click="abmelden"
        >
          Abmelden
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-4 py-10">
      <form
        v-if="!angemeldet"
        data-testid="login"
        class="mx-auto max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
        @submit.prevent="submitLogin"
      >
        <h2 class="text-lg font-semibold text-slate-900">Anmelden</h2>
        <label class="mt-4 block">
          <span class="text-sm font-medium text-slate-700">E-Mail</span>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label class="mt-3 block">
          <span class="text-sm font-medium text-slate-700">Passwort</span>
          <input
            v-model="passwort"
            type="password"
            required
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <p v-if="authFehler" class="mt-3 text-sm text-red-700">{{ authFehler }}</p>
        <button
          type="submit"
          :disabled="laeuft"
          class="mt-4 w-full rounded-full bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800 disabled:opacity-50"
        >
          {{ laeuft ? 'Anmelden…' : 'Anmelden' }}
        </button>
      </form>

      <div v-else>
        <h2 class="text-xl font-semibold text-slate-900">Offene Beiträge</h2>
        <p v-if="!offene.length" class="mt-4 text-slate-500">
          Zurzeit sind keine Beiträge zur Prüfung offen.
        </p>

        <ul class="mt-4 space-y-4">
          <li
            v-for="b in offene"
            :key="b.id"
            data-testid="offener-beitrag"
            class="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
          >
            <img
              :src="fotoUrl(b.foto_pfad)"
              alt="Eingereichter Beitrag"
              class="h-24 w-24 shrink-0 rounded-lg object-cover"
            />
            <div class="grow">
              <p class="font-medium text-slate-900">
                {{ kategorieLabel(b.kategorie) }} · {{ b.menge }} Stück
              </p>
              <p v-if="b.einreicher" class="text-sm text-slate-500">{{ b.einreicher }}</p>
              <div class="mt-3 flex gap-2">
                <button
                  type="button"
                  class="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                  @click="freigeben(b.id)"
                >
                  Freigeben
                </button>
                <button
                  type="button"
                  class="rounded-full bg-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
                  @click="ablehnen(b.id)"
                >
                  Ablehnen
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>
