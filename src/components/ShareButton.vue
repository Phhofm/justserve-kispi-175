<script setup lang="ts">
withDefaults(defineProps<{ aufDunkel?: boolean }>(), { aufDunkel: false })

const titel = 'Trösterli für das Kinderspital Zürich'
const text = 'Mach mit: Trösterli für die tapferen Kinder im Kinderspital Zürich!'

async function teilen() {
  const url = window.location.href
  const nav = navigator as Navigator & { share?: (d: { title: string; text: string; url: string }) => Promise<void> }
  if (typeof nav.share === 'function') {
    try {
      await nav.share({ title: titel, text, url })
      return
    } catch {
      return
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank', 'noopener')
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
    :class="
      aufDunkel
        ? 'text-white/90 ring-1 ring-white/40 hover:bg-white/10 hover:text-white'
        : 'text-blue-700 hover:bg-blue-50'
    "
    @click="teilen"
  >
    <span aria-hidden="true">💬</span> Aktion teilen
  </button>
</template>
