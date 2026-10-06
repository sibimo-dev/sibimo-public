import { useResidentVerificationStore } from "@/stores/residentVerification";

export function setupGuards(router) {
  router.beforeEach((to) => {
    const resident = useResidentVerificationStore();

    // Wajib sudah terverifikasi sebagai warga
    if (to.matched.some((r) => r.meta.requiresResident) && !resident.isVerified) {
      return { name: "general-verify", query: { redirect: to.fullPath } };
    }

    // Halaman daftar warga baru hanya bisa dibuka setelah NIK diisi
    if (to.matched.some((r) => r.meta.requiresNik) && !resident.nik) {
      return { name: "general-verify" };
    }
  });
}
