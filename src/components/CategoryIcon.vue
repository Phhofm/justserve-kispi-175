<script setup lang="ts">
import type { CategorySlug } from '../lib/types'

const ICONS: Record<CategorySlug, string> = {
  autos: '🚗',
  sticker: '🌟',
  stempel: '🖍️',
  tiere: '🦁',
  buecher: '📚',
}

defineProps<{ slug: CategorySlug }>()
</script>

<template>
  <span aria-hidden="true">{{ ICONS[slug] }}</span>
</template>
