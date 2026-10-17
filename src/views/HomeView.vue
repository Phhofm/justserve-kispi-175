<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { KATEGORIEN_IM_GESAMTZIEL } from '../lib/categories'
import type { CategorySlug } from '../lib/types'
import { useContributions } from '../composables/useContributions'
import HeroSection from '../components/HeroSection.vue'
import OverallProgress from '../components/OverallProgress.vue'
import ScriptureBand from '../components/ScriptureBand.vue'
import AboutSection from '../components/AboutSection.vue'
import Timeline from '../components/Timeline.vue'
import HowItWorks from '../components/HowItWorks.vue'
import HintsSection from '../components/HintsSection.vue'
import CategoryCard from '../components/CategoryCard.vue'
import MutmacherSection from '../components/MutmacherSection.vue'
import DonationSection from '../components/DonationSection.vue'
import MosaicSection from '../components/MosaicSection.vue'
import KontaktSection from '../components/KontaktSection.vue'
import UploadModal from '../components/UploadModal.vue'
import SiteFooter from '../components/SiteFooter.vue'

const { beitraege, fortschritt, fehler, laden } = useContributions()
const uploadOffen = ref(false)
const startKategorie = ref<CategorySlug | undefined>(undefined)

const mutmacher = computed(
  () => fortschritt.value.kategorien.find((k) => k.slug === 'mutmacher')!,
)

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

    <main id="main" class="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <!-- Die Schriftstelle mit den Kindern steht ganz oben, direkt unter dem Hero. -->
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <ScriptureBand
          stelle="3. Nephi 17,21"
          zitat="Und er **nahm ihre kleinen Kinder, eines nach dem anderen, und segnete sie**."
        />
      </div>

      <div class="mt-6">
        <OverallProgress :fortschritt="fortschritt" />
      </div>

      <p v-if="fehler" class="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {{ fehler }}
      </p>

      <div class="mt-6 space-y-6">
        <AboutSection />
        <Timeline />
        <HowItWorks />
      </div>

      <div class="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <ScriptureBand
          stelle="Matthäus 18,10"
          zitat="Hütet euch davor, einen von diesen Kleinen zu verachten! Denn ich sage euch: **Ihre Engel im Himmel sehen stets das Angesicht meines himmlischen Vaters.**"
        />
      </div>

      <div class="mt-6">
        <HintsSection />
      </div>

      <div class="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <ScriptureBand
          stelle="Johannes 14,26"
          zitat="Der **Tröster** aber, der Heilige Geist, den der Vater in meinem Namen senden wird, der wird euch alles lehren."
        />
      </div>

      <h2 class="mt-10 text-xl font-semibold text-slate-900">Was wir sammeln</h2>
      <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CategoryCard
          v-for="k in KATEGORIEN_IM_GESAMTZIEL"
          :key="k.slug"
          :kategorie="k"
          :fortschritt="fortschritt.kategorien.find((x) => x.slug === k.slug)!"
          :fotos="fotosFuer(k.slug)"
          @einreichen="oeffneUpload"
        />
      </div>

      <div class="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <ScriptureBand
          stelle="LuB 18,10"
          zitat="Denkt daran: Der Wert einer Seele ist gross in den Augen Gottes."
        />
      </div>

      <div class="mt-6">
        <MutmacherSection
          :fortschritt="mutmacher"
          :fotos="fotosFuer('mutmacher')"
          @einreichen="oeffneUpload('mutmacher')"
        />
      </div>

      <div class="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <ScriptureBand
          stelle="Jesaja 40,11"
          zitat="Wie ein Hirt weidet er seine Herde, **auf seinem Arm sammelt er die Lämmer, an seiner Brust trägt er sie**, die Mutterschafe führt er behutsam."
        />
      </div>

      <div class="mt-10">
        <DonationSection />
      </div>

      <div class="mt-10">
        <MosaicSection :fotos="beitraege" />
      </div>

      <div class="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <ScriptureBand
          stelle="3. Nephi 22,13"
          zitat="Und alle deine Kinder werden vom Herrn gelehrt werden; und gross wird der Friede deiner Kinder sein."
        />
      </div>

      <div class="mt-10">
        <KontaktSection />
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
