<script setup>
/* Kotak pencarian hero dengan rekomendasi (autocomplete).
   items: [{ title, type, to, keywords?: string[] }]
   Emit "search" (teks) bila pengguna menekan Cari/Enter tanpa memilih saran. */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  items: { type: Array, default: () => [] },
  placeholder: { type: String, default: "Cari layanan, berita..." },
  max: { type: Number, default: 6 },
  minChars: { type: Number, default: 2 },
});
const emit = defineEmits(["search"]);

const router = useRouter();
const root = ref(null);
const query = ref("");
const open = ref(false);
const active = ref(-1);

const norm = (s) => String(s ?? "").toLowerCase().trim();

/* Skor kecil = lebih relevan. null = tidak cocok. */
function score(item, tokens) {
  const title = norm(item.title);
  const hay = `${title} ${(item.keywords ?? []).map(norm).join(" ")}`;
  if (!tokens.every((t) => hay.includes(t))) return null;
  const first = tokens[0];
  if (title.startsWith(first)) return 0;
  if (title.split(/\s+/).some((w) => w.startsWith(first))) return 1;
  if (title.includes(first)) return 2;
  return 3; // cocok lewat kata kunci saja
}

const results = computed(() => {
  const q = norm(query.value);
  if (q.length < props.minChars) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return props.items
    .map((item) => ({ item, s: score(item, tokens) }))
    .filter((r) => r.s !== null)
    .sort((a, b) => a.s - b.s || a.item.title.localeCompare(b.item.title, "id"))
    .slice(0, props.max)
    .map((r) => r.item);
});

/* Potongan judul untuk menebalkan bagian yang cocok (tanpa v-html, aman dari XSS). */
function parts(title) {
  const tokens = norm(query.value).split(/\s+/).filter(Boolean);
  const lower = title.toLowerCase();
  const marks = new Array(title.length).fill(false);
  for (const t of tokens) {
    let i = lower.indexOf(t);
    while (i !== -1) {
      for (let k = i; k < i + t.length; k++) marks[k] = true;
      i = lower.indexOf(t, i + t.length);
    }
  }
  const out = [];
  for (let i = 0; i < title.length; i++) {
    const last = out[out.length - 1];
    if (last && last.hit === marks[i]) last.text += title[i];
    else out.push({ text: title[i], hit: marks[i] });
  }
  return out;
}

watch(results, () => { active.value = -1; });

function choose(item) {
  open.value = false;
  query.value = "";
  router.push(item.to);
}

function submit() {
  if (active.value >= 0 && results.value[active.value]) return choose(results.value[active.value]);
  open.value = false;
  if (query.value.trim()) emit("search", query.value.trim());
}

/* Berputar: -1 (tidak ada yang dipilih) → 0 → … → n-1 → -1 */
function move(step) {
  const n = results.value.length;
  if (!n) return;
  open.value = true;
  active.value = ((active.value + 1 + step + (n + 1)) % (n + 1)) - 1;
}

const onDocClick = (e) => { if (root.value && !root.value.contains(e.target)) open.value = false; };
onMounted(() => document.addEventListener("click", onDocClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
</script>

<template>
  <div ref="root" class="relative">
    <form
      class="flex items-center gap-2 rounded-full bg-black/25 backdrop-blur-md border border-white/30 p-1 w-full shadow-lg shadow-black/20 focus-within:border-white/60 focus-within:bg-black/30 transition-colors"
      role="search"
      @submit.prevent="submit"
    >
      <i class="pi pi-search text-white/80 text-base pl-3.5 shrink-0" />
      <input
        v-model="query"
        type="text"
        autocomplete="off"
        :placeholder="placeholder"
        class="flex-1 min-w-0 bg-transparent text-[14px] text-white placeholder:text-white/70 focus:outline-none py-1.5"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="open && results.length > 0"
        @input="open = true"
        @focus="open = true"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.esc="open = false"
      />
      <button
        type="submit"
        class="shrink-0 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 transition-colors text-white text-[13px] font-bold px-4 sm:px-5 py-2"
      >
        Cari
      </button>
    </form>

    <ul
      v-if="open && results.length"
      class="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-xl"
      role="listbox"
    >
      <li
        v-for="(item, i) in results"
        :key="item.type + item.title + i"
        role="option"
        :aria-selected="i === active"
        class="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-[13.5px] text-slate-800"
        :class="i === active ? 'bg-sky-50' : 'hover:bg-slate-50'"
        @mouseenter="active = i"
        @mousedown.prevent="choose(item)"
      >
        <span class="min-w-0 truncate">
          <i class="pi pi-search mr-2 text-[11px] text-slate-400" />
          <template v-for="(p, pi) in parts(item.title)" :key="pi">
            <b v-if="p.hit" class="text-sky-700">{{ p.text }}</b>
            <span v-else>{{ p.text }}</span>
          </template>
        </span>
        <span class="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">{{ item.type }}</span>
      </li>
    </ul>

    <p
      v-else-if="open && query.trim().length >= minChars"
      class="absolute left-0 right-0 z-50 mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-[13px] text-slate-500 shadow-xl"
    >
      Tidak ada saran untuk "{{ query }}". Tekan Enter untuk mencari.
    </p>
  </div>
</template>