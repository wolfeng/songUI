<script setup lang="ts">
import { ref } from 'vue';
import { useSound } from '../composables/useSound.js';

export interface SesButtonProps {
  variant?: 'jade' | 'gold' | 'outline';
  size?: 'sm' | 'md';
  ripple?: boolean;
  soundFreq?: number;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<SesButtonProps>(), {
  variant: 'jade',
  size: 'md',
  ripple: true,
  soundFreq: 660,
  disabled: false,
  type: 'button'
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const sound = useSound();
const btnRef = ref<HTMLButtonElement | null>(null);

interface RippleItem {
  id: number;
  size: number;
  left: number;
  top: number;
}
const ripples = ref<RippleItem[]>([]);
let nextRippleId = 1;

function handleClick(event: MouseEvent) {
  if (props.disabled) return;
  sound.playChime(props.soundFreq);

  if (props.ripple && btnRef.value) {
    const rect = btnRef.value.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = nextRippleId++;
    ripples.value.push({
      id,
      size,
      left: event.clientX - rect.left - size / 2,
      top: event.clientY - rect.top - size / 2
    });
    setTimeout(() => {
      ripples.value = ripples.value.filter((r) => r.id !== id);
    }, 800);
  }

  emit('click', event);
}
</script>

<template>
  <button
    ref="btnRef"
    :type="type"
    :disabled="disabled"
    class="ses-btn-jade"
    :class="{
      'ses-btn-jade--gold': variant === 'gold',
      'ses-btn-jade--outline': variant === 'outline',
      'ses-btn-jade--sm': size === 'sm'
    }"
    @click="handleClick"
  >
    <span v-if="variant === 'gold'" style="color: var(--ses-gold)" aria-hidden="true">✦</span>
    <slot />
    <span
      v-for="r in ripples"
      :key="r.id"
      class="ses-ripple-ring"
      :style="{
        width: `${r.size}px`,
        height: `${r.size}px`,
        left: `${r.left}px`,
        top: `${r.top}px`
      }"
      aria-hidden="true"
    />
  </button>
</template>
