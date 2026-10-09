// Directive v-reveal — animasi "fade up" saat elemen masuk viewport,
// terinspirasi animasi scroll-reveal yang dipakai di web referensi
// (smkn1kasreman.sch.id). Dibuat custom & ringan (pakai IntersectionObserver
// bawaan browser) daripada nambah dependency AOS/animate-on-scroll baru.
//
// Cara pakai di template:
//   <section v-reveal>...</section>
//   <section v-reveal="{ delay: 150 }">...</section>   -> delay dalam ms
//
// Styling animasinya ada di src/style.css, di bagian "[data-reveal]".

const observer =
  typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      )
    : null;

export const vReveal = {
  mounted(el, binding) {
    el.setAttribute("data-reveal", "");

    const delay = binding.value?.delay ?? 0;
    if (delay) el.style.transitionDelay = `${delay}ms`;

    if (!observer) {
      // Fallback (browser lama / SSR): langsung tampilkan tanpa animasi.
      el.classList.add("reveal-visible");
      return;
    }
    observer.observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
