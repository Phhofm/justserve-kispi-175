<script setup lang="ts">
import { ref } from 'vue'
import type { Beitrag } from '../lib/types'
import { fotoUrl } from '../lib/supabase'
import { mosaikLayout } from '../lib/mosaic'

const props = defineProps<{ fotos: Beitrag[] }>()
const laeuft = ref(false)

function ladeBild(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'))
    img.src = src
  })
}

async function herunterladen() {
  if (!props.fotos.length) return
  laeuft.value = true
  try {
    const pfade = props.fotos.map((b) => fotoUrl(b.foto_pfad))
    const { spalten, zeilen } = mosaikLayout(pfade.length)
    const kachel = 220
    const canvas = document.createElement('canvas')
    canvas.width = spalten * kachel
    canvas.height = zeilen * kachel
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas nicht verfügbar.')

    const bilder = await Promise.all(pfade.map(ladeBild))
    bilder.forEach((img, i) => {
      const x = (i % spalten) * kachel
      const y = Math.floor(i / spalten) * kachel
      ctx.drawImage(img, x, y, kachel, kachel)
    })

    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'))
    if (!blob) throw new Error('Mosaik konnte nicht erstellt werden.')

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'troesterli-mosaik.png'
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    laeuft.value = false
  }
}
</script>

<template>
  <section id="mosaik" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
    <h2 class="text-xl font-semibold text-slate-900">Unser Mosaik</h2>
    <p class="mt-1 text-slate-500">
      Jedes Foto ist ein Beitrag. Zusammen entsteht ein grosses Bild – Stück für Stück.
    </p>

    <template v-if="fotos.length">
      <div class="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
        <img
          v-for="b in fotos"
          :key="b.id"
          :src="fotoUrl(b.foto_pfad)"
          alt="Eingereichter Beitrag"
          class="aspect-square w-full rounded-lg object-cover"
          loading="lazy"
        />
      </div>
      <div class="mt-4 text-center">
        <button
          type="button"
          :disabled="laeuft"
          class="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
          @click="herunterladen"
        >
          {{ laeuft ? 'Wird erstellt…' : 'Mosaik herunterladen' }}
        </button>
      </div>
    </template>
    <p v-else class="mt-4 text-slate-400">
      Noch keine freigegebenen Fotos – sei die oder der Erste!
    </p>
  </section>
</template>
