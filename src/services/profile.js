import api from './api'

const unwrap = (request) => request.then((response) => response.data?.data ?? response.data)
const freshGet = (path) => api.get(path, { params: { _profile: Date.now() } })
const PROFILE_CACHE_KEY = 'sibimo-public-profile-v1'

export function readProfileCache() {
  try {
    const value = sessionStorage.getItem(PROFILE_CACHE_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function writeProfileCache(partial) {
  try {
    const current = readProfileCache() ?? {}
    sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ ...current, ...partial }))
  } catch {
    // Storage may be unavailable in private browsing; API data still works.
  }
}

function asArray(value) {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function asRecords(value) {
  if (Array.isArray(value)) return value
  return value && typeof value === 'object' ? [value] : []
}

function isPublished(item) {
  return String(item?.status ?? '').trim().toLowerCase() === 'published'
}

const backendOrigin = String(api.defaults.baseURL || '')
  .replace(/\/api\/?$/, '')

export function profileMediaUrl(path) {
  if (!path || typeof path !== 'string') return null
  if (/^https?:\/\//i.test(path)) return path
  if (path.startsWith('/storage/')) return `${backendOrigin}${path}`
  return path
}

export async function getHistories() {
  const data = await unwrap(freshGet('/histories'))
  const histories = asRecords(data)
  const published = histories.find(isPublished)
  return published
    ? {
        ...published,
        points: asArray(published.points),
        photos: asArray(published.photos),
      }
    : null
}

export async function getVisionMissions() {
  const data = await unwrap(freshGet('/vision-missions'))
  const visionMissions = asRecords(data)
  const published = visionMissions.find(isPublished)
  return published
    ? {
        ...published,
        missions: asArray(published.missions),
      }
    : null
}

export async function getOrganizationalStructures() {
  const data = await unwrap(freshGet('/organizational-structures'))
  return asRecords(data)
}

export async function getRegions() {
  const data = await unwrap(freshGet('/regions'))
  return Array.isArray(data) ? data : []
}
