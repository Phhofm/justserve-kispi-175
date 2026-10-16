<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { KATEGORIEN } from '../lib/categories'
import type { CategorySlug } from '../lib/types'
import { useContributions } from '../composables/useContributions'
import HeroSection from '../components/HeroSection.vue'
import OverallProgress from '../components/OverallProgress.vue'
import AboutSection from '../components/AboutSection.vue'
import HowItWorks from '../components/HowItWorks.vue'
import HintsSection from '../components/HintsSection.vue'
import CategoryCard from '../components/CategoryCard.vue'
import DonationSection from '../components/DonationSection.vue'
import MosaicSection from '../components/MosaicSection.vue'
import UploadModal from '../components/UploadModal.vue'
import SiteFooter from '../components/SiteFooter.vue'

const { beitraege, fortschritt, fehler, laden } = useContributions()
const uploadOffen = ref(false)
const startKategorie = ref<CategorySlug | undefined>(undefined)

function fotosFuer(slug: CategorySlug) {
  return beitraege.value.filter((b) => b.kategorie === slug)
}

function oeffneUpload(slug?: CategorySlug) {
  startKategorie.value = slug
  uploadOffen.value = true
}

onMounted(laden)
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-blue-700"
    >
      Zum Inhalt springen
    </a>

    <HeroSection :gesamtziel="fortschritt.ziel" @beitragen="oeffneUpload()" />

    <main id="main" class="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <OverallProgress :fortschritt="fortschritt" />

      <p v-if="fehler" class="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {{ fehler }}
      </p>

      <div class="mt-8 space-y-6">
        <AboutSection />
        <HowItWorks />
        <HintsSection />
      </div>

      <h2 class="mt-10 text-xl font-semibold text-slate-900">Was wir sammeln</h2>
      <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CategoryCard
          v-for="k in KATEGORIEN"
          :key="k.slug"
          :kategorie="k"
          :fortschritt="fortschritt.kategorien.find((x) => x.slug === k.slug)!"
          :fotos="fotosFuer(k.slug)"
          @einreichen="oeffneUpload"
        />
      </div>

      <div class="mt-10">
        <DonationSection />
      </div>

      <div class="mt-10">
        <MosaicSection :fotos="beitraege" />
      </div>
    </main>

    <SiteFooter />

    <UploadModal
      :offen="uploadOffen"
      :start-kategorie="startKategorie"
      @geschlossen="uploadOffen = false"
      @eingereicht="laden"
    />
  </div>
</template>
