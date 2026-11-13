<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSound } from '../composables/useSound.js';
import { useLocale } from '../composables/useLocale.js';

export type SesRatingSymbol = 'plum' | 'lotus' | 'coin' | 'jade';

export interface SesRatingProps {
  modelValue: number;
  max?: number;
  readonly?: boolean;
  showLabel?: boolean;
  labels?: string[];
  size?: 'sm' | 'md' | 'lg';
  symbol?: SesRatingSymbol;
}

const props = withDefaults(defineProps<SesRatingProps>(), {
  max: 5,
  readonly: false,
  showLabel: true,
  labels: undefined,
  size: 'md',
  symbol: 'plum'
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
  change: [value: number];
}>();

const sound = useSound();
const locale = useLocale();
const hoverVal = ref<number | null>(null);
const pentatonic = [523.25, 587.33, 659.25, 783.99, 880];

const activeLabels = computed(() =>
  props.labels ??
  (locale.isEn.value
    ? ['Fair', 'Good', 'Fine', 'Exquisite', 'Masterpiece']
    : ['凡品', '中品', '佳品', '妙品', '神品'])
);

const displayValue = computed(() => hoverVal.value ?? props.modelValue);

const currentLabel = computed(() => {
  const val = Math.round(displayValue.value);
  if (val <= 0) return locale.isEn.value ? 'Unrated' : '未品评';
  return activeLabels.value[val - 1] ?? `${val} / ${props.max}`;
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
        :aria-label="`${n} ★ (${activeLabels[n - 1] ?? n})`"
        :disabled="readonly"
        @mouseenter="!readonly && (hoverVal = n)"
        @click="selectRating(n)"
      >
        <svg viewBox="0 0 24 24" class="ses-rating-svg" :data-symbol="symbol" aria-hidden="true">
          <!-- 1. 五瓣寒梅 (plum, default) -->
          <template v-if="symbol === 'plum'">
            <g
              :fill="n <= displayValue ? 'var(--ses-gold)' : 'none'"
              :stroke="n <= displayValue ? 'var(--ses-gold)' : 'var(--ses-ink-light)'"
              stroke-width="1.35"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="6.6" r="3.4" />
              <circle cx="17.1" cy="10.3" r="3.4" />
              <circle cx="15.2" cy="16.3" r="3.4" />
              <circle cx="8.8" cy="16.3" r="3.4" />
              <circle cx="6.9" cy="10.3" r="3.4" />
            </g>
            <circle
              cx="12"
              cy="12.2"
              r="2.2"
              :fill="n <= displayValue ? 'var(--ses-cinnabar)' : 'var(--ses-bg-canvas)'"
              :stroke="n <= displayValue ? 'var(--ses-bg-canvas)' : 'var(--ses-ink-light)'"
              stroke-width="1"
            />
          </template>

          <!-- 2. 仰覆莲瓣 (lotus) -->
          <template v-else-if="symbol === 'lotus'">
            <path
              d="M12 3.2C9.6 7.4 9.2 12.2 12 18.8C14.8 12.2 14.4 7.4 12 3.2Z"
              :fill="n <= displayValue ? 'var(--ses-gold)' : 'none'"
              :stroke="n <= displayValue ? 'var(--ses-gold)' : 'var(--ses-ink-light)'"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
            <path
              d="M12 18.8C8.2 17.8 5.2 14.6 4.4 9.8C7.4 10.6 9.8 12.8 12 18.8Z"
              :fill="n <= displayValue ? 'var(--ses-celadon)' : 'none'"
              :stroke="n <= displayValue ? 'var(--ses-gold)' : 'var(--ses-ink-light)'"
              stroke-width="1.35"
              stroke-linejoin="round"
            />
            <path
              d="M12 18.8C15.8 17.8 18.8 14.6 19.6 9.8C16.6 10.6 14.2 12.8 12 18.8Z"
              :fill="n <= displayValue ? 'var(--ses-celadon)' : 'none'"
              :stroke="n <= displayValue ? 'var(--ses-gold)' : 'var(--ses-ink-light)'"
              stroke-width="1.35"
              stroke-linejoin="round"
            />
            <path
              d="M7.5 19.8H16.5"
              fill="none"
              :stroke="n <= displayValue ? 'var(--ses-gold)' : 'var(--ses-ink-light)'"
              stroke-width="1.4"
              stroke-linecap="round"
            />
          </template>

          <!-- 4. 瘦金通宝 (coin) -->
          <template v-else-if="symbol === 'coin'">
            <circle
              cx="12"
              cy="12"
              r="8.6"
              :fill="n <= displayValue ? 'var(--ses-gold)' : 'none'"
              :stroke="n <= displayValue ? 'var(--ses-gold)' : 'var(--ses-ink-light)'"
              stroke-width="1.5"
            />
            <circle
              cx="12"
              cy="12"
              r="6.4"
              fill="none"
              :stroke="n <= displayValue ? 'var(--ses-bg-canvas)' : 'var(--ses-ink-light)'"
              stroke-width="0.9"
              stroke-opacity="0.7"
            />
            <rect
              x="9.3"
              y="9.3"
              width="5.4"
              height="5.4"
              :fill="n <= displayValue ? 'var(--ses-bg-canvas)' : 'none'"
              :stroke="n <= displayValue ? 'var(--ses-bg-canvas)' : 'var(--ses-ink-light)'"
              stroke-width="1.3"
            />
          </template>

          <!-- 5. 如意玉璧 (jade) -->
          <template v-else>
            <circle
              cx="12"
              cy="12"
              r="8.5"
              :fill="n <= displayValue ? 'var(--ses-celadon)' : 'none'"
              :stroke="n <= displayValue ? 'var(--ses-gold)' : 'var(--ses-ink-light)'"
              stroke-width="1.5"
            />
            <circle
              cx="12"
              cy="12"
              r="3.1"
              :fill="n <= displayValue ? 'var(--ses-bg-canvas)' : 'none'"
              :stroke="n <= displayValue ? 'var(--ses-gold)' : 'var(--ses-ink-light)'"
              stroke-width="1.35"
            />
            <path
              d="M12 5.4A6.6 6.6 0 0 1 18.6 12M12 18.6A6.6 6.6 0 0 1 5.4 12"
              fill="none"
              :stroke="n <= displayValue ? 'var(--ses-bg-canvas)' : 'var(--ses-ink-light)'"
              stroke-width="1"
              stroke-linecap="round"
              stroke-opacity="0.75"
            />
          </template>
        </svg>
      </button>
    </div>

    <span v-if="showLabel" class="ses-brocade-tag ses-rating-label">
      {{ currentLabel }}
    </span>
  </div>
</template>
