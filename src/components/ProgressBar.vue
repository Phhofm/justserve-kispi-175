<script setup lang="ts">
import { computed } from 'vue'
import { balkenBreite } from '../lib/progress'

const props = withDefaults(
  defineProps<{
    gesammelt: number
    ziel: number
    prozent: number
    farbe?: string
  }>(),
  { farbe: '#2563eb' },
)

const breite = computed(() => `${balkenBreite(props.prozent)}%`)
const zielErreicht = computed(() => props.prozent >= 100)
</script>

<template>
  <div>
    <div
      class="h-3 w-full overflow-hidden rounded-full bg-slate-200"
      role="progressbar"
      :aria-valuenow="prozent"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        data-testid="balken"
        class="h-full rounded-full transition-all duration-700 ease-out"
        :style="{ width: breite, backgroundColor: farbe }"
      />
    </div>
    <div class="mt-1.5 flex items-center justify-between text-sm text-slate-600">
      <span>{{ gesammelt }} / {{ ziel }} ({{ prozent }} %)</span>
      <span v-if="zielErreicht" class="font-medium text-emerald-600">Ziel erreicht 🎉</span>
    </div>
  </div>
</template>
