<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useContributions } from '../composables/useContributions'
import { fotoUrl } from '../lib/supabase'
import { mosaikLayout } from '../lib/mosaic'

const { beitraege, laden } = useContributions()
const laeuft = ref(false)

onMounted(laden)

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
  if (!beitraege.value.length) return
  laeuft.value = true
  try {
    const fotos = beitraege.value.map((b) => fotoUrl(b.foto_pfad))
    const { spalten, zeilen } = mosaikLayout(fotos.length)
    const kachel = 220
    const canvas = document.createElement('canvas')
    canvas.width = spalten * kachel
    canvas.height = zeilen * kachel
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas nicht verfügbar.')

    const bilder = await Promise.all(fotos.map(ladeBild))
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
  <div class="min-h-screen bg-slate-50">
    <header class="bg-gradient-to-br from-blue-700 to-indigo-700 px-4 py-12 text-center text-white">
      <h1 class="text-3xl font-bold sm:text-4xl">Das Trösterli-Mosaik</h1>
      <p class="mx-auto mt-2 max-w-xl text-blue-50">
        Jedes Foto ist ein Beitrag. Zusammen entsteht ein grosses Bild.
      </p>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-10">
      <div v-if="beitraege.length" class="mb-6 text-center">
        <button
          type="button"
          :disabled="laeuft"
          class="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
          @click="herunterladen"
        >
          {{ laeuft ? 'Wird erstellt…' : 'Mosaik herunterladen' }}
        </button>
      </div>

      <div v-if="beitraege.length" class="grid grid-cols-3 gap-2 sm:grid-cols-5">
        <img
          v-for="b in beitraege"
          :key="b.id"
          :src="fotoUrl(b.foto_pfad)"
          alt="Eingereichter Beitrag"
          class="aspect-square w-full rounded-lg object-cover"
          loading="lazy"
        />
      </div>
      <p v-else class="text-center text-slate-400">Noch keine freigegebenen Fotos.</p>
    </main>
  </div>
</template>
