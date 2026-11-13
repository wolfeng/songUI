<script setup lang="ts">
import { useSound } from '../composables/useSound.js';
import { useLocale } from '../composables/useLocale.js';

export interface SesSwitchProps {
  modelValue: boolean;
  label?: string;
  onText?: string;
  offText?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<SesSwitchProps>(), {
  onText: '启',
  offText: '闭',
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const sound = useSound();
const locale = useLocale();

function toggle() {
  if (props.disabled) return;
  const next = !props.modelValue;
  sound.playChime(next ? 784 : 523.25);
  emit('update:modelValue', next);
}
</script>

<template>
  <div style="display: inline-flex; align-items: center; gap: 0.65rem">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="label || '榫卯滑闩开关'"
      :disabled="disabled"
      class="ses-mortise-switch"
      @click="toggle"
    >
      <span class="ses-mortise-bolt">
        <span class="ses-mortise-bolt-text">{{ modelValue ? onText : offText }}</span>
      </span>
    </button>
    <span
      v-if="label || $slots.default"
      style="font-size: 0.78rem"
      :style="{ color: modelValue ? 'var(--ses-ink-heavy)' : 'var(--ses-ink-medium)' }"
    >
      <slot>{{ label }} · {{ locale.isEn.value ? (modelValue ? 'On' : 'Off') : (modelValue ? '已启' : '已闭') }}</slot>
    </span>
  </div>
</template>
