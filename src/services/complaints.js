import api from "./api";

export const complaintCategories = [
  { value: "Infrastructure", label: "Infrastruktur", icon: "🛠️" },
  { value: "Public Service", label: "Pelayanan Publik", icon: "👥" },
  { value: "Environment", label: "Lingkungan", icon: "🌿" },
  { value: "Security", label: "Keamanan", icon: "🛡️" },
  { value: "Other", label: "Lainnya", icon: "⚠️" },
];

function mapComplaintItem(item) {
  return {
    complaint_id: item.complaint_id,
    title: item.title,
    description: item.description,
    category: item.category,
    status: item.status,
    submitted_at: item.submitted_at,
    resolved_at: item.resolved_at,
    citizen: {
      full_name: item.reporter_name || "",
      phone_number: item.reporter_phone || "",
    },
    location: item.location ? { text: item.location, latitude: item.latitude, longitude: item.longitude } : null,
    attachments: item.attachments || [],
  };
}

export async function fetchComplaints() {
  const res = await api.get("/public/complaints");
  return res.data.data.map(mapComplaintItem);
}

export async function fetchComplaint(id) {
  const res = await api.get(`/public/complaints/${id}`);
  return mapComplaintItem(res.data.data);
}

export async function submitComplaint(payload) {
  const res = await api.post("/public/complaints", payload);
  return res.data.data;
}

export async function uploadComplaintAttachment(complaintId, file) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post(`/public/complaints/${complaintId}/attachments`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}