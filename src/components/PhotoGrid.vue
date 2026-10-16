<script setup lang="ts">
import type { Beitrag } from '../lib/types'
import { fotoUrl } from '../lib/supabase'

defineProps<{ fotos: Beitrag[] }>()
</script>

<template>
  <div v-if="fotos.length" class="grid grid-cols-3 gap-2 sm:grid-cols-4">
    <figure
      v-for="foto in fotos"
      :key="foto.id"
      class="aspect-square overflow-hidden rounded-lg bg-slate-100"
    >
      <img
        :src="fotoUrl(foto.foto_pfad)"
        alt="Eingereichter Beitrag"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <figcaption v-if="foto.einreicher" class="sr-only">{{ foto.einreicher }}</figcaption>
    </figure>
  </div>
  <p v-else class="text-sm text-slate-400">Noch keine Fotos.</p>
</template>
