import api from './api'

const backendOrigin = String(api.defaults.baseURL || '').replace(/\/api\/?$/, '')

const CATEGORY_LABELS = {
  perkal: 'Perkal',
  'sk-lurah': 'SK Lurah',
}

const STATUS_LABELS = {
  berlaku: 'Berlaku',
  dicabut: 'Dicabut',
}

function fileUrl(path) {
  if (!path || typeof path !== 'string') return null
  if (/^https?:\/\//i.test(path)) return path
  if (path.startsWith('/storage/')) return `${backendOrigin}${path}`
  return path
}

function normalize(item) {
  return {
    id: item.legal_product_id,
    number: item.number ?? null,
    title: item.title ?? '',
    summary: item.description ?? null,
    type: CATEGORY_LABELS[item.category] ?? item.category ?? '-',
    year: Number(item.year) || null,
    date: null,
    file_size: null,
    download_count: null,
    status: STATUS_LABELS[item.status] ?? item.status ?? null,
    file_url: fileUrl(item.document),
  }
}

export async function getLegalProducts() {
  const response = await api.get('/legal-products')
  const data = response.data?.data ?? []
  return (Array.isArray(data) ? data : []).map(normalize)
}