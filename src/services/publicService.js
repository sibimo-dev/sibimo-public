import api from './api'

export default {
  getNews: () => api.get('/news'),
  getNewsDetail: (id) => api.get(`/news/${id}`),
  getAgendas: () => api.get('/agendas'),
  getVillagePotentials: () => api.get('/village-potentials'),
  getServices: () => api.get('/services'),
  getGalleries: () => api.get('/galleries'),
  getLetterTypes: () => api.get('/public/letter-types'),
  submitLetterRequest: (payload) => api.post('/public/letter-requests', payload),
  checkLetterStatus: (id, nik) => api.get(`/public/letter-requests/${id}/status`, { params: { nik } }),
  submitFeedback: (payload) => api.post('/feedbacks', payload),
}