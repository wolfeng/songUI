<script setup lang="ts">
import { computed } from 'vue';
import { toSongCountingRods } from '@song-ui/core';
import { useSound } from '../composables/useSound.js';
import SesButton from './SesButton.vue';

export interface SesStepperProps {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
}

const props = withDefaults(defineProps<SesStepperProps>(), {
  min: 1,
  max: 99,
  step: 1,
  label: '大衍筹策',
  unit: '策'
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const sound = useSound();
const rodGlyph = computed(() => toSongCountingRods(props.modelValue));

function stepBy(delta: number) {
  const next = Math.max(props.min, Math.min(props.max, props.modelValue + delta));
  if (next === props.modelValue) return;
  sound.playChime(delta > 0 ? 784 : 659.25);
  emit('update:modelValue', next);
}
</script>

<template>
  <div
    style="
      padding: 0.85rem 1rem;
      border-radius: 4px;
      background: var(--ses-bg-canvas);
      border: 0.5px solid var(--ses-border-hairline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    "
  >
    <SesButton size="sm" :disabled="modelValue <= min" :sound-freq="0" aria-label="减少" @click="stepBy(-step)">
      −
    </SesButton>

    <div style="text-align: center">
      <div
        style="
          font-size: 1.45rem;
          letter-spacing: 0.25em;
          color: var(--ses-gold);
          font-weight: 600;
          min-height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        {{ rodGlyph }}
      </div>
      <div style="font-size: 0.72rem; color: var(--ses-ink-light); margin-top: 0.15rem">
        {{ label }}：<strong style="color: var(--ses-ink-heavy); font-family: monospace">{{ modelValue }}</strong> {{ unit }}
      </div>
    </div>

    <SesButton size="sm" :disabled="modelValue >= max" :sound-freq="0" aria-label="增加" @click="stepBy(step)">
      +
    </SesButton>
  </div>
</template>
