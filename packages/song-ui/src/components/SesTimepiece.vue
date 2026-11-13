<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  EARTH_BRANCHES,
  getShichenName,
  getNightWatchLabel,
  getSundialShadowAngle
} from '@song-ui/core';
import { useTheme } from '../composables/useTheme.js';
import { useSound } from '../composables/useSound.js';

export interface SesTimepieceProps {
  /** Minutes since 00:00 [0, 1439] */
  minutes?: number;
  /** Automatically tick with system clock until manually scrubbed */
  autoSync?: boolean;
}

const props = withDefaults(defineProps<SesTimepieceProps>(), {
  minutes: undefined,
  autoSync: true
});

const emit = defineEmits<{
  'update:minutes': [value: number];
}>();

const theme = useTheme();
const sound = useSound();

const now = new Date();
const internalMinutes = ref(props.minutes ?? now.getHours() * 60 + now.getMinutes());
const isLive = ref(props.autoSync);
let syncTimer: ReturnType<typeof setInterval> | null = null;

const activeMinutes = computed(() =>
  props.minutes !== undefined ? props.minutes : internalMinutes.value
);

const watchInfo = computed(() => getNightWatchLabel(activeMinutes.value));
const shichen = computed(() => getShichenName(activeMinutes.value));
const shadowAngle = computed(() => getSundialShadowAngle(activeMinutes.value));

const shadowTipY = computed(() => {
  const distFromNoon = Math.abs(((activeMinutes.value - 720 + 720) % 1440) - 720) / 720;
  return 92 - distFromNoon * 48;
});

const waterY = computed(() => {
  const minWaterY = 232;
  const maxWaterY = 126;
  return minWaterY - watchInfo.value.ratio * (minWaterY - maxWaterY);
});

const clepsydraTicks = computed(() => {
  const night = watchInfo.value.isNight;
  return [
    { y: 232, label: night ? '一更·戌' : '初刻·卯', minutes: night ? 1140 : 300 },
    { y: 206, label: night ? '二更·亥' : '廿五·辰', minutes: night ? 1260 : 510 },
    { y: 180, label: night ? '三更·子' : '五十·午', minutes: night ? 0 : 720 },
    { y: 154, label: night ? '四更·丑' : '七五·申', minutes: night ? 120 : 930 },
    { y: 128, label: night ? '五更·寅' : '百刻·酉', minutes: night ? 240 : 1080 }
  ];
});

function jumpToMinutes(mins: number) {
  isLive.value = false;
  internalMinutes.value = mins;
  emit('update:minutes', mins);
  sound.playChime(784);
}

const timeBadge = computed(() => {
  const hh = String(Math.floor(activeMinutes.value / 60)).padStart(2, '0');
  const mm = String(Math.floor(activeMinutes.value % 60)).padStart(2, '0');
  return theme.isDark.value
    ? `${watchInfo.value.text} · ${shichen.value} ${hh}:${mm}`
    : `${shichen.value} · ${hh}:${mm}`;
});

const branchTicks = EARTH_BRANCHES.map((name, i) => {
  const deg = i * 30;
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    name,
    isWu: i === 0,
    x1: (140 + Math.cos(rad) * 56).toFixed(1),
    y1: (140 + Math.sin(rad) * 56).toFixed(1),
    x2: (140 + Math.cos(rad) * 121).toFixed(1),
    y2: (140 + Math.sin(rad) * 121).toFixed(1),
    tx: (140 + Math.cos(rad) * 108).toFixed(1),
    ty: (140 + Math.sin(rad) * 108 + 4.5).toFixed(1)
  };
});

const keTicks = Array.from({ length: 96 }, (_, k) => {
  const deg = k * 3.75;
  const rad = ((deg - 90) * Math.PI) / 180;
  const isMajor = k % 8 === 0;
  const isHalf = k % 4 === 0;
  const rInner = isMajor ? 86 : isHalf ? 88.5 : 90.5;
  return {
    isMajor,
    x1: (140 + Math.cos(rad) * rInner).toFixed(1),
    y1: (140 + Math.sin(rad) * rInner).toFixed(1),
    x2: (140 + Math.cos(rad) * 95).toFixed(1),
    y2: (140 + Math.sin(rad) * 95).toFixed(1)
  };
});

function onSliderInput(event: Event) {
  isLive.value = false;
  const val = Number((event.target as HTMLInputElement).value);
  internalMinutes.value = val;
  emit('update:minutes', val);
}

function syncRealtime() {
  isLive.value = true;
  const d = new Date();
  const mins = d.getHours() * 60 + d.getMinutes();
  internalMinutes.value = mins;
  emit('update:minutes', mins);
  sound.playChime(659.25);
}

onMounted(() => {
  if (!props.autoSync) return;
  syncTimer = setInterval(() => {
    if (!isLive.value) return;
    const d = new Date();
    const mins = d.getHours() * 60 + d.getMinutes();
    if (internalMinutes.value !== mins || (props.minutes !== undefined && props.minutes !== mins)) {
      internalMinutes.value = mins;
      emit('update:minutes', mins);
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
});
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1rem">
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap">
      <div style="font-size: 0.72rem; color: var(--ses-ink-light)">
        {{ theme.isDark.value ? '暗夜洒金自动切换为北宋水运刻漏' : '澄心昼景自动切换为赤道石晷投射晷影' }}
      </div>
      <span class="ses-brocade-tag" style="font-size: 0.75rem">{{ timeBadge }}</span>
    </div>

    <div style="display: flex; justify-content: center; align-items: center; min-height: 260px">
      <!-- 澄心昼景：赤道式日晷 -->
      <svg v-if="!theme.isDark.value" viewBox="0 0 280 280" style="width: 260px; height: 260px">
        <defs>
          <radialGradient id="sesSundialStoneGrad" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stop-color="var(--sundial-disc-inner)" />
            <stop offset="100%" stop-color="var(--sundial-disc-outer)" />
          </radialGradient>
          <linearGradient id="sesBronzeGnomonGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E5C886" />
            <stop offset="50%" stop-color="#B8924A" />
            <stop offset="100%" stop-color="#6B5022" />
          </linearGradient>
        </defs>
        <circle cx="140" cy="140" r="130" fill="url(#sesSundialStoneGrad)" stroke="var(--ses-gold)" stroke-width="1.8" />
        <circle cx="140" cy="140" r="121" fill="none" stroke="var(--ses-border-hairline)" stroke-width="0.8" />
        <circle cx="140" cy="140" r="95" fill="none" stroke="var(--ses-gold)" stroke-width="0.9" opacity="0.7" />
        <circle cx="140" cy="140" r="56" fill="none" stroke="var(--ses-border-hairline)" stroke-width="0.7" stroke-dasharray="2 3" />

        <line
          v-for="b in branchTicks"
          :key="`ray-${b.name}`"
          :x1="b.x1" :y1="b.y1" :x2="b.x2" :y2="b.y2"
          stroke="var(--sundial-ray)" stroke-width="0.9"
        />
        <text
          v-for="b in branchTicks"
          :key="`txt-${b.name}`"
          :x="b.tx" :y="b.ty"
          text-anchor="middle"
          font-size="11.5"
          :font-weight="b.isWu ? '700' : '600'"
          :fill="b.isWu ? 'var(--ses-cinnabar)' : 'var(--sundial-text)'"
        >
          {{ b.name }}
        </text>
        <line
          v-for="(k, idx) in keTicks"
          :key="`ke-${idx}`"
          :x1="k.x1" :y1="k.y1" :x2="k.x2" :y2="k.y2"
          :stroke="k.isMajor ? 'var(--ses-gold)' : 'var(--sundial-tick)'"
          :stroke-width="k.isMajor ? '1.3' : '0.7'"
        />

        <g :transform="`rotate(${shadowAngle.toFixed(2)} 140 140)`" style="transition: transform 0.25s ease-out">
          <polygon
            :points="`136.5,140 143.5,140 140.9,${shadowTipY.toFixed(1)} 139.1,${shadowTipY.toFixed(1)}`"
            fill="var(--sundial-shadow)"
            filter="url(#sundialShadowBlur)"
          />
        </g>

        <circle cx="140" cy="140" r="13" fill="var(--ses-bg-canvas)" stroke="var(--ses-gold)" stroke-width="1.2" />
        <circle cx="140" cy="140" r="8" fill="url(#sesBronzeGnomonGrad)" stroke="#3A2810" stroke-width="0.8" />
        <line x1="140" y1="140" x2="127" y2="118" stroke="#3A2810" stroke-width="3.6" stroke-linecap="round" />
        <line x1="140" y1="140" x2="127" y2="118" stroke="url(#sesBronzeGnomonGrad)" stroke-width="2.2" stroke-linecap="round" />
        <circle cx="140" cy="140" r="2.5" fill="#F7F4EC" />
      </svg>

      <!-- 暗夜洒金：北宋浮箭莲花刻漏 -->
      <svg v-else viewBox="0 0 280 280" style="width: 268px; height: 268px; user-select: none">
        <defs>
          <linearGradient id="sesClepsydraWaterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9BB8A8" stop-opacity="0.68" />
            <stop offset="45%" stop-color="#567264" stop-opacity="0.48" />
            <stop offset="100%" stop-color="#1A241F" stop-opacity="0.85" />
          </linearGradient>
          <linearGradient id="sesFloatArrowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#5C3D28" />
            <stop offset="50%" stop-color="#8D6444" />
            <stop offset="100%" stop-color="#3E2819" />
          </linearGradient>
          <linearGradient id="sesBronzeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#222923" />
            <stop offset="50%" stop-color="#343F35" />
            <stop offset="100%" stop-color="#1B211C" />
          </linearGradient>
          <clipPath id="sesClepsydraClip">
            <rect x="96" y="112" width="88" height="132" rx="8" />
          </clipPath>
        </defs>

        <!-- 外圈星宿刻度虚环 -->
        <circle cx="140" cy="155" r="116" fill="none" stroke="var(--ses-gold)" stroke-width="0.6" stroke-dasharray="2 6" opacity="0.35" />
        <circle cx="140" cy="155" r="122" fill="none" stroke="var(--ses-celadon)" stroke-width="0.4" opacity="0.2" />

        <!-- 上方天池平水壶与莲花注水嘴 -->
        <g transform="translate(0, -2)">
          <path d="M98 16 L182 16 L176 34 L104 34 Z" fill="url(#sesBronzeGrad)" stroke="var(--ses-gold)" stroke-width="1.1" />
          <line x1="106" y1="22" x2="174" y2="22" stroke="#9BB8A8" stroke-width="1" opacity="0.5" />
          <path d="M84 36 L196 36" stroke="var(--ses-gold)" stroke-width="1.2" opacity="0.6" />
          <path d="M140 34 L140 44 Q 140 50, 150 50 L158 50 Q 162 50, 162 55 L162 60" fill="none" stroke="var(--ses-gold)" stroke-width="2" stroke-linecap="round" />
          <path d="M155 56 Q 162 65, 169 56 Z" fill="#8FA08B" stroke="var(--ses-gold)" stroke-width="1" />
        </g>

        <!-- 下坠玉露水滴 -->
        <path class="clepsydra-falling-drop" d="M162 62 C162 62, 165.5 67.5, 165.5 70 A3.5 3.5 0 1 1 158.5 70 C158.5 67.5, 162 62, 162 62 Z" fill="#C5E2D4" />

        <!-- 铜壶双耳铺首 -->
        <circle cx="90" cy="148" r="5" fill="none" stroke="var(--ses-gold)" stroke-width="1.1" opacity="0.7" />
        <circle cx="190" cy="148" r="5" fill="none" stroke="var(--ses-gold)" stroke-width="1.1" opacity="0.7" />

        <!-- 受水铜壶主体与须弥底座 -->
        <rect x="94" y="110" width="92" height="136" rx="10" fill="rgba(36,43,37,0.38)" stroke="var(--ses-gold)" stroke-width="1.4" />
        <path d="M88 110 L192 110" stroke="var(--ses-gold)" stroke-width="2.2" stroke-linecap="round" />
        <path d="M84 246 L196 246 L188 258 L92 258 Z" fill="url(#sesBronzeGrad)" stroke="var(--ses-gold)" stroke-width="1.2" />
        <line x1="96" y1="252" x2="184" y2="252" stroke="var(--ses-gold)" stroke-width="0.6" stroke-dasharray="3 4" opacity="0.55" />

        <!-- 左侧可点击更漏刻度 -->
        <g font-size="9.5" letter-spacing="1">
          <g
            v-for="tick in clepsydraTicks"
            :key="tick.label"
            style="cursor: pointer"
            @click="jumpToMinutes(tick.minutes)"
          >
            <line x1="88" :y1="tick.y" x2="94" :y2="tick.y" stroke="var(--ses-gold)" stroke-width="0.9" opacity="0.65" />
            <text
              x="84"
              :y="tick.y + 3"
              text-anchor="end"
              :fill="Math.abs(waterY - tick.y) < 14 ? 'var(--ses-gold)' : 'var(--ses-ink-light)'"
              :font-weight="Math.abs(waterY - tick.y) < 14 ? '600' : '400'"
            >
              {{ tick.label }}
            </text>
          </g>
        </g>

        <!-- 右侧百刻细密水尺 -->
        <g stroke="var(--ses-gold)" opacity="0.35">
          <line v-for="n in 11" :key="n" x1="186" :y1="126 + (n - 1) * 10.6" :x2="n % 2 === 1 ? 192 : 189" :y2="126 + (n - 1) * 10.6" stroke-width="0.8" />
        </g>

        <!-- 壶内碧水与波纹 -->
        <g clip-path="url(#sesClepsydraClip)">
          <rect
            x="96"
            :y="waterY.toFixed(1)"
            width="88"
            :height="(244 - waterY).toFixed(1)"
            fill="url(#sesClepsydraWaterGrad)"
            style="transition: y 0.35s ease-out, height 0.35s ease-out"
          />
          <path
            :d="`M 96 ${waterY.toFixed(1)} Q 118 ${(waterY - 2.2).toFixed(1)} 140 ${waterY.toFixed(1)} T 184 ${waterY.toFixed(1)}`"
            fill="none"
            stroke="#CFE8DC"
            stroke-width="1.5"
            opacity="0.9"
          />
          <ellipse
            class="clepsydra-surface-ripple"
            cx="162"
            :cy="waterY.toFixed(1)"
            rx="4"
            ry="1.2"
            fill="none"
            stroke="var(--ses-gold)"
            stroke-width="1.1"
          />
        </g>

        <!-- 浮箭莲舟 -->
        <g :transform="`translate(0, ${(waterY - 180).toFixed(1)})`" style="transition: transform 0.35s ease-out">
          <path d="M123 180 Q 130 171, 140 176 Q 150 171, 157 180 Q 140 186, 123 180 Z" fill="#8FA08B" stroke="var(--ses-gold)" stroke-width="1" />
          <ellipse cx="140" cy="180" rx="15" ry="4" fill="#6F9176" stroke="var(--ses-gold)" stroke-width="0.9" />
          <rect x="136.5" y="76" width="7" height="104" rx="1.5" fill="url(#sesFloatArrowGrad)" stroke="var(--ses-gold)" stroke-width="0.9" />
          <line v-for="m in 6" :key="m" x1="137.5" :y1="88 + m * 13" x2="142.5" :y2="88 + m * 13" stroke="var(--ses-gold)" stroke-width="0.7" opacity="0.65" />
          <polygon points="140,67 134,77 146,77" fill="var(--ses-cinnabar)" stroke="var(--ses-gold)" stroke-width="0.8" />
        </g>

        <polygon points="124,110 133,106.5 133,113.5" fill="var(--ses-cinnabar)" />
        <polygon points="156,110 147,106.5 147,113.5" fill="var(--ses-cinnabar)" />
      </svg>
    </div>

    <div style="padding-top: 0.75rem; border-top: 0.5px solid var(--ses-border-hairline); display: flex; flex-direction: column; gap: 0.45rem">
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem">
        <span style="color: var(--ses-ink-light)">时辰拨动模拟</span>
        <button
          type="button"
          style="background: transparent; border: none; color: var(--ses-cinnabar); cursor: pointer; font-size: 0.75rem"
          @click="syncRealtime"
        >
          ↺ 同步此刻真实时辰
        </button>
      </div>
      <input
        type="range"
        min="0"
        max="1439"
        :value="activeMinutes"
        aria-label="时辰模拟滑轨"
        style="width: 100%; accent-color: var(--ses-gold); cursor: pointer"
        @input="onSliderInput"
      />
    </div>
  </div>
</template>
