// Dummy data for the Community Satisfaction Survey (development only).
// Used when VITE_USE_SURVEY_MOCK=true. Nothing here touches the real API or database.
// Data is generated with a seeded random generator, so the numbers stay the same on every reload.

import { SURVEY_ELEMENTS, SERVICE_TYPES, GENDERS, EDUCATIONS, OCCUPATIONS } from '@/data/survey'

const TOTAL_RESPONSES = 120
const DAY_MS = 24 * 60 * 60 * 1000

const SUGGESTIONS = [
  'Ruang tunggu sebaiknya diberi kipas atau pendingin, siang hari terasa panas.',
  'Proses pembuatan surat sudah cepat, terima kasih kepada petugas.',
  'Tolong tambahkan papan informasi persyaratan di depan loket.',
  'Petugas ramah dan membantu, pertahankan.',
  'Antrean kadang panjang saat jam makan siang, mohon ditambah petugas.',
  'Pengaduan lewat website belum pernah dibalas, mohon ditindaklanjuti.',
  'Tempat parkir kurang luas.',
  'Mohon jam layanan diperpanjang pada hari Jumat.',
  'Layanan online sangat membantu, tidak perlu bolak-balik ke kantor.',
  'Toilet perlu dibersihkan lebih sering.',
  'Informasi biaya sebaiknya diumumkan dengan jelas.',
  'Sudah bagus, lanjutkan.',
  'Akses untuk lansia dan disabilitas perlu ditingkatkan.',
  'Mohon ada petugas yang memandu warga yang baru pertama kali mengurus surat.',
]

// Probability of scores 1..4 per element. Some elements are intentionally weaker
// so the "Perlu dievaluasi" section on the admin page has something to show.
const DEFAULT_WEIGHTS = [0.03, 0.1, 0.45, 0.42]
const WEIGHTS_BY_ELEMENT = {
  time: [0.1, 0.3, 0.4, 0.2],
  complaints: [0.15, 0.3, 0.35, 0.2],
  facilities: [0.06, 0.22, 0.46, 0.26],
  cost: [0.02, 0.05, 0.3, 0.63],
}

function createRandom(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick(list, random) {
  return list[Math.floor(random() * list.length)]
}

function pickWeightedScore(weights, random) {
  const roll = random()
  let cumulative = 0
  for (let index = 0; index < weights.length; index++) {
    cumulative += weights[index]
    if (roll <= cumulative) return index + 1
  }
  return weights.length
}

function round(value, digits = 2) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
}

function getAverageScore(answers) {
  return round(average(SURVEY_ELEMENTS.map(element => Number(answers[element.key] ?? 0))))
}

function getAgeGroup(age) {
  if (age < 20) return '< 20 tahun'
  if (age < 30) return '20–29 tahun'
  if (age < 40) return '30–39 tahun'
  if (age < 50) return '40–49 tahun'
  return '50+ tahun'
}

const AGE_GROUP_ORDER = ['< 20 tahun', '20–29 tahun', '30–39 tahun', '40–49 tahun', '50+ tahun']

// ---------- Data generation ----------
let responses = null

function getResponses() {
  if (responses) return responses

  const random = createRandom(20260101)
  const now = Date.now()

  responses = Array.from({ length: TOTAL_RESPONSES }, (_, index) => {
    const answers = {}
    SURVEY_ELEMENTS.forEach(element => {
      answers[element.key] = pickWeightedScore(WEIGHTS_BY_ELEMENT[element.key] ?? DEFAULT_WEIGHTS, random)
    })

    return {
      id: index + 1,
      // Square the random value so more responses fall in recent months.
      created_at: new Date(now - Math.pow(random(), 1.5) * 365 * DAY_MS).toISOString(),
      service_type: pick(SERVICE_TYPES, random),
      age: 15 + Math.floor(random() * 60),
      gender: pick(GENDERS, random),
      education: pick(EDUCATIONS, random),
      occupation: pick(OCCUPATIONS, random),
      answers,
      average_score: getAverageScore(answers),
      suggestion: random() < 0.35 ? pick(SUGGESTIONS, random) : null,
    }
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return responses
}

// ---------- Aggregation ----------
function buildElements(list) {
  return SURVEY_ELEMENTS.map(element => {
    const scores = list.map(item => Number(item.answers[element.key]))
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0 }
    scores.forEach(score => { distribution[score] += 1 })
    return { key: element.key, average: round(average(scores)), distribution }
  })
}

function groupBy(list, getLabel, order) {
  const groups = new Map()
  list.forEach(item => {
    const label = getLabel(item)
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label).push(item.average_score)
  })

  const result = [...groups.entries()].map(([label, scores]) => ({
    label,
    count: scores.length,
    average: round(average(scores)),
  }))

  return order
    ? result.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label))
    : result.sort((a, b) => b.count - a.count)
}

function buildTrend(list) {
  const months = new Map()
  list.forEach(item => {
    const month = item.created_at.slice(0, 7) // YYYY-MM
    if (!months.has(month)) months.set(month, [])
    months.get(month).push(item.average_score)
  })

  return [...months.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, scores]) => ({ month, count: scores.length, average: round(average(scores)) }))
}

function buildSummary(list) {
  return {
    total_responses: list.length,
    average_score: round(average(list.map(item => item.average_score))),
    elements: buildElements(list),
  }
}

function wait(ms = 350) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ---------- Public API (same shapes as the real endpoints) ----------
export async function getMockPublicSummary() {
  await wait()
  return buildSummary(getResponses())
}

export async function getMockAdminResults({ period = 'all', service_type } = {}) {
  await wait()

  const cutoff = period === 'all' ? 0 : Date.now() - Number(period) * DAY_MS
  const list = getResponses().filter(item =>
    new Date(item.created_at).getTime() >= cutoff &&
    (!service_type || item.service_type === service_type),
  )

  return {
    ...buildSummary(list),
    by_service: groupBy(list, item => item.service_type),
    by_gender: groupBy(list, item => item.gender),
    by_age_group: groupBy(list, item => getAgeGroup(item.age), AGE_GROUP_ORDER),
    by_education: groupBy(list, item => item.education),
    by_occupation: groupBy(list, item => item.occupation),
    trend: buildTrend(list),
    responses: list,
  }
}

// Lets a submission from the form show up in the mock results (in memory only, lost on reload).
export async function addMockResponse(payload) {
  await wait()
  const list = getResponses()
  list.unshift({
    id: list.length + 1,
    created_at: new Date().toISOString(),
    service_type: payload.service_type ?? 'Lainnya',
    age: payload.age,
    gender: payload.gender,
    education: payload.education,
    occupation: payload.occupation,
    answers: { ...payload.answers },
    average_score: getAverageScore(payload.answers),
    suggestion: payload.suggestion ?? null,
  })
  return { message: 'ok' }
}