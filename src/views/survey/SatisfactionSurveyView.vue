<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Message from 'primevue/message'
import SurveyElementBars from '@/components/survey/SurveyElementBars.vue'
import { submitSurvey, getPublicSurveySummary } from '@/services/survey.service'
import {
  SURVEY_ELEMENTS,
  GENDERS,
  EDUCATIONS,
  OCCUPATIONS,
  averageToIkm,
  getIkmGrade,
  getSatisfiedPercent,
  formatNumber,
} from '@/data/survey'

const activeTab = ref('form') // 'form' | 'results'

// ---------- Form state ----------
const profile = reactive({
  age: null,
  gender: null,
  education: null,
  occupation: null,
})
const answers = reactive({})
const suggestion = ref('')
const website = ref('') // honeypot field: real people never fill this in
const errors = reactive({})
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

const PROFILE_FIELDS = ['age', 'gender', 'education', 'occupation']
const totalRequired = PROFILE_FIELDS.length + SURVEY_ELEMENTS.length

const completedCount = computed(() => {
  const profileDone = PROFILE_FIELDS.filter(field => profile[field]).length
  const answersDone = SURVEY_ELEMENTS.filter(element => answers[element.key]).length
  return profileDone + answersDone
})
const progress = computed(() => Math.round((completedCount.value / totalRequired) * 100))

function optionClass(selected) {
  return selected
    ? 'border-primary-700 bg-primary-50 text-primary-800 ring-2 ring-primary-700/15'
    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
}

const ELEMENT_THEMES = [
  { top: 'border-t-blue-500', badge: 'bg-blue-100 text-blue-700', title: 'text-blue-700' },
  { top: 'border-t-violet-500', badge: 'bg-violet-100 text-violet-700', title: 'text-violet-700' },
  { top: 'border-t-amber-500', badge: 'bg-amber-100 text-amber-700', title: 'text-amber-700' },
  { top: 'border-t-emerald-500', badge: 'bg-emerald-100 text-emerald-700', title: 'text-emerald-700' },
  { top: 'border-t-sky-500', badge: 'bg-sky-100 text-sky-700', title: 'text-sky-700' },
  { top: 'border-t-pink-500', badge: 'bg-pink-100 text-pink-700', title: 'text-pink-700' },
  { top: 'border-t-indigo-500', badge: 'bg-indigo-100 text-indigo-700', title: 'text-indigo-700' },
  { top: 'border-t-orange-500', badge: 'bg-orange-100 text-orange-700', title: 'text-orange-700' },
  { top: 'border-t-teal-500', badge: 'bg-teal-100 text-teal-700', title: 'text-teal-700' },
]

// Selected color follows the score: 1 = rose, 2 = amber, 3 = sky, 4 = emerald
const SCORE_SELECTED = [
  'border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-400/20',
  'border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-400/20',
  'border-sky-400 bg-sky-50 text-sky-700 ring-2 ring-sky-400/20',
  'border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400/20',
]

function scoreOptionClass(score, selected) {
  return selected
    ? SCORE_SELECTED[score - 1]
    : 'border-neutral-200 bg-white text-neutral-700 hover:border-violet-300 hover:bg-violet-50/40'
}

function clearError(field) {
  delete errors[field]
}

function selectAnswer(key, score) {
  answers[key] = score
  clearError(key)
}

function validate() {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!profile.age || profile.age < 5 || profile.age > 100) errors.age = 'Masukkan umur yang valid (5–100 tahun).'
  if (!profile.gender) errors.gender = 'Pilih jenis kelamin.'
  if (!profile.education) errors.education = 'Pilih pendidikan terakhir.'
  if (!profile.occupation) errors.occupation = 'Pilih pekerjaan.'
  SURVEY_ELEMENTS.forEach(element => {
    if (!answers[element.key]) errors[element.key] = 'Pilih salah satu jawaban.'
  })

  const firstError = Object.keys(errors)[0]
  if (firstError) {
    nextTick(() => {
      document.getElementById(`field-${firstError}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
  return !firstError
}

async function handleSubmit() {
  submitError.value = ''
  if (!validate()) return

  submitting.value = true
  try {
    await submitSurvey({
      ...profile,
      answers: { ...answers },
      suggestion: suggestion.value.trim() || null,
      website: website.value,
    })
    submitted.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchSummary()
  } catch (err) {
    if (err.response?.status === 429) {
      submitError.value = 'Terlalu banyak pengiriman dari perangkat ini. Coba lagi beberapa menit lagi.'
    } else {
      const validationErrors = err.response?.data?.errors
      submitError.value = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : err.response?.data?.message || 'Survei gagal dikirim. Periksa koneksi lalu coba lagi.'
    }
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  Object.assign(profile, { age: null, gender: null, education: null, occupation: null })
  Object.keys(answers).forEach(key => delete answers[key])
  Object.keys(errors).forEach(key => delete errors[key])
  suggestion.value = ''
  submitError.value = ''
  submitted.value = false
}

// ---------- Public results ----------
const summary = ref(null)
const summaryLoading = ref(true)
const summaryError = ref('')

async function fetchSummary() {
  summaryLoading.value = true
  summaryError.value = ''
  try {
    summary.value = await getPublicSurveySummary()
  } catch (err) {
    summaryError.value = 'Hasil survei belum dapat dimuat.'
  } finally {
    summaryLoading.value = false
  }
}

onMounted(fetchSummary)

const totalResponses = computed(() => Number(summary.value?.total_responses ?? 0))
const ikmScore = computed(() => averageToIkm(summary.value?.average_score))
const ikmGrade = computed(() => getIkmGrade(ikmScore.value))
const satisfiedPercent = computed(() => getSatisfiedPercent(summary.value?.elements ?? []))
</script>

<template>
  <div class="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">

    <!-- ============ HEADER ============ -->
    <section class="flex flex-col gap-3 pt-2">
      <span class="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-500">
        <span class="h-2 w-2 rounded-full bg-violet-400" />
        Suara Warga
      </span>
      <h1 class="m-0 text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl">
        Survei Kepuasan
        <span class="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Masyarakat</span>
      </h1>
      <p class="m-0 max-w-xl text-[15px] text-neutral-500">
        Ceritakan pengalaman Anda saat mengurus layanan di Kalurahan Bimomartani.
        Masukan Anda menjadi dasar kami memperbaiki pelayanan.
      </p>
      <div class="flex flex-wrap items-center gap-2 text-[12px] font-semibold">
        <span class="rounded-full bg-violet-100 px-3 py-1 text-violet-700">Anonim</span>
        <span class="rounded-full bg-amber-100 px-3 py-1 text-amber-700">Sekitar 2 menit</span>
        <span class="rounded-full bg-sky-100 px-3 py-1 text-sky-700">{{ SURVEY_ELEMENTS.length }} unsur layanan</span>
        <span v-if="totalResponses > 0" class="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
          IKM {{ formatNumber(ikmScore, 1) }} · {{ ikmGrade.label }} · {{ formatNumber(totalResponses, 0) }} responden
        </span>
      </div>
    </section>

    <!-- ============ TABS ============ -->
    <div class="flex flex-wrap gap-2" role="tablist">
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'form'"
        class="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-[13px] font-semibold transition"
        :class="activeTab === 'form'
          ? 'border-transparent bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-violet-500/30'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-violet-300'"
        @click="activeTab = 'form'"
      >
        <i class="pi pi-pencil text-[12px]" />
        Isi Survei
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'results'"
        class="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-[13px] font-semibold transition"
        :class="activeTab === 'results'
          ? 'border-transparent bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-violet-500/30'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-violet-300'"
        @click="activeTab = 'results'"
      >
        <i class="pi pi-chart-bar text-[12px]" />
        Hasil Survei
      </button>
    </div>

    <!-- ============ TAB: FORM ============ -->
    <template v-if="activeTab === 'form'">

      <!-- Thank you state -->
      <section
        v-if="submitted"
        class="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-12 text-center"
      >
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
          <i class="pi pi-check text-2xl" />
        </span>
        <h2 class="m-0 text-xl font-bold text-emerald-900">Terima kasih atas masukan Anda</h2>
        <p class="m-0 max-w-md text-[14px] text-emerald-800">
          Jawaban Anda sudah kami terima dan akan dipakai untuk meningkatkan kualitas layanan kalurahan.
        </p>
        <div class="flex flex-wrap justify-center gap-2">
          <Button
            label="Lihat hasil survei"
            icon="pi pi-chart-bar"
            class="rounded-xl border border-transparent !bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-[13px] font-bold text-white shadow-lg shadow-violet-500/30"
            @click="activeTab = 'results'"
          />
          <Button
            label="Isi survei lagi"
            severity="secondary"
            outlined
            class="rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-100"
            @click="resetForm"
          />
        </div>
      </section>

      <form v-else class="flex flex-col gap-6" novalidate @submit.prevent="handleSubmit">

        <!-- Progress -->
        <div class="flex flex-col gap-2 rounded-2xl border border-t-4 border-neutral-200 border-t-blue-500 bg-white px-4 py-3 shadow-sm">
          <div class="flex items-center justify-between text-[12px] text-neutral-500">
            <span>{{ completedCount }} dari {{ totalRequired }} pertanyaan terjawab</span>
            <span class="font-bold text-violet-700">{{ progress }}%</span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div class="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500" :style="{ width: `${progress}%` }" />
          </div>
        </div>

        <!-- Honeypot (hidden from people) -->
        <input
          v-model="website"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
          class="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <!-- Respondent profile -->
        <section class="flex flex-col gap-5 rounded-2xl border border-t-4 border-neutral-200 border-t-violet-500 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 class="m-0 text-lg font-bold text-neutral-900">Tentang Anda</h2>
            <p class="m-0 mt-1 text-[13px] text-neutral-500">Data ini hanya dipakai untuk statistik, bukan untuk mengenali Anda.</p>
          </div>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div id="field-age" class="flex flex-col gap-1.5">
              <label class="text-[13px] font-medium text-neutral-700">Umur</label>
              <InputNumber
                v-model="profile.age"
                :min="5"
                :max="100"
                :useGrouping="false"
                suffix=" tahun"
                placeholder="Contoh: 35 tahun"
                class="w-full"
                :invalid="Boolean(errors.age)"
                @update:modelValue="clearError('age')"
              />
              <small v-if="errors.age" class="text-[12px] text-red-600">{{ errors.age }}</small>
            </div>

            <div id="field-gender" class="flex flex-col gap-1.5">
              <label class="text-[13px] font-medium text-neutral-700">Jenis kelamin</label>
              <div class="grid grid-cols-2 gap-2" role="radiogroup">
                <button
                  v-for="gender in GENDERS"
                  :key="gender"
                  type="button"
                  role="radio"
                  :aria-checked="profile.gender === gender"
                  class="rounded-lg border px-3 py-2.5 text-[13px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/40"
                  :class="optionClass(profile.gender === gender)"
                  @click="profile.gender = gender; clearError('gender')"
                >
                  {{ gender }}
                </button>
              </div>
              <small v-if="errors.gender" class="text-[12px] text-red-600">{{ errors.gender }}</small>
            </div>

            <div id="field-education" class="flex flex-col gap-1.5">
              <label class="text-[13px] font-medium text-neutral-700">Pendidikan terakhir</label>
              <Select
                v-model="profile.education"
                :options="EDUCATIONS"
                placeholder="Pilih pendidikan"
                class="w-full"
                :invalid="Boolean(errors.education)"
                @change="clearError('education')"
              />
              <small v-if="errors.education" class="text-[12px] text-red-600">{{ errors.education }}</small>
            </div>

            <div id="field-occupation" class="flex flex-col gap-1.5">
              <label class="text-[13px] font-medium text-neutral-700">Pekerjaan</label>
              <Select
                v-model="profile.occupation"
                :options="OCCUPATIONS"
                placeholder="Pilih pekerjaan"
                class="w-full"
                :invalid="Boolean(errors.occupation)"
                @change="clearError('occupation')"
              />
              <small v-if="errors.occupation" class="text-[12px] text-red-600">{{ errors.occupation }}</small>
            </div>
          </div>
        </section>

        <!-- Service elements -->
        <section class="flex flex-col gap-4">
          <div class="px-1">
            <h2 class="m-0 text-lg font-bold text-neutral-900">Unsur Pelayanan</h2>
            <p class="m-0 mt-1 text-[13px] text-neutral-500">Pilih jawaban yang paling sesuai dengan pengalaman Anda.</p>
          </div>

          <article
            v-for="(element, index) in SURVEY_ELEMENTS"
            :id="`field-${element.key}`"
            :key="element.key"
            class="flex flex-col gap-4 rounded-2xl border border-t-4 bg-white p-5 shadow-sm transition sm:p-6"
            :class="errors[element.key] ? 'border-red-300' : ['border-neutral-200', ELEMENT_THEMES[index % ELEMENT_THEMES.length].top]"
          >
            <div class="flex items-start gap-3">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold" :class="ELEMENT_THEMES[index % ELEMENT_THEMES.length].badge">
                {{ index + 1 }}
              </span>
              <div class="flex flex-col gap-0.5">
                <span class="text-[12px] font-bold" :class="ELEMENT_THEMES[index % ELEMENT_THEMES.length].title">{{ element.title }}</span>
                <h3 class="m-0 text-[15px] font-medium leading-snug text-neutral-900">{{ element.question }}</h3>
              </div>
            </div>

            <div class="flex flex-wrap gap-2" role="radiogroup" :aria-label="element.title">
              <button
                v-for="(option, optionIndex) in element.options"
                :key="option"
                type="button"
                role="radio"
                :aria-checked="answers[element.key] === optionIndex + 1"
                class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/40"
                :class="scoreOptionClass(optionIndex + 1, answers[element.key] === optionIndex + 1)"
                @click="selectAnswer(element.key, optionIndex + 1)"
              >
                <span class="flex items-center" aria-hidden="true">
                  <i
                    v-for="star in optionIndex + 1"
                    :key="star"
                    class="pi pi-star-fill text-[15px] text-amber-400"
                  />
                </span>
                <span>{{ option }}</span>
              </button>
            </div>

            <small v-if="errors[element.key]" class="text-[12px] text-red-600">{{ errors[element.key] }}</small>
          </article>
        </section>

        <!-- Suggestion -->
        <section class="flex flex-col gap-3 rounded-2xl border border-t-4 border-neutral-200 border-t-emerald-500 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 class="m-0 text-lg font-bold text-neutral-900">Saran & Masukan</h2>
            <p class="m-0 mt-1 text-[13px] text-neutral-500">Opsional. Apa yang menurut Anda perlu diperbaiki?</p>
          </div>
          <Textarea
            v-model="suggestion"
            rows="4"
            maxlength="500"
            autoResize
            placeholder="Tulis saran atau masukan Anda di sini"
            class="w-full"
          />
          <span class="self-end text-[11px] text-neutral-400">{{ suggestion.length }}/500</span>
        </section>

        <Message v-if="submitError" severity="error" :closable="false" class="text-[13px]">
          {{ submitError }}
        </Message>

        <Button
          type="submit"
          label="Kirim Survei"
          icon="pi pi-send"
          :loading="submitting"
          class="w-full rounded-xl border border-transparent !bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-[14px] font-bold text-white shadow-lg shadow-violet-500/30 hover:from-blue-700 hover:to-violet-700 sm:w-fit"
        />
      </form>
    </template>

    <!-- ============ TAB: RESULTS ============ -->
    <template v-else>
      <div v-if="summaryLoading" class="rounded-2xl border border-neutral-200 bg-white px-6 py-12 text-center text-[13px] text-neutral-400">
        Memuat hasil survei...
      </div>

      <Message v-else-if="summaryError" severity="warn" :closable="false" class="text-[13px]">
        {{ summaryError }}
      </Message>

      <div
        v-else-if="totalResponses === 0"
        class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center"
      >
        <i class="pi pi-chart-bar text-3xl text-neutral-300" />
        <p class="m-0 text-[14px] text-neutral-500">Belum ada responden. Jadilah yang pertama mengisi survei.</p>
        <Button
          label="Isi survei sekarang"
          class="rounded-xl border border-transparent !bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-[13px] font-bold text-white shadow-lg shadow-violet-500/30"
          @click="activeTab = 'form'"
        />
      </div>

      <template v-else>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div class="flex items-center gap-3 rounded-2xl border border-t-4 border-neutral-200 border-t-violet-500 bg-white p-4 shadow-sm">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600"><i class="pi pi-users text-lg" /></span>
            <div class="flex flex-col">
              <span class="text-2xl font-extrabold leading-none text-neutral-900">{{ formatNumber(totalResponses, 0) }}</span>
              <span class="mt-1 text-[12px] text-neutral-500">Responden</span>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-2xl border border-t-4 border-neutral-200 border-t-blue-500 bg-white p-4 shadow-sm">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><i class="pi pi-chart-line text-lg" /></span>
            <div class="flex flex-col">
              <span class="text-2xl font-extrabold leading-none" :class="ikmGrade.text">{{ formatNumber(ikmScore, 1) }}</span>
              <span class="mt-1 text-[12px] text-neutral-500">Nilai IKM (25–100)</span>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-2xl border border-t-4 border-neutral-200 border-t-amber-500 bg-white p-4 shadow-sm">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><i class="pi pi-star text-lg" /></span>
            <div class="flex flex-col">
              <span class="text-xl font-extrabold leading-none" :class="ikmGrade.text">{{ ikmGrade.grade }} · {{ ikmGrade.label }}</span>
              <span class="mt-1 text-[12px] text-neutral-500">Mutu pelayanan</span>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-2xl border border-t-4 border-neutral-200 border-t-emerald-500 bg-white p-4 shadow-sm">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><i class="pi pi-heart text-lg" /></span>
            <div class="flex flex-col">
              <span class="text-2xl font-extrabold leading-none text-neutral-900">{{ formatNumber(satisfiedPercent, 1) }}%</span>
              <span class="mt-1 text-[12px] text-neutral-500">Warga yang puas</span>
            </div>
          </div>
        </div>

        <section class="flex flex-col gap-4 rounded-2xl border border-t-4 border-neutral-200 border-t-sky-500 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 class="m-0 text-lg font-bold text-neutral-900">Rata-rata per unsur layanan</h2>
            <p class="m-0 mt-1 text-[13px] text-neutral-500">Skor 1–4 dari seluruh responden. Nilai IKM = rata-rata × 25.</p>
          </div>
          <SurveyElementBars :elements="summary.elements ?? []" />
        </section>
      </template>
    </template>

  </div>
</template>