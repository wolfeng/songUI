<script setup lang="ts">
import { useSound } from '../composables/useSound.js';

export interface SesSealProps {
  color?: 'cinnabar' | 'malachite' | 'azurite';
  interactive?: boolean;
}

const props = withDefaults(defineProps<SesSealProps>(), {
  color: 'cinnabar',
  interactive: false
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const sound = useSound();

function handleClick(event: MouseEvent) {
  if (!props.interactive) return;
  sound.playSeal();
  emit('click', event);
}
</script>

<template>
  <component
    :is="interactive ? 'button' : 'span'"
    :type="interactive ? 'button' : undefined"
    class="ses-seal-stamp"
    :class="{
      'ses-seal-stamp--malachite': color === 'malachite',
      'ses-seal-stamp--azurite': color === 'azurite',
      'ses-seal-stamp--interactive': interactive
    }"
    @click="handleClick"
  >
    <slot />
  </component>
</template>
