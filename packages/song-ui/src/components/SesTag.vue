<script setup lang="ts">
import { computed } from 'vue';
import { useSound } from '../composables/useSound.js';

export interface SesTagProps {
  variant?: 'celadon' | 'cinnabar' | 'gold' | 'ink';
  size?: 'sm' | 'md';
  closable?: boolean;
}

const props = withDefaults(defineProps<SesTagProps>(), {
  variant: 'celadon',
  size: 'md',
  closable: false
});

const emit = defineEmits<{
  close: [];
}>();

const sound = useSound();

const palette = computed(() => {
  switch (props.variant) {
    case 'cinnabar':
      return {
        color: 'var(--ses-cinnabar)',
        border: 'rgba(184, 59, 58, 0.4)',
        bg: 'rgba(184, 59, 58, 0.08)'
      };
    case 'gold':
      return {
        color: 'var(--ses-gold)',
        border: 'var(--ses-border-gold)',
        bg: 'rgba(200, 168, 107, 0.12)'
      };
    case 'ink':
      return {
        color: 'var(--ses-ink-medium)',
        border: 'var(--ses-border-hairline)',
        bg: 'var(--ses-bg-subtle)'
      };
    case 'celadon':
    default:
      return {
        color: 'var(--ses-celadon-deep)',
        border: 'rgba(109, 136, 142, 0.45)',
        bg: 'var(--ses-moon-white)'
      };
  }
});

function handleClose() {
  sound.playPluck();
  emit('close');
}
</script>

<template>
  <span
    class="ses-tag"
    :class="`ses-tag--${size}`"
    :style="{
      color: palette.color,
      borderColor: palette.border,
      backgroundColor: palette.bg
    }"
  >
    <span class="ses-tag__dot" aria-hidden="true" />
    <span><slot /></span>
    <button
      v-if="closable"
      type="button"
      class="ses-tag__close"
      aria-label="移除标签"
      @click.stop="handleClose"
    >
      ×
    </button>
  </span>
</template>
