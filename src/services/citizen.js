import api from './api'

const CACHE_KEY = 'sibimo-public-citizen-statistics-v1'

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null
}

export function readCitizenStatisticsCache() {
  try {
    const value = sessionStorage.getItem(CACHE_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function writeCitizenStatisticsCache(value) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(value))
  } catch {
    // Session storage may be unavailable; the API response remains usable.
  }
}

export async function getCitizenStatistics() {
  const response = await api.get('/citizen-statistics', {
    params: { _statistics: Date.now() },
  })
  return unwrap(response) ?? { summary: {}, categories: {}, regions: [] }
}
