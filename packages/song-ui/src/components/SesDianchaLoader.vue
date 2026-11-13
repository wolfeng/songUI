<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useSound } from '../composables/useSound.js';
import SesButton from './SesButton.vue';

export interface SesDianchaLoaderProps {
  modelValue?: number;
  size?: number;
  showAction?: boolean;
  actionLabel?: string;
  autoStart?: boolean;
  intervalMs?: number;
}

const props = withDefaults(defineProps<SesDianchaLoaderProps>(), {
  modelValue: 68,
  size: 176,
  showAction: true,
  actionLabel: '重注沸水击拂',
  autoStart: false,
  intervalMs: 75
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
  complete: [];
}>();

const STAGES = [
  '一汤·珠玑',
  '二汤·蟹眼',
  '三汤·鱼目',
  '四汤·乳雾',
  '五汤·云脚',
  '六汤·咬盏',
  '七汤·雪涛'
];

const sound = useSound();
const uid = Math.random().toString(36).slice(2, 8);
const glazeId = `jianzhanGlaze-${uid}`;
const foamId = `teaFoamGrad-${uid}`;

const internalPct = ref(Math.min(100, Math.max(0, props.modelValue)));
let timer: ReturnType<typeof setInterval> | null = null;

watch(
  () => props.modelValue,
  (val) => {
    internalPct.value = Math.min(100, Math.max(0, val));
  }
);

const foamRadius = computed(() => (16 + (internalPct.value / 100) * 52).toFixed(1));
const stageText = computed(
  () => STAGES[Math.min(STAGES.length - 1, Math.floor((internalPct.value / 100) * STAGES.length))]
);
const swirlTransform = computed(() => `rotate(${(internalPct.value * 3.6).toFixed(1)} 90 90)`);

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startWhisking(silent = false) {
  stop();
  if (!silent) sound.playChime(784);
  internalPct.value = 8;
  emit('update:modelValue', 8);

  timer = setInterval(() => {
    const next = Math.min(100, internalPct.value + 4);
    internalPct.value = next;
    emit('update:modelValue', next);
    if (next >= 100) {
      stop();
      if (!silent) sound.playChime(1046.5);
      emit('complete');
    }
  }, props.intervalMs);
}

onMounted(() => {
  if (props.autoStart) {
    startWhisking(true);
  }
});

onBeforeUnmount(stop);

defineExpose({
  start: startWhisking,
  stop
});
</script>

<template>
  <div class="ses-diancha-loader">
    <div class="ses-diancha-bowl" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg viewBox="0 0 180 180" style="width: 100%; height: 100%; filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.22))">
        <defs>
          <radialGradient :id="glazeId" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stop-color="#2D2622" />
            <stop offset="70%" stop-color="#191615" />
            <stop offset="92%" stop-color="#4A3525" />
            <stop offset="100%" stop-color="#12100F" />
          </radialGradient>
          <radialGradient :id="foamId" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.98" />
            <stop offset="65%" stop-color="#F2EFE6" stop-opacity="0.92" />
            <stop offset="100%" stop-color="#D5D8CE" stop-opacity="0.7" />
          </radialGradient>
        </defs>
        <circle cx="90" cy="90" r="78" :fill="`url(#${glazeId})`" stroke="var(--ses-gold)" stroke-width="1.5" />
        <circle cx="90" cy="90" r="72" fill="none" stroke="#6B4D36" stroke-width="0.6" stroke-dasharray="2 3" />
        <circle
          cx="90"
          cy="90"
          :r="foamRadius"
          :fill="`url(#${foamId})`"
          style="transition: r 0.3s ease"
        />
        <path
          d="M90 60 C 110 60, 118 82, 102 98 C 88 112, 68 102, 72 84 C 75 70, 92 68, 96 80"
          fill="none"
          stroke="#B8B5A8"
          stroke-width="1.2"
          stroke-linecap="round"
          opacity="0.65"
          :transform="swirlTransform"
        />
      </svg>
      <div class="ses-diancha-overlay">
        <span class="ses-diancha-pct">{{ internalPct }}%</span>
        <span class="ses-diancha-stage">{{ stageText }}</span>
      </div>
    </div>

    <SesButton v-if="showAction" size="sm" @click="startWhisking(false)">
      {{ actionLabel }}
    </SesButton>
  </div>
</template>
