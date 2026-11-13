<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { PENTATONIC_NOTES } from '@wolfeng/song-ui-core';
import { useSound } from '../composables/useSound.js';

export interface SesGuqinMark {
  label: string;
  badge?: string;
  freq?: number;
}

export interface SesGuqinSliderProps {
  modelValue: number;
  min?: number;
  max?: number;
  label?: string;
  showScaleLabels?: boolean;
  marks?: SesGuqinMark[];
}

const DEFAULT_MARKS: SesGuqinMark[] = [
  { label: '建隆 (宫)', badge: '宫音 · 建隆元年', freq: PENTATONIC_NOTES[0].freq },
  { label: '景德 (商)', badge: '商音 · 景德元年', freq: PENTATONIC_NOTES[1].freq },
  { label: '熙宁 (角)', badge: '角音 · 熙宁七年', freq: PENTATONIC_NOTES[2].freq },
  { label: '元祐 (徵)', badge: '徵音 · 元祐元年', freq: PENTATONIC_NOTES[3].freq },
  { label: '宣和 (羽)', badge: '羽音 · 宣和五年', freq: PENTATONIC_NOTES[4].freq }
];

const props = withDefaults(defineProps<SesGuqinSliderProps>(), {
  min: 0,
  max: 100,
  showScaleLabels: true,
  marks: undefined
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const sound = useSound();
const trackRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const trackWidth = ref(400);
let lastNoteIdx = -1;

const safeValue = computed(() =>
  Number.isFinite(props.modelValue) ? props.modelValue : props.min
);

const ratio = computed(() => {
  if (props.max <= props.min) return 0;
  return Math.max(0.02, Math.min(0.98, (safeValue.value - props.min) / (props.max - props.min)));
});

const percent = computed(() => Math.round(ratio.value * 100));

const resolvedMarks = computed(() =>
  props.marks && props.marks.length > 0 ? props.marks : DEFAULT_MARKS
);

const activeMark = computed(() => {
  const list = resolvedMarks.value;
  const idx = Math.min(list.length - 1, Math.floor(ratio.value * list.length));
  const item = list[idx];
  const fallbackFreq = PENTATONIC_NOTES[idx % PENTATONIC_NOTES.length].freq;
  return {
    idx,
    label: item.label,
    badge: item.badge ?? item.label,
    freq: item.freq ?? fallbackFreq
  };
});

const stringPath = computed(() => {
  const w = trackWidth.value || 400;
  const pullX = isDragging.value ? ratio.value * w : w / 2;
  const bendY = isDragging.value ? 27 : 18;
  return `M 0 18 Q ${pullX.toFixed(1)} ${bendY} ${w} 18`;
});

function updateFromClientX(clientX: number, playNote = true) {
  const el = trackRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  trackWidth.value = rect.width || 400;
  const nextRatio = Math.max(0.02, Math.min(0.98, (clientX - rect.left) / rect.width));
  const nextVal = Math.round(props.min + nextRatio * (props.max - props.min));
  emit('update:modelValue', nextVal);

  const list = resolvedMarks.value;
  const noteIdx = Math.min(list.length - 1, Math.floor(nextRatio * list.length));
  if (playNote && noteIdx !== lastNoteIdx) {
    lastNoteIdx = noteIdx;
    const freq = list[noteIdx].freq ?? PENTATONIC_NOTES[noteIdx % PENTATONIC_NOTES.length].freq;
    sound.playPluck(freq);
  }
}

function onMouseMove(e: MouseEvent) {
  if (isDragging.value) updateFromClientX(e.clientX, true);
}

function onTouchMove(e: TouchEvent) {
  if (isDragging.value && e.touches[0]) updateFromClientX(e.touches[0].clientX, true);
}

function stopDrag() {
  isDragging.value = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('touchend', stopDrag);
}

function onMouseDown(e: MouseEvent) {
  isDragging.value = true;
  updateFromClientX(e.clientX, true);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', stopDrag);
}

function onTouchStart(e: TouchEvent) {
  if (!e.touches[0]) return;
  isDragging.value = true;
  updateFromClientX(e.touches[0].clientX, true);
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', stopDrag);
}

function onKeyDown(e: KeyboardEvent) {
  const step = Math.max(1, Math.round((props.max - props.min) / 20));
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault();
    const next = Math.min(props.max, props.modelValue + step);
    emit('update:modelValue', next);
    sound.playPluck(activeMark.value.freq);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault();
    const next = Math.max(props.min, props.modelValue - step);
    emit('update:modelValue', next);
    sound.playPluck(activeMark.value.freq);
  }
}

let resizeObserver: ResizeObserver | null = null;

function syncTrackWidth() {
  const width = trackRef.value?.getBoundingClientRect().width;
  if (width && width > 0) {
    trackWidth.value = width;
  }
}

onMounted(() => {
  syncTrackWidth();
  if (typeof ResizeObserver !== 'undefined' && trackRef.value) {
    resizeObserver = new ResizeObserver(syncTrackWidth);
    resizeObserver.observe(trackRef.value);
  }
});

onBeforeUnmount(() => {
  stopDrag();
  resizeObserver?.disconnect();
  resizeObserver = null;
});
</script>

<template>
  <div class="ses-guqin-wrap">
    <div class="ses-guqin-header">
      <span v-if="label" class="ses-guqin-label">{{ label }}</span>
      <span class="ses-brocade-tag" style="font-size: 0.72rem">
        {{ activeMark.badge }} ({{ percent }}%)
      </span>
    </div>

    <div class="ses-guqin-box">
      <div
        ref="trackRef"
        role="slider"
        tabindex="0"
        :aria-label="label || '七弦琴轸滑块'"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="modelValue"
        class="ses-guqin-track"
        @mousedown="onMouseDown"
        @touchstart.passive="onTouchStart"
        @keydown="onKeyDown"
      >
        <svg style="width: 100%; height: 100%; overflow: visible" preserveAspectRatio="none">
          <line x1="0" y1="6" x2="0" y2="30" stroke="var(--ses-ink-heavy)" stroke-width="3" />
          <line x1="100%" y1="6" x2="100%" y2="30" stroke="var(--ses-ink-heavy)" stroke-width="3" />
          <path :d="stringPath" fill="none" stroke="var(--ses-gold)" stroke-width="1.8" />
        </svg>
        <div
          class="ses-guqin-thumb"
          :style="{ left: `${percent}%` }"
          title="左右拖动琴轸"
        />
      </div>

      <div v-if="showScaleLabels" class="ses-guqin-scales">
        <span v-for="(mark, idx) in resolvedMarks" :key="`${mark.label}-${idx}`">{{ mark.label }}</span>
      </div>
    </div>
  </div>
</template>
