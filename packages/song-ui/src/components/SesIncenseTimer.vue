<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { formatIncenseDuration, type IncenseStatus } from '@song-ui/core';
import { useSound } from '../composables/useSound.js';
import SesButton from './SesButton.vue';
import SesSeal from './SesSeal.vue';

export interface SesIncenseTimerProps {
  initialSeconds?: number;
}

const props = withDefaults(defineProps<SesIncenseTimerProps>(), {
  initialSeconds: 15
});

const emit = defineEmits<{
  finish: [];
}>();

const sound = useSound();
const totalSec = ref(props.initialSeconds);
const remainSec = ref(props.initialSeconds);
const status = ref<IncenseStatus>('idle');
const smokePhase = ref(0);

let timerId: ReturnType<typeof setInterval> | null = null;
let rafId: number | null = null;

const ratio = computed(() =>
  totalSec.value > 0 ? Math.max(0, remainSec.value / totalSec.value) : 0
);
const curHeight = computed(() => 128 * ratio.value);
const tipY = computed(() => 222 - curHeight.value);
const formattedRemain = computed(() => formatIncenseDuration(remainSec.value));

const smokePaths = computed(() => {
  const startY = tipY.value - 2;
  const w1 = Math.sin(smokePhase.value) * 9;
  const w2 = Math.cos(smokePhase.value * 0.85) * 12;
  const w3 = Math.sin(smokePhase.value * 0.7 + 1.2) * 14;
  return {
    r1: `M 130 ${startY.toFixed(1)} C ${(130 + w1).toFixed(1)} ${(startY - 24).toFixed(1)}, ${(130 - w2).toFixed(1)} ${(startY - 52).toFixed(1)}, ${(130 + w3 * 0.8).toFixed(1)} ${(startY - 82).toFixed(1)}`,
    r2: `M 130 ${startY.toFixed(1)} C ${(130 - w2 * 0.8).toFixed(1)} ${(startY - 28).toFixed(1)}, ${(130 + w1 * 1.1).toFixed(1)} ${(startY - 58).toFixed(1)}, ${(130 - w3).toFixed(1)} ${(startY - 90).toFixed(1)}`,
    r3: `M 130 ${startY.toFixed(1)} C ${(130 + w3 * 0.5).toFixed(1)} ${(startY - 20).toFixed(1)}, ${(130 + w2 * 0.6).toFixed(1)} ${(startY - 46).toFixed(1)}, ${(130 - w1 * 0.7).toFixed(1)} ${(startY - 72).toFixed(1)}`
  };
});

function tickSmoke() {
  if (status.value === 'burning') {
    smokePhase.value += 0.032;
    rafId = requestAnimationFrame(tickSmoke);
  }
}

function stopTimers() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function selectDuration(sec: number) {
  stopTimers();
  status.value = 'idle';
  totalSec.value = sec;
  remainSec.value = sec;
  sound.playChime(660);
}

function toggleBurn() {
  if (status.value === 'burning') {
    stopTimers();
    status.value = 'paused';
    sound.playChime(523.25);
    return;
  }

  if (remainSec.value <= 0) {
    remainSec.value = totalSec.value;
  }
  status.value = 'burning';
  sound.playChime(784);
  rafId = requestAnimationFrame(tickSmoke);

  timerId = setInterval(() => {
    remainSec.value = Math.max(0, remainSec.value - 0.1);
    if (remainSec.value <= 0) {
      stopTimers();
      status.value = 'finished';
      sound.playBell();
      emit('finish');
    }
  }, 100);
}

function reset() {
  stopTimers();
  status.value = 'idle';
  remainSec.value = totalSec.value;
  sound.playChime(587.33);
}

onBeforeUnmount(() => {
  stopTimers();
});
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1rem">
    <div style="display: flex; align-items: center; justify-content: space-between">
      <div>
        <div style="font-size: 0.88rem; font-weight: 600; color: var(--ses-ink-heavy); letter-spacing: 0.14em">
          一柱香倒计时器 (Incense Stick Timer)
        </div>
        <div style="font-size: 0.72rem; color: var(--ses-ink-light); margin-top: 0.15rem">
          无炉留白意境，点燃前素静无烟；引火后微烬明灭，三缕丝绢青烟升腾。
        </div>
      </div>
      <span class="ses-brocade-tag" style="font-family: monospace; font-size: 0.78rem">{{ formattedRemain }}</span>
    </div>

    <div
      style="
        height: 250px;
        border-radius: 4px;
        background: var(--ses-bg-canvas);
        border: 0.5px solid var(--ses-border-hairline);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      "
    >
      <svg viewBox="0 0 260 250" style="width: 100%; height: 100%">
        <defs>
          <linearGradient id="sesSilkSmoke1" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="var(--ses-celadon-deep)" stop-opacity="0.72" />
            <stop offset="55%" stop-color="var(--ses-celadon)" stop-opacity="0.35" />
            <stop offset="100%" stop-color="var(--ses-celadon)" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="sesSilkSmoke2" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="var(--ses-ink-light)" stop-opacity="0.55" />
            <stop offset="65%" stop-color="var(--ses-celadon-deep)" stop-opacity="0.22" />
            <stop offset="100%" stop-color="var(--ses-celadon-deep)" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="sesAgarwoodGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#5C4938" />
            <stop offset="50%" stop-color="#856B52" />
            <stop offset="100%" stop-color="#4A3A2C" />
          </linearGradient>
        </defs>

        <line x1="36" y1="226" x2="224" y2="226" stroke="var(--ses-gold)" stroke-opacity="0.4" stroke-width="1" />
        <ellipse cx="130" cy="224" rx="10" ry="2.6" fill="var(--ses-celadon)" stroke="var(--ses-gold)" stroke-width="0.8" />
        <ellipse cx="130" cy="224.5" :rx="((1 - ratio) * 13).toFixed(1)" :ry="((1 - ratio) * 3.2).toFixed(1)" fill="#B6BEB4" opacity="0.6" />

        <rect x="128.4" :y="tipY.toFixed(2)" width="3.2" :height="curHeight.toFixed(2)" rx="1" fill="url(#sesAgarwoodGrad)" />
        <rect v-if="status !== 'burning' && ratio > 0" x="128.4" :y="tipY.toFixed(2)" width="3.2" height="1.8" fill="#A68B6D" />

        <g v-if="status === 'burning' && ratio > 0.005">
          <rect x="128.4" :y="tipY.toFixed(2)" width="3.2" height="2.4" fill="#2A2623" />
          <circle class="ses-ember-glow" cx="130" :cy="tipY.toFixed(2)" r="1.8" fill="#E04F3E" />
        </g>

        <g v-if="status === 'burning' && ratio > 0.005">
          <path :d="smokePaths.r1" fill="none" stroke="url(#sesSilkSmoke1)" stroke-width="1.35" stroke-linecap="round" />
          <path :d="smokePaths.r2" fill="none" stroke="url(#sesSilkSmoke2)" stroke-width="1.05" stroke-linecap="round" />
          <path :d="smokePaths.r3" fill="none" stroke="url(#sesSilkSmoke1)" stroke-width="0.75" stroke-linecap="round" opacity="0.75" />
        </g>
      </svg>
    </div>

    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem">
      <div style="display: flex; align-items: center; gap: 0.4rem">
        <SesButton size="sm" :sound-freq="0" @click="selectDuration(15)">十息 (15s)</SesButton>
        <SesButton size="sm" :sound-freq="0" @click="selectDuration(1800)">一炷香 (30m)</SesButton>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <SesSeal interactive @click="toggleBurn">
          {{ status === 'burning' ? '⏸ 暂熄' : status === 'paused' ? '🔥 续火' : '🔥 引火燃香' }}
        </SesSeal>
        <SesButton size="sm" :sound-freq="0" @click="reset">换新香</SesButton>
      </div>
    </div>
  </div>
</template>
