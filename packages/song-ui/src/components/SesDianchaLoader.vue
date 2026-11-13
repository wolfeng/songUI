<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useSound } from '../composables/useSound.js';
import { useLocale } from '../composables/useLocale.js';
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
  actionLabel: undefined,
  autoStart: false,
  intervalMs: 75
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
  complete: [];
}>();

const STAGES_ZH = [
  '一汤·珠玑',
  '二汤·蟹眼',
  '三汤·鱼目',
  '四汤·乳雾',
  '五汤·云脚',
  '六汤·咬盏',
  '七汤·雪涛'
];

const STAGES_EN = [
  '1st · Pearls',
  '2nd · Crab-Eye',
  '3rd · Fish-Eye',
  '4th · Mist',
  '5th · Clouds',
  '6th · Rim-Bite',
  '7th · Snow-Foam'
];

const sound = useSound();
const locale = useLocale();
const uid = Math.random().toString(36).slice(2, 8);
const glazeId = `jianzhanGlaze-${uid}`;
const teaBaseId = `teaBaseGrad-${uid}`;
const foamId = `teaFoamGrad-${uid}`;
const clipId = `bowlClip-${uid}`;

const internalPct = ref(Math.min(100, Math.max(0, props.modelValue)));
const isWhisking = ref(false);
const phase = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;
let rafId: number | null = null;

watch(
  () => props.modelValue,
  (val) => {
    internalPct.value = Math.min(100, Math.max(0, val));
  }
);

const resolvedActionLabel = computed(
  () => props.actionLabel ?? (locale.isEn.value ? 'Re-Whisk Tea' : '重注沸水击拂')
);

const stageIndex = computed(() =>
  Math.min(STAGES_ZH.length - 1, Math.floor((internalPct.value / 100) * STAGES_ZH.length))
);

const stageText = computed(() => {
  const list = locale.isEn.value ? STAGES_EN : STAGES_ZH;
  return list[stageIndex.value];
});

const foamRadius = computed(() => (10 + (internalPct.value / 100) * 58).toFixed(1));
const spiralTransform = computed(
  () => `rotate(${(internalPct.value * 4.5 + phase.value * 8).toFixed(1)} 90 90)`
);
const spiralOpacity = computed(() =>
  internalPct.value < 15 ? 0.2 : internalPct.value > 94 ? 0.22 : 0.72
);

const pourOpacity = computed(() =>
  internalPct.value < 22 ? Math.sin((internalPct.value / 22) * Math.PI).toFixed(2) : '0'
);
const pourRippleRadius = computed(() => (8 + (internalPct.value % 22) * 1.4).toFixed(1));

const bubblesOpacity = computed(() =>
  internalPct.value < 65 ? 0.65 : Math.max(0, 0.65 - (internalPct.value - 65) / 35)
);

const biteOpacity = computed(() =>
  internalPct.value > 72 ? Math.min(0.75, ((internalPct.value - 72) / 28) * 0.75).toFixed(2) : '0'
);

const chabaixiOpacity = computed(() =>
  internalPct.value > 82 ? Math.min(1, (internalPct.value - 82) / 18).toFixed(2) : '0'
);

const whiskTransform = computed(() => {
  const wx = 90 + Math.sin(phase.value * 2.2) * 24;
  const wy = 90 + Math.sin(phase.value * 4.4) * 11;
  const rot = Math.sin(phase.value) * 14;
  return `translate(${wx.toFixed(1)}, ${wy.toFixed(1)}) rotate(${rot.toFixed(1)})`;
});

const hareFurStreaks = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  return {
    x1: (90 + Math.cos(a) * 68).toFixed(1),
    y1: (90 + Math.sin(a) * 68).toFixed(1),
    x2: (90 + Math.cos(a) * 76.5).toFixed(1),
    y2: (90 + Math.sin(a) * 76.5).toFixed(1),
    stroke: i % 2 === 0 ? '#8E6239' : '#B78B56',
    width: i % 3 === 0 ? '1.1' : '0.6'
  };
});

const sevenDots = Array.from({ length: 7 }, (_, i) => {
  const deg = -135 + (i / 6) * 270;
  const rad = (deg * Math.PI) / 180;
  return {
    cx: (90 + Math.cos(rad) * 82.5).toFixed(1),
    cy: (90 + Math.sin(rad) * 82.5).toFixed(1)
  };
});

const bubbleSeeds = [
  { cx: 74, cy: 78, r: 2.2 },
  { cx: 105, cy: 74, r: 1.8 },
  { cx: 98, cy: 108, r: 2.4 },
  { cx: 68, cy: 102, r: 1.6 },
  { cx: 88, cy: 66, r: 1.9 },
  { cx: 112, cy: 92, r: 1.5 }
];

function stopAnimation() {
  if (rafId !== null && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function tickPhase() {
  if (!isWhisking.value) {
    rafId = null;
    return;
  }
  phase.value += 0.14;
  if (typeof requestAnimationFrame === 'function') {
    rafId = requestAnimationFrame(tickPhase);
  }
}

function stop() {
  isWhisking.value = false;
  stopAnimation();
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startWhisking(silent = false) {
  stop();
  if (!silent) sound.playChime(784);
  internalPct.value = 8;
  isWhisking.value = true;
  emit('update:modelValue', 8);

  if (typeof requestAnimationFrame === 'function') {
    rafId = requestAnimationFrame(tickPhase);
  }

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
      <svg viewBox="0 0 180 180" style="width: 100%; height: 100%; filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.25))">
        <defs>
          <radialGradient :id="glazeId" cx="48%" cy="44%" r="54%">
            <stop offset="0%" stop-color="#1E2822" />
            <stop offset="55%" stop-color="#161413" />
            <stop offset="86%" stop-color="#4B3423" />
            <stop offset="100%" stop-color="#0F0D0C" />
          </radialGradient>
          <radialGradient :id="teaBaseId" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#6A9478" />
            <stop offset="65%" stop-color="#3F624C" />
            <stop offset="100%" stop-color="#22352A" />
          </radialGradient>
          <radialGradient :id="foamId" cx="46%" cy="44%" r="54%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.99" />
            <stop offset="60%" stop-color="#F3EFE4" stop-opacity="0.95" />
            <stop offset="88%" stop-color="#DFE4DA" stop-opacity="0.88" />
            <stop offset="100%" stop-color="#B9C4B8" stop-opacity="0.65" />
          </radialGradient>
          <clipPath :id="clipId">
            <circle cx="90" cy="90" r="68" />
          </clipPath>
        </defs>

        <!-- Steam wisps -->
        <g opacity="0.72">
          <path class="ses-diancha-steam-1" d="M68 38 C64 29, 73 22, 68 13" fill="none" stroke="var(--ses-ink-medium)" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.35" />
          <path class="ses-diancha-steam-2" d="M90 32 C95 23, 86 16, 91 7" fill="none" stroke="var(--ses-ink-medium)" stroke-width="1.3" stroke-linecap="round" stroke-opacity="0.4" />
          <path class="ses-diancha-steam-3" d="M112 38 C108 30, 116 23, 111 14" fill="none" stroke="var(--ses-ink-medium)" stroke-width="1.1" stroke-linecap="round" stroke-opacity="0.32" />
        </g>

        <!-- Jian-ware bowl & hare's-fur glaze streaks -->
        <circle
          cx="90"
          cy="90"
          r="78"
          :fill="`url(#${glazeId})`"
          stroke="var(--ses-gold)"
          stroke-width="1.6"
          :class="{ 'ses-diancha-rim-done': internalPct >= 100 }"
        />
        <g opacity="0.42">
          <line
            v-for="(s, idx) in hareFurStreaks"
            :key="idx"
            :x1="s.x1"
            :y1="s.y1"
            :x2="s.x2"
            :y2="s.y2"
            :stroke="s.stroke"
            :stroke-width="s.width"
          />
        </g>

        <!-- 7-stage outer jade/gold beads -->
        <g>
          <circle
            v-for="(dot, idx) in sevenDots"
            :key="idx"
            :cx="dot.cx"
            :cy="dot.cy"
            r="2.1"
            :fill="idx <= stageIndex ? 'var(--ses-gold)' : 'none'"
            :stroke="idx <= stageIndex ? 'var(--ses-gold)' : 'var(--ses-ink-light)'"
            stroke-width="0.9"
          />
        </g>

        <!-- Tea liquid & foam clipped to inner bowl -->
        <g :clip-path="`url(#${clipId})`">
          <circle cx="90" cy="90" r="68" :fill="`url(#${teaBaseId})`" />

          <!-- Boiling water stream & ripple (0-22%) -->
          <g :opacity="pourOpacity">
            <path d="M132 20 Q106 54 90 88" fill="none" stroke="#E8F1EC" stroke-width="2.6" stroke-linecap="round" stroke-opacity="0.85" />
            <circle cx="90" cy="90" :r="pourRippleRadius" fill="none" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.7" />
          </g>

          <!-- Growing creamy foam -->
          <circle
            cx="90"
            cy="90"
            :r="foamRadius"
            :fill="`url(#${foamId})`"
            style="transition: r 0.25s ease"
          />

          <!-- Crab-eye / fish-eye bubbles -->
          <g :opacity="bubblesOpacity" fill="none" stroke="#FFFFFF" stroke-width="0.9">
            <circle
              v-for="(b, idx) in bubbleSeeds"
              :key="idx"
              :cx="b.cx"
              :cy="b.cy"
              :r="(b.r * (0.8 + 0.35 * Math.sin(phase * 1.6 + idx))).toFixed(2)"
            />
          </g>

          <!-- Dual spiral foam trails -->
          <g :opacity="spiralOpacity" :transform="spiralTransform">
            <path d="M90 42 C118 42, 138 64, 138 90 C138 118, 114 136, 90 136 C68 136, 52 118, 52 94" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="140 240" />
            <path d="M90 56 C70 56, 58 72, 58 90 C58 110, 74 122, 92 122 C108 122, 120 110, 120 94" fill="none" stroke="#E4ECE6" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="95 200" />
          </g>

          <!-- Biting-bowl (咬盏) highlight ring -->
          <circle cx="90" cy="90" r="66.2" fill="none" stroke="#FFFFFF" stroke-width="2.2" :stroke-opacity="biteOpacity" />

          <!-- Chabaixi (茶百戏) ink bamboo & seal reveal -->
          <g :opacity="chabaixiOpacity">
            <path d="M62 110 Q78 92 94 104 T122 96" fill="none" stroke="#4D6658" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.55" />
            <path d="M84 116 Q88 94 93 70" fill="none" stroke="#364C40" stroke-width="1.7" stroke-linecap="round" stroke-opacity="0.7" />
            <path d="M90 86 Q102 80 109 84" fill="none" stroke="#364C40" stroke-width="1.3" stroke-linecap="round" stroke-opacity="0.65" />
            <path d="M88 96 Q76 91 71 95" fill="none" stroke="#364C40" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.6" />
            <circle cx="110" cy="72" r="5" fill="#B3382C" fill-opacity="0.45" />
          </g>

          <!-- Figure-8 bamboo whisk (茶筅) -->
          <g v-if="isWhisking && internalPct < 98" :transform="whiskTransform" opacity="0.92">
            <ellipse cx="0" cy="0" rx="11" ry="8" fill="none" stroke="#C9A35E" stroke-width="1.2" stroke-dasharray="2.5 2" />
            <circle cx="0" cy="0" r="4.5" fill="#9A763B" stroke="#E8D2A6" stroke-width="0.9" />
            <line x1="0" y1="0" x2="18" y2="-22" stroke="#C9A35E" stroke-width="3" stroke-linecap="round" />
          </g>
        </g>
      </svg>
      <div class="ses-diancha-overlay">
        <span class="ses-diancha-pct">{{ internalPct }}%</span>
        <span class="ses-diancha-stage">{{ stageText }}</span>
      </div>
    </div>

    <SesButton v-if="showAction" size="sm" @click="startWhisking(false)">
      {{ resolvedActionLabel }}
    </SesButton>
  </div>
</template>
