import api from './api'

const HOME_CACHE_KEY = 'sibimo-public-home-v1'

const DAY_NAMES = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU']
const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
  'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES',
]

const POTENTIAL_STYLES = {
  umkm: {
    icon: 'pi-shopping-bag',
    ring: 'ring-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  agriculture: {
    icon: 'pi-sun',
    ring: 'ring-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  tourism: {
    icon: 'pi-map',
    ring: 'ring-sky-200',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
  },
  bumdes: {
    icon: 'pi-building-columns',
    ring: 'ring-indigo-200',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
}

const backendOrigin = String(api.defaults.baseURL || '').replace(/\/api\/?$/, '')

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function mediaUrl(value) {
  if (!value || typeof value !== 'string') return null
  if (/^https?:\/\//i.test(value)) return value
  const path = value.startsWith('/') ? value : `/storage/${value}`
  return `${backendOrigin}${path}`
}

function parseDate(value) {
  if (!value) return null
  const datePart = String(value).split('T')[0]
  const [year, month, day] = datePart.split('-').map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatTime(value) {
  if (!value) return ''
  return String(value).slice(0, 5).replace(':', '.')
}

function slugify(value, id) {
  const slug = String(value || 'data')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug || 'data'}-${id ?? ''}`.replace(/-$/, '')
}

function normalizeNews(items) {
  return asArray(items)
    .filter((item) => String(item?.status || '').toLowerCase() === 'published')
    .sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))
    .slice(0, 2)
    .map((item) => ({
      slug: item.slug || slugify(item.title, item.news_id),
      title: item.title || 'Tanpa judul',
      category: item.category?.category_name || item.category_name || 'Umum',
      excerpt: String(item.content || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      date: item.published_at
        ? new Date(item.published_at).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
          })
        : '',
      image: mediaUrl(item.thumbnail),
    }))
}

function normalizeAgendas(items) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return asArray(items)
    .map((item) => ({ item, date: parseDate(item.event_date) }))
    .filter(({ date }) => date && date >= today)
    .sort((a, b) => a.date - b.date)
    .slice(0, 3)
    .map(({ item, date }) => ({
      key: item.agenda_id || `${item.title}-${item.event_date}`,
      day: String(date.getDate()).padStart(2, '0'),
      month: MONTH_NAMES[date.getMonth()],
      weekday: DAY_NAMES[date.getDay()],
      title: item.title || 'Tanpa judul',
      time: item.end_time
        ? `${formatTime(item.start_time)} - ${formatTime(item.end_time)}`
        : formatTime(item.start_time),
    }))
}

function normalizePotentialCategory(value) {
  const category = String(value || '').toLowerCase()
  if (category === 'agriculture' || category === 'pertanian') return 'agriculture'
  if (category === 'tourism' || category === 'pariwisata') return 'tourism'
  if (category === 'bumdes') return 'bumdes'
  return 'umkm'
}

function normalizePotentials(items) {
  return asArray(items)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4)
    .map((item) => {
      const category = normalizePotentialCategory(item.category)
      return {
        title: item.title || 'Tanpa judul',
        desc: item.description || 'Belum ada deskripsi.',
        category,
        ...POTENTIAL_STYLES[category],
      }
    })
}

function normalizeGalleries(items) {
  return asArray(items)
    .sort((a, b) => new Date(b.uploaded_at || b.created_at) - new Date(a.uploaded_at || a.created_at))
    .slice(0, 6)
    .map((item) => ({
      image: mediaUrl(item.image),
      caption: item.title || item.description || 'Galeri Kalurahan',
    }))
}

function normalizeOrganization(items) {
  const structure = asArray(items)[0]
  const levels = asArray(structure?.levels)
  const people = levels.flatMap((level) => asArray(level.people).map((person) => ({
    nama: person.name || '',
    jabatan: person.title || '',
    desc: person.desc || '',
    photo: mediaUrl(person.photo),
    level: level.level || '',
  })))
  const lurah = people.find((person) => person.level.toLowerCase() === 'lurah') || null

  return {
    lurah,
    pamong: people.filter((person) => person !== lurah),
  }
}

export function readHomeCache() {
  try {
    const value = sessionStorage.getItem(HOME_CACHE_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function writeHomeCache(data) {
  try {
    sessionStorage.setItem(HOME_CACHE_KEY, JSON.stringify(data))
  } catch {
    // API data tetap digunakan jika session storage tidak tersedia.
  }
}

export async function fetchHomeData() {
  const requests = {
    news: api.get('/news').then((response) => normalizeNews(unwrap(response))),
    agendas: api.get('/agendas').then((response) => normalizeAgendas(unwrap(response))),
    potentials: api.get('/village-potentials').then((response) => normalizePotentials(unwrap(response))),
    galleries: api.get('/galleries').then((response) => normalizeGalleries(unwrap(response))),
    organization: api.get('/organizational-structures').then((response) => normalizeOrganization(unwrap(response))),
  }

  const entries = Object.entries(requests)
  const settled = await Promise.allSettled(entries.map(([, request]) => request))
  const data = {}
  const loaded = {}

  settled.forEach((result, index) => {
    const key = entries[index][0]
    loaded[key] = result.status === 'fulfilled'
    if (result.status === 'fulfilled') data[key] = result.value
  })

  return { data, loaded }
}
