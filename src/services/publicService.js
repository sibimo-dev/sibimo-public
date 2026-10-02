import api from './api'

export default {
  getNews: () => api.get('/news'),
  getNewsDetail: (id) => api.get(`/news/${id}`),
  getAgendas: () => api.get('/agendas'),
  getVillagePotentials: () => api.get('/village-potentials'),
  getServices: () => api.get('/services'),
  getGalleries: () => api.get('/galleries'),
  getLetterTypes: () => api.get('/public/letter-types'),
  // Cek NIK (Layanan Mandiri). POST supaya NIK tidak masuk URL.
  // Balasan yang dibaca ServicesView.vue: { data: { registered: boolean, masked_name: string | null } }
  // Kalau path di backend berbeda, cukup ubah string path di bawah ini
  // (cek dengan `php artisan route:list --path=public` di folder backend).
  checkCitizenNik: (nik) => api.post('/public/citizens/check-nik', { nik }),
  submitLetterRequest: (payload) => api.post('/public/letter-requests', payload),
  // Cek Pengajuan: POST supaya NIK tidak masuk URL. Endpoint ada di backend (LetterRequestController).
  lookupLetterRequests: ({ nik, requestCode }) =>
    api.post('/public/letter-requests/lookup', { nik, request_code: requestCode }),
  getLetterRequestPdf: ({ requestCode, nik, download = false }) =>
    api.post(
      `/public/letter-requests/${encodeURIComponent(requestCode)}/pdf`,
      { nik, download },
      { responseType: 'blob', timeout: 30000 }, // membuat PDF bisa lebih lama dari batas default 8 detik
    ),
  submitFeedback: (payload) => api.post('/feedbacks', payload),
}