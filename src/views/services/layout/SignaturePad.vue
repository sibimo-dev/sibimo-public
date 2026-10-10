<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({ modelValue: { type: String, default: "" } });
const emit = defineEmits(["update:modelValue"]);

const canvas = ref(null);
let ctx = null;
let drawing = false;

const MAX_W = 600;
const H = 220;

onMounted(() => {
  ctx = canvas.value.getContext("2d");
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#111";
  if (props.modelValue) drawImage(props.modelValue);
});

const pos = (e) => {
  const r = canvas.value.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) * canvas.value.width) / r.width,
    y: ((e.clientY - r.top) * canvas.value.height) / r.height,
  };
};
const start = (e) => {
  drawing = true;
  canvas.value.setPointerCapture(e.pointerId);
  const { x, y } = pos(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
};
const move = (e) => {
  if (!drawing) return;
  const { x, y } = pos(e);
  ctx.lineTo(x, y);
  ctx.stroke();
};
const end = () => {
  if (!drawing) return;
  drawing = false;
  emit("update:modelValue", canvas.value.toDataURL("image/png"));
};

const clear = () => {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  emit("update:modelValue", "");
};

function drawImage(src) {
  const img = new Image();
  img.onload = () => {
    const c = canvas.value;
    ctx.clearRect(0, 0, c.width, c.height);
    const scale = Math.min(c.width / img.width, c.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
    emit("update:modelValue", c.toDataURL("image/png"));
  };
  img.src = src;
}

const upload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return alert("File harus berupa gambar (PNG/JPG).");
  const reader = new FileReader();
  reader.onload = () => drawImage(reader.result);
  reader.readAsDataURL(file);
  e.target.value = "";
};
</script>

<template>
  <div class="sig">
    <canvas
      ref="canvas"
      :width="MAX_W"
      :height="H"
      class="sig-canvas"
      @pointerdown.prevent="start"
      @pointermove.prevent="move"
      @pointerup="end"
      @pointerleave="end"
    />
    <div class="sig-actions">
      <button type="button" @click="clear">Hapus</button>
      <label class="sig-upload">
        Upload gambar
        <input type="file" accept="image/png,image/jpeg" hidden @change="upload" />
      </label>
    </div>
    <p class="sig-hint">Gambar tanda tangan di kotak, atau upload foto/scan tanda tangan (latar putih/transparan).</p>
  </div>
</template>

<style scoped>
.sig-canvas { width: 100%; aspect-ratio: 600 / 220; height: auto; border: 1px dashed #94a3b8; border-radius: 10px; background: #fff; touch-action: none; cursor: crosshair; }
.sig-actions { display: flex; gap: 8px; margin-top: 8px; }
.sig-actions button, .sig-upload { padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 13px; cursor: pointer; }
.sig-hint { margin: 6px 0 0; font-size: 12px; color: #64748b; }
</style>