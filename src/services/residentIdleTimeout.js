import { watch } from "vue";
import { useResidentVerificationStore } from "@/stores/residentVerification";

export const RESIDENT_IDLE_TIMEOUT_MS = 10 * 60 * 1000;

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll", "wheel"];

/**
 * Mengakhiri sesi verifikasi NIK setelah 10 menit tanpa aktivitas.
 * Penghitung dimulai kembali setiap ada interaksi pengguna dan juga aktif
 * kembali setelah halaman dimuat ulang jika sesi masih tersimpan.
 */
export function setupResidentIdleTimeout(router) {
  if (typeof window === "undefined") return () => {};

  const resident = useResidentVerificationStore();
  let timer = null;

  const clearTimer = () => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  const expireSession = async () => {
    if (!resident.isVerified) {
      clearTimer();
      return;
    }

    resident.reset();
    await router.replace({ name: "home" });
  };

  const armTimer = () => {
    clearTimer();
    if (!resident.isVerified) return;
    timer = window.setTimeout(expireSession, RESIDENT_IDLE_TIMEOUT_MS);
  };

  const onActivity = () => armTimer();
  ACTIVITY_EVENTS.forEach((eventName) => window.addEventListener(eventName, onActivity, { passive: true }));
  const stopWatch = watch(() => resident.isVerified, armTimer, { immediate: true });

  return () => {
    stopWatch();
    clearTimer();
    ACTIVITY_EVENTS.forEach((eventName) => window.removeEventListener(eventName, onActivity));
  };
}
