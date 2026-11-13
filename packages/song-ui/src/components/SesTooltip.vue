<script setup lang="ts">
import { ref } from 'vue';

export interface SesTooltipProps {
  text: string;
  placement?: 'top' | 'bottom';
  disabled?: boolean;
}

withDefaults(defineProps<SesTooltipProps>(), {
  placement: 'top',
  disabled: false
});

const visible = ref(false);
</script>

<template>
  <span
    class="ses-tooltip-wrap"
    @mouseenter="visible = true"
    @mouseleave="visible = false"
    @focusin="visible = true"
    @focusout="visible = false"
  >
    <slot />
    <span
      v-if="visible && !disabled && text"
      role="tooltip"
      class="ses-tooltip-bubble"
      :class="`ses-tooltip-bubble--${placement}`"
    >
      {{ text }}
    </span>
  </span>
</template>
