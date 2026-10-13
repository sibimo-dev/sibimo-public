import api from './api'

// v3: jumlah berita (4) & aduan (3) berubah, jadi cache lama (v2) tidak dipakai lagi.
const HOME_CACHE_KEY = 'sibimo-public-home-v4'

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
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]']

/* Bentuk respons backend bisa bermacam-macam:
   [..]  |  { data: [..] }  |  { data: { data: [..] } } (paginate)  |  { items: [..] }
   Semuanya diratakan jadi array biasa. */
function unwrapList(response) {
  const body = response?.data
  const candidates = [body?.data?.data, body?.data, body?.items, body]
  return candidates.find(Array.isArray) ?? []
}

// Struktur organisasi bisa berupa array, atau satu objek yang langsung punya `levels`.
function unwrapOrganization(response) {
  const list = unwrapList(response)
  if (list.length) return list
  const single = response?.data?.data ?? response?.data
  return single && typeof single === 'object' && Array.isArray(single.levels) ? [single] : []
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

// Ambil nilai teks pertama yang terisi dari beberapa kemungkinan nama field.
function pick(item, keys) {
  for (const key of keys) {
    const value = item?.[key]
    if (typeof value === 'string' && value.trim()) return value
  }
  return null
}

/* Mengubah path gambar dari backend jadi alamat lengkap.
   Aturannya sama dengan mediaUrl() di sibimo-admin:
   "galleries/a.jpg" | "/storage/galleries/a.jpg" | "storage/galleries/a.jpg"
   semuanya jadi  <backend>/storage/galleries/a.jpg */
function mediaUrl(value) {
  if (!value || typeof value !== 'string') return null
  const source = value.trim()
  if (!source) return null

  if (/^https?:\/\//i.test(source)) {
    // APP_URL di .env backend sering berbeda dari alamat yang dipakai saat dev
    // (mis. http://localhost tanpa :8000). Untuk host lokal, pakai alamat backend yang benar.
    try {
      const url = new URL(source)
      if (LOCAL_HOSTS.includes(url.hostname) && url.pathname.startsWith('/storage/')) {
        return `${backendOrigin}${url.pathname}${url.search}`
      }
    } catch {
      // URL tidak valid: pakai apa adanya
    }
    return source
  }

  if (source.startsWith('/storage/')) return `${backendOrigin}${source}`
  if (source.startsWith('storage/')) return `${backendOrigin}/${source}`
  return `${backendOrigin}/storage/${source.replace(/^\/+/, '')}`
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
    .slice(0, 6)
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
      image: mediaUrl(pick(item, ['thumbnail', 'thumbnail_url', 'image', 'image_url', 'cover'])),
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
      image: mediaUrl(pick(item, ['image', 'image_url', 'photo', 'photo_url', 'file_path', 'path', 'url'])),
      caption: item.title || item.description || 'Galeri Kalurahan',
    }))
}

const COMPLAINT_STATUS_META = {
  Submitted: { label: 'Diajukan', severity: 'info' },
  'In Progress': { label: 'Diproses', severity: 'warn' },
  Resolved: { label: 'Selesai', severity: 'success' },
  Rejected: { label: 'Ditolak', severity: 'danger' },
}

function complaintInitials(name) {
  const initials = String(name || 'Anonim')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return initials || 'AN'
}

function normalizeComplaints(items) {
  return asArray(items)
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .slice(0, 3)
    .map((item) => {
      const status = COMPLAINT_STATUS_META[item.status] || {
        label: item.status || 'Diajukan',
        severity: 'info',
      }

      return {
        complaint_id: item.complaint_id,
        title: item.title || 'Tanpa judul',
        reporter: item.reporter_name || 'Anonim',
        initials: complaintInitials(item.reporter_name),
        date: item.submitted_at
          ? new Date(item.submitted_at).toLocaleDateString('id-ID', {
              day: '2-digit', month: 'short', year: 'numeric',
            })
          : '',
        status: status.label,
        severity: status.severity,
      }
    })
}

function normalizeOrganization(items) {
  const structure = asArray(items)[0]
  const levels = asArray(structure?.levels)
  const people = levels.flatMap((level) => asArray(level.people).map((person) => ({
    nama: person.name || '',
    jabatan: person.title || '',
    desc: person.desc || '',
    photo: mediaUrl(pick(person, ['photo', 'photo_url', 'image', 'image_url', 'picture'])),
    level: level.level || '',
  })))
  const lurah = people.find((person) => person.level.toLowerCase() === 'lurah') || null

  return {
    lurah,
    pamong: people.filter((person) => person !== lurah),
  }
}

/* Aduan untuk beranda. Utamanya /public/complaints; kalau route itu tidak ada (404)
   di backend, coba /complaints (endpoint daftar aduan yang dipakai service aduan). */
async function fetchComplaintsResponse() {
  try {
    return await api.get('/public/complaints')
  } catch (error) {
    if (error?.response?.status !== 404) throw error
    console.warn('[Home] /public/complaints tidak ditemukan (404), mencoba /complaints.')
    return api.get('/complaints')
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
    news: api.get('/news').then((response) => normalizeNews(unwrapList(response))),
    agendas: api.get('/agendas').then((response) => normalizeAgendas(unwrapList(response))),
    potentials: api.get('/village-potentials').then((response) => normalizePotentials(unwrapList(response))),
    galleries: api.get('/galleries').then((response) => normalizeGalleries(unwrapList(response))),
    complaints: fetchComplaintsResponse().then((response) => normalizeComplaints(unwrapList(response))),
    organization: api.get('/organizational-structures').then((response) => normalizeOrganization(unwrapOrganization(response))),
  }

  const entries = Object.entries(requests)
  const settled = await Promise.allSettled(entries.map(([, request]) => request))
  const data = {}
  const loaded = {}

  settled.forEach((result, index) => {
    const key = entries[index][0]
    loaded[key] = result.status === 'fulfilled'

    if (result.status === 'fulfilled') {
      data[key] = result.value
    } else {
      // Muncul di Console supaya jelas bagian mana yang gagal dan kenapa.
      const reason = result.reason
      const status = reason?.response?.status ?? reason?.code ?? 'tanpa respons'
      console.warn(`[Home] Gagal memuat "${key}" (${status}).`, reason?.config?.url ?? '')
    }
  })

  return { data, loaded }
}