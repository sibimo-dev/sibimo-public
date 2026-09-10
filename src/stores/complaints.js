import { reactive } from 'vue'
import { defineStore } from 'pinia'

let nextComplaintId = 1
let nextAttachmentId = 1

function buildDummyComplaints() {
  const now = Date.now()
  const daysAgo = (n) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString()

  return [
    {
      complaint_id: nextComplaintId++,
      title: 'Jalan berlubang di Jl. Merdeka',
      description:
        'Jalan di depan balai warga berlubang cukup dalam sejak musim hujan lalu. Sudah ada beberapa pengendara motor yang terjatuh saat malam hari karena lubang tidak terlihat jelas.',
      category: 'Infrastructure',
      status: 'Submitted',
      submitted_at: daysAgo(1),
      citizen: {
        full_name: 'Budi Santoso',
        phone_number: '081234567890',
      },
      location: { text: 'Jl. Merdeka, depan Balai Warga RT 03' },
      attachments: [
        { attachment_id: nextAttachmentId++, file_name: 'jalan-berlubang.jpg', file_path: 'https://picsum.photos/seed/jalan1/400/400', mime_type: 'image/jpeg' },
      ],
    },
    {
      complaint_id: nextComplaintId++,
      title: 'Pelayanan loket surat lambat',
      description:
        'Pengurusan surat pengantar di kantor kalurahan memakan waktu lebih dari 3 hari padahal biasanya bisa selesai sehari. Mohon ada perbaikan alur pelayanan.',
      category: 'Public Service',
      status: 'In Progress',
      submitted_at: daysAgo(3),
      citizen: {
        full_name: 'Siti Aminah',
        phone_number: '082198765432',
      },
      location: { text: 'Kantor Kalurahan, loket pelayanan surat' },
      attachments: [],
    },
    {
      complaint_id: nextComplaintId++,
      title: 'Tumpukan sampah di pinggir sungai',
      description:
        'Ada tumpukan sampah rumah tangga yang dibuang sembarangan di bantaran sungai dekat jembatan Dusun Karang. Sudah mulai berbau dan berpotensi mencemari air sungai.',
      category: 'Environment',
      status: 'Resolved',
      submitted_at: daysAgo(7),
      citizen: {
        full_name: 'Agus Wijaya',
        phone_number: '085711223344',
      },
      location: { text: 'Bantaran sungai dekat Jembatan Dusun Karang' },
      attachments: [
        { attachment_id: nextAttachmentId++, file_name: 'sampah-sungai.jpg', file_path: 'https://picsum.photos/seed/sampah1/400/400', mime_type: 'image/jpeg' },
        { attachment_id: nextAttachmentId++, file_name: 'sampah-sungai-2.jpg', file_path: 'https://picsum.photos/seed/sampah2/400/400', mime_type: 'image/jpeg' },
      ],
    },
    {
      complaint_id: nextComplaintId++,
      title: 'Lampu jalan mati di gang sempit',
      description:
        'Lampu penerangan jalan umum di gang antara RT 05 dan RT 06 sudah mati sekitar dua minggu. Warga khawatir soal keamanan saat malam hari karena gang cukup gelap dan sepi.',
      category: 'Security',
      status: 'Submitted',
      submitted_at: daysAgo(2),
      citizen: {
        full_name: 'Rina Kusuma',
        phone_number: '087812345678',
      },
      location: { text: 'Gang antara RT 05 dan RT 06, Dusun Sumber' },
      attachments: [],
    },
    {
      complaint_id: nextComplaintId++,
      title: 'Pengajuan surat ditolak tanpa alasan jelas',
      description:
        'Pengajuan surat keterangan tidak mampu saya ditolak tanpa penjelasan detail. Mohon ada kejelasan dokumen apa yang masih kurang agar bisa segera dilengkapi.',
      category: 'Other',
      status: 'Rejected',
      submitted_at: daysAgo(10),
      citizen: {
        full_name: 'Dedi Kurniawan',
        phone_number: '089955667788',
      },
      location: null,
      attachments: [],
    },
  ]
}

export const useComplaintsStore = defineStore('complaints', () => {
  const state = reactive({
    complaints: buildDummyComplaints(),
  })

  /**
   * Masih DUMMY: menyimpan ke state Pinia lokal, BELUM memanggil API/backend.
   * @param {Object} payload
   * @param {string} payload.title
   * @param {string} payload.description
   * @param {string} payload.category - salah satu value di COMPLAINT_CATEGORIES
   * @param {Object} payload.citizen - { full_name, phone_number }
   * @param {{text: string, latitude?: number, longitude?: number}|null} [payload.location]
   * @param {Array<{file: File, previewUrl: string|null}>} [payload.attachments]
   * @returns {Object} complaint yang baru dibuat
   */
  function addComplaint(payload) {
    const complaint_id = nextComplaintId++

    const attachments = (payload.attachments ?? []).map((item) => ({
      attachment_id: nextAttachmentId++,
      file_name: item.file?.name ?? item.name ?? 'lampiran',
      // Dummy: pakai object URL lokal browser sebagai pengganti URL dari server.
      file_path: item.previewUrl ?? (item.file ? URL.createObjectURL(item.file) : null),
      mime_type: item.file?.type ?? item.type ?? '',
    }))

    const complaint = {
      complaint_id,
      title: payload.title,
      description: payload.description,
      category: payload.category, // sudah PascalCase, mis. 'Infrastructure'
      status: 'Submitted', // status awal sama seperti default di admin
      submitted_at: new Date().toISOString(),
      citizen: {
        full_name: payload.citizen?.full_name ?? '',
        phone_number: payload.citizen?.phone_number ?? '',
      },
      location: payload.location ?? null, // { text, latitude, longitude } | null
      attachments,
    }

    state.complaints.unshift(complaint)
    return complaint
  }

  function updateStatus(complaint_id, status) {
    const found = state.complaints.find((c) => c.complaint_id === complaint_id)
    if (found) found.status = status
    return found
  }

  return { state, addComplaint, updateStatus }
})
