<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSound } from '../composables/useSound.js';

export interface SesRatingProps {
  modelValue: number;
  max?: number;
  readonly?: boolean;
  showLabel?: boolean;
  labels?: string[];
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<SesRatingProps>(), {
  max: 5,
  readonly: false,
  showLabel: true,
  labels: () => ['凡品', '中品', '佳品', '妙品', '神品'],
  size: 'md'
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
  change: [value: number];
}>();

const sound = useSound();
const hoverVal = ref<number | null>(null);
const pentatonic = [523.25, 587.33, 659.25, 783.99, 880];

const displayValue = computed(() => hoverVal.value ?? props.modelValue);

const currentLabel = computed(() => {
  const val = Math.round(displayValue.value);
  if (val <= 0) return '未品评';
  return props.labels[val - 1] ?? `${val} / ${props.max}`;
});

function selectRating(val: number) {
  if (props.readonly) return;
  const freq = pentatonic[(val - 1) % pentatonic.length];
  sound.playChime(freq);
  emit('update:modelValue', val);
  emit('change', val);
}

function onKeydown(e: KeyboardEvent) {
  if (props.readonly) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault();
    selectRating(Math.min(props.max, props.modelValue + 1));
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault();
    selectRating(Math.max(1, props.modelValue - 1));
  }
}
</script>

<template>
  <div
    class="ses-rating"
    :class="[`ses-rating--${size}`, { 'is-readonly': readonly }]"
    role="radiogroup"
    aria-label="器物品鉴星等"
    @keydown="onKeydown"
  >
    <div class="ses-rating-stars" @mouseleave="hoverVal = null">
      <button
        v-for="n in max"
        :key="n"
        type="button"
        role="radio"
        class="ses-rating-star"
        :class="{ 'is-active': n <= displayValue }"
        :aria-checked="modelValue === n"
        :aria-label="`${n} 星（${labels[n - 1] ?? `${n}级`}）`"
        :disabled="readonly"
        @mouseenter="!readonly && (hoverVal = n)"
        @click="selectRating(n)"
      >
        <svg viewBox="0 0 24 24" class="ses-rating-svg" aria-hidden="true">
          <path
            d="M12 2.4L14.85 8.55L21.5 9.35L16.55 13.95L17.9 20.55L12 17.25L6.1 20.55L7.45 13.95L2.5 9.35L9.15 8.55L12 2.4Z"
          />
        </svg>
      </button>
    </div>

    <span v-if="showLabel" class="ses-brocade-tag ses-rating-label">
      {{ currentLabel }}
    </span>
  </div>
</template>
