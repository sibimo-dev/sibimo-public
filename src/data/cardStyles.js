/* Palet pastel kartu layanan (sama seperti ServicesView lama), per nama badge. */
export const CARD_PASTEL_STYLES = {
  Sosial: {
    card: "bg-gradient-to-br from-sky-100 to-blue-50 border-sky-200 hover:border-sky-400 hover:shadow-sky-200/70",
    icon: "bg-sky-500 text-white",
    accent: "bg-sky-400",
  },
  Ekonomi: {
    card: "bg-gradient-to-br from-amber-100 to-orange-50 border-amber-200 hover:border-amber-400 hover:shadow-amber-200/70",
    icon: "bg-amber-500 text-white",
    accent: "bg-amber-400",
  },
  Umum: {
    card: "bg-gradient-to-br from-violet-100 to-purple-50 border-violet-200 hover:border-violet-400 hover:shadow-violet-200/70",
    icon: "bg-violet-500 text-white",
    accent: "bg-violet-400",
  },
};

export const DEFAULT_PASTEL_STYLE = {
  card: "bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200 hover:border-slate-400 hover:shadow-slate-200/70",
  icon: "bg-slate-500 text-white",
  accent: "bg-slate-400",
};

export const pastelOf = (badge) => CARD_PASTEL_STYLES[badge] ?? DEFAULT_PASTEL_STYLE;
