<script setup lang="ts">
import { computed } from 'vue';

export interface SesProgressProps {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'celadon' | 'gold' | 'cinnabar';
  indeterminate?: boolean;
}

const props = withDefaults(defineProps<SesProgressProps>(), {
  value: 0,
  max: 100,
  showValue: true,
  variant: 'celadon',
  indeterminate: false
});

const percent = computed(() => {
  if (props.max <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((props.value / props.max) * 100)));
});

const barColor = computed(() => {
  switch (props.variant) {
    case 'gold':
      return 'var(--ses-gold)';
    case 'cinnabar':
      return 'var(--ses-cinnabar)';
    case 'celadon':
    default:
      return 'var(--ses-celadon-deep)';
  }
});
</script>

<template>
  <div class="ses-progress">
    <div v-if="label || showValue" class="ses-progress__head">
      <span v-if="label" class="ses-progress__label">{{ label }}</span>
      <span v-if="showValue && !indeterminate" class="ses-progress__val">{{ percent }}%</span>
    </div>
    <div
      role="progressbar"
      :aria-valuenow="indeterminate ? undefined : value"
      :aria-valuemin="0"
      :aria-valuemax="max"
      class="ses-progress__track"
    >
      <div
        class="ses-progress__fill"
        :class="{ indeterminate }"
        :style="{
          width: indeterminate ? '40%' : `${percent}%`,
          backgroundColor: barColor
        }"
      />
    </div>
  </div>
</template>
