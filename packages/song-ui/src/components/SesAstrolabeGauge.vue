<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSound } from '../composables/useSound.js';
import SesButton from './SesButton.vue';

export interface SesAstrolabeTerm {
  label: string;
  value: number;
  deg: number;
}

export interface SesAstrolabeGaugeProps {
  terms?: SesAstrolabeTerm[];
  metricLabel?: string;
  actionLabel?: string;
}

const DEFAULT_TERMS: SesAstrolabeTerm[] = [
  { label: '谷雨', value: 84, deg: 42 },
  { label: '夏至', value: 96, deg: 128 },
  { label: '秋分', value: 78, deg: 215 },
  { label: '冬至', value: 91, deg: 310 }
];

const props = withDefaults(defineProps<SesAstrolabeGaugeProps>(), {
  terms: () => [
    { label: '谷雨', value: 84, deg: 42 },
    { label: '夏至', value: 96, deg: 128 },
    { label: '秋分', value: 78, deg: 215 },
    { label: '冬至', value: 91, deg: 310 }
  ],
  metricLabel: '雅韵度',
  actionLabel: '拨动司南'
});

const emit = defineEmits<{
  change: [term: SesAstrolabeTerm];
}>();

const sound = useSound();
const activeIdx = ref(0);
const rotationDeg = ref(props.terms[0]?.deg ?? 42);

const currentTerm = computed(() => props.terms[activeIdx.value] ?? DEFAULT_TERMS[0]);

function rotateNeedle() {
  activeIdx.value = (activeIdx.value + 1) % props.terms.length;
  rotationDeg.value += 95;
  sound.playChime(740);
  emit('change', currentTerm.value);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 0.85rem">
    <svg viewBox="0 0 180 180" style="width: 176px; height: 176px">
      <circle cx="90" cy="90" r="80" fill="none" stroke="var(--ses-gold)" stroke-width="1.5" />
      <circle cx="90" cy="90" r="68" fill="none" stroke="var(--ses-border-hairline)" stroke-width="6" stroke-dasharray="2 7.5" />
      <circle cx="90" cy="90" r="52" fill="var(--ses-bg-subtle)" stroke="var(--ses-celadon-deep)" stroke-width="0.8" />
      <text x="90" y="24" text-anchor="middle" font-size="9" fill="var(--ses-cinnabar)" font-weight="bold">午·离</text>
      <text x="90" y="163" text-anchor="middle" font-size="9" fill="var(--ses-ink-medium)">子·坎</text>
      <text x="20" y="93" text-anchor="middle" font-size="9" fill="var(--ses-ink-medium)">卯·震</text>
      <text x="160" y="93" text-anchor="middle" font-size="9" fill="var(--ses-ink-medium)">酉·兑</text>
      <g :transform="`rotate(${rotationDeg} 90 90)`" style="transition: transform 0.9s var(--ses-ease-scroll)">
        <path d="M90 36 L95 85 C98 95, 82 95, 85 85 Z" fill="var(--ses-cinnabar)" />
        <circle cx="90" cy="90" r="7" fill="var(--ses-gold)" stroke="var(--ses-ink-heavy)" stroke-width="1" />
        <path d="M90 135 L87 96 L93 96 Z" fill="var(--ses-ink-heavy)" />
      </g>
    </svg>

    <div
      style="
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 0.65rem;
        border-top: 0.5px solid var(--ses-border-hairline);
      "
    >
      <span style="font-size: 0.78rem; font-weight: 600; color: var(--ses-ink-heavy)">
        {{ currentTerm.label }} · {{ metricLabel }} {{ currentTerm.value }}%
      </span>
      <SesButton size="sm" :sound-freq="0" @click="rotateNeedle">{{ actionLabel }}</SesButton>
    </div>
  </div>
</template>
