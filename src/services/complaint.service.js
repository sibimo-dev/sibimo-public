
import http from '@/services/http'


export async function getComplaints(params = {}) {
  const { data } = await http.get('/complaints', { params })
  return data.data ?? data // sesuaikan jika backend membungkus response beda
}

export async function getComplaint(id) {
  const { data } = await http.get(`/complaints/${id}`)
  return data.data ?? data
}


export async function createComplaint(payload) {
  const { data } = await http.post('/complaints', payload)
  return data.data ?? data
}


export async function updateComplaintStatus(id, payload) {
  const { data } = await http.patch(`/complaints/${id}/status`, payload)
  return data.data ?? data
}


export async function uploadComplaintAttachment(complaintId, file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await http.post(`/complaints/${complaintId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data ?? data
}