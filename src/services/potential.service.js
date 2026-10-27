import { reactive } from 'vue'
import api from './api'

const backendOrigin = String(api.defaults.baseURL || '').replace(/\/api\/?$/, '')
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]']
const unwrap = (request) => request.then((response) => response.data.data)

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

function stripHtml(html) {
  if (!html) return ''
  const withBreaks = String(html)
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
  return new DOMParser().parseFromString(withBreaks, 'text/html').body.textContent.trim()
}

// Ikon tidak disimpan di DB; kategori baru memakai ikon default
const CATEGORY_ICONS = {
  umkm: 'pi pi-shop',
  pertanian: 'pi pi-sun',
  pariwisata: 'pi pi-map',
  bumdes: 'pi pi-building',
}

// reactive supaya template ikut update setelah data dimuat
export const potentialCategories = reactive([{ slug: 'all', label: 'Semua' }])

export async function loadPotentialCategories() {
  const list = await unwrap(api.get('/village-potential-categories'))
  potentialCategories.splice(
    0,
    potentialCategories.length,
    { slug: 'all', label: 'Semua' },
    ...list.map((c) => ({ slug: c.slug, label: c.name, icon: CATEGORY_ICONS[c.slug] })),
  )
}

export function categoryLabel(slug) {
  return potentialCategories.find((c) => c.slug === slug)?.label ?? slug
}

export function categoryIcon(slug) {
  return potentialCategories.find((c) => c.slug === slug)?.icon ?? 'pi pi-tag'
}

export function mapCategory(cat) {
  const c = String(cat || '').toLowerCase().trim()
  // jaga-jaga kalau masih ada data lama berkode Inggris
  const legacy = { agriculture: 'pertanian', tourism: 'pariwisata' }
  return legacy[c] ?? c
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
  const image = item.image ? mediaUrl(item.image) : null

  return {
    potential_id: item.potential_id,
    slug: item.slug || String(item.potential_id || ''),
    category,
    name: item.title || item.name || 'Tanpa Judul',
    image,
    shortDesc: stripHtml(item.short_desc || item.shortDesc || item.description || ''),
    longDesc: stripHtml(item.description || item.longDesc || item.short_desc || ''),
    location: item.location || 'Kalurahan Bimomartani',
    contact: item.contact || 'Kalurahan Bimomartani',
    extra: extra && typeof extra === 'object' ? extra : {},
  }
}

let cachedPotentials = null

export async function fetchPotentials() {
  const res = await api.get('/village-potentials')
  const rawList = Array.isArray(res.data?.data)
    ? res.data.data
    : Array.isArray(res.data)
    ? res.data
    : []

  cachedPotentials = rawList.map(normalizePotential)
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