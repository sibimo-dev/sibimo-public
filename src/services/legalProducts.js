import api from './api'

export const fallbackLegalProducts = [
  {
    id: 1,
    number: 'Peraturan Kalurahan No. 04 Tahun 2026',
    title: 'Anggaran Pendapatan dan Belanja Kalurahan (APBKal) Tahun Anggaran 2026',
    summary: 'Rincian pendapatan kalurahan, alokasi dana transfer, belanja operasional, program ketahanan pangan, dan pembiayaan kalurahan.',
    type: 'Perkal',
    year: 2026,
    date: '2026-01-15',
    file_size: '2.4 MB',
    download_count: 3420,
    status: 'Berlaku',
    file_url: null,
  },
  {
    id: 2,
    number: 'SK Lurah No. 12/KPTS/2026',
    title: 'Pembentukan Kelompok Usaha Bersama (KUB) Mandiri Sejahtera',
    summary: 'Struktur kepengurusan, pendamping teknis, serta tata kelola permodalan bergulir bagi kelompok usaha mikro padukuhan.',
    type: 'SK Lurah',
    year: 2026,
    date: '2026-02-24',
    file_size: '1.2 MB',
    download_count: 890,
    status: 'Berlaku',
    file_url: null,
  },
  {
    id: 3,
    number: 'Peraturan Kalurahan No. 02 Tahun 2025',
    title: 'Tata Kelola Sampah dan Kebersihan Lingkungan Terpadu Padukuhan',
    summary: 'Wajib pilah sampah organik dan anorganik dari hulu, operasional bank sampah padukuhan, larangan pembakaran sampah.',
    type: 'Perkal',
    year: 2025,
    date: '2025-11-14',
    file_size: '3.8 MB',
    download_count: 2150,
    status: 'Berlaku',
    file_url: null,
  },
  {
    id: 4,
    number: 'SK Lurah No. 08/KPTS/2024',
    title: 'Penetapan Kader Posyandu Balita dan Lansia Dusun Karanggeneng',
    summary: 'Legalitas tim kader kesehatan masyarakat, pemberian uang kehormatan operasional, pembagian jadwal penimbangan.',
    type: 'SK Lurah',
    year: 2024,
    date: '2024-03-08',
    file_size: '890 KB',
    download_count: 674,
    status: 'Berlaku',
    file_url: null,
  },
]

const backendOrigin = String(api.defaults.baseURL || '').replace(/\/api\/?$/, '')

function fileUrl(path) {
  if (!path || typeof path !== 'string') return null
  if (/^https?:\/\//i.test(path)) return path
  if (path.startsWith('/storage/')) return `${backendOrigin}${path}`
  return path
}

function normalize(item, index) {
  const date = item.date ?? item.tanggal ?? null
  const downloads = item.download_count ?? item.downloads ?? item.jumlah_unduhan

  return {
    id: item.id ?? index + 1,
    number: item.number ?? item.nomor ?? null,
    title: item.title ?? item.judul ?? '',
    summary: item.summary ?? item.ringkasan ?? item.description ?? null,
    type: item.type ?? item.category ?? item.jenis ?? '-',
    year: Number(item.year ?? item.tahun) || (date ? new Date(date).getFullYear() || null : null),
    date,
    file_size: item.file_size ?? item.ukuran ?? null,
    download_count: downloads != null ? Number(downloads).toLocaleString('id-ID') : null,
    status: item.status ?? null,
    file_url: fileUrl(item.file_url ?? item.file ?? item.document),
  }
}

export async function getLegalProducts() {
  try {
    const response = await api.get('/legal-products')
    const data = response.data?.data ?? response.data
    return (Array.isArray(data) ? data : []).map(normalize)
  } catch {
    return fallbackLegalProducts.map(normalize)
  }
}