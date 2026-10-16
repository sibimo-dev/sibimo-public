import api from './api'
import {
  potentials as fallbackPotentials,
  potentialCategories as fallbackCategories,
  categoryLabel as rawCategoryLabel,
  categoryIcon as rawCategoryIcon,
} from '@/views/potential/potentialData.js'

const backendOrigin = String(api.defaults.baseURL || '').replace(/\/api\/?$/, '')
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]']

function mediaUrl(value) {
  if (!value || typeof value !== 'string') return null
  const source = value.trim()
  if (!source) return null

  if (/^https?:\/\//i.test(source)) {
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

export const potentialCategories = fallbackCategories
export const categoryLabel = rawCategoryLabel
export const categoryIcon = rawCategoryIcon

export function mapCategory(cat) {
  const c = String(cat || '').toLowerCase().trim()
  if (c === 'agriculture' || c === 'pertanian') return 'pertanian'
  if (c === 'tourism' || c === 'pariwisata') return 'pariwisata'
  if (c === 'bumdes') return 'bumdes'
  return 'umkm'
}

export function normalizePotential(item) {
  if (!item) return null

  let extra = item.extra_info ?? item.extra ?? {}
  if (typeof extra === 'string') {
    try {
      extra = JSON.parse(extra)
    } catch {
      extra = {}
    }
  }

  const category = mapCategory(item.category)
  const image = item.image
    ? (item.image.startsWith('/images/') ? item.image : mediaUrl(item.image))
    : null

  return {
    potential_id: item.potential_id,
    slug: item.slug || String(item.potential_id || ''),
    category,
    name: item.title || item.name || 'Tanpa Judul',
    image,
    shortDesc: item.short_desc || item.shortDesc || item.description || '',
    longDesc: item.description || item.longDesc || item.short_desc || '',
    location: item.location || 'Kalurahan Bimomartani',
    contact: item.contact || 'Kalurahan Bimomartani',
    extra: extra && typeof extra === 'object' ? extra : {},
  }
}

let cachedPotentials = null

export async function fetchPotentials() {
  try {
    const res = await api.get('/village-potentials')
    const rawList = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
      ? res.data
      : []

    if (rawList.length > 0) {
      cachedPotentials = rawList.map(normalizePotential)
      return cachedPotentials
    }
  } catch (error) {
    console.warn('[Potential] Gagal memuat dari API, menggunakan data fallback lokal:', error)
  }

  // Fallback ke data lokal jika API bermasalah atau kosong
  cachedPotentials = fallbackPotentials.map(normalizePotential)
  return cachedPotentials
}

export async function fetchPotentialBySlug(slug) {
  if (!slug) return null

  // Coba ambil dari cache terlebih dahulu
  if (cachedPotentials) {
    const found = cachedPotentials.find((p) => p.slug === slug || String(p.potential_id) === slug)
    if (found) return found
  }

  try {
    const res = await api.get(`/village-potentials/${encodeURIComponent(slug)}`)
    const raw = res.data?.data ?? res.data
    if (raw) return normalizePotential(raw)
  } catch (error) {
    console.warn(`[Potential] Gagal memuat detail slug "${slug}" dari API:`, error)
  }

  // Jika belum ada di cache atau API 404, ambil list lengkap
  const all = await fetchPotentials()
  return all.find((p) => p.slug === slug || String(p.potential_id) === slug) ?? null
}

export async function getRelatedPotentials(category, excludeSlug, limit = 3) {
  const all = cachedPotentials || (await fetchPotentials())
  return all
    .filter((p) => p.category === category && p.slug !== excludeSlug)
    .slice(0, limit)
}
