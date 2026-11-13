<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';
import { useSound } from '../composables/useSound.js';
import SesButton from './SesButton.vue';
import SesSeal from './SesSeal.vue';

export interface SesScreenDrawerProps {
  modelValue: boolean;
  title: string;
  badge?: string;
}

const props = withDefaults(defineProps<SesScreenDrawerProps>(), {
  badge: '屏风'
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const sound = useSound();

function close() {
  sound.playChime(587.33);
  emit('update:modelValue', false);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    close();
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      sound.playPluck(392);
      document.addEventListener('keydown', onKeydown);
    } else {
      document.removeEventListener('keydown', onKeydown);
    }
  }
);

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div
    class="ses-drawer-backdrop"
    :class="{ open: modelValue }"
    @click="close"
  />
  <aside
    class="ses-screen-drawer"
    :class="{ open: modelValue }"
    role="dialog"
    aria-modal="true"
    :aria-hidden="!modelValue"
    :aria-label="title"
  >
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 0.5px solid var(--ses-border-hairline);
        padding-bottom: 1rem;
      "
    >
      <div style="display: flex; align-items: center; gap: 0.65rem">
        <SesSeal>{{ badge }}</SesSeal>
        <h3 class="ses-slender-gold" style="margin: 0; font-size: 1.05rem; font-weight: 600">
          {{ title }}
        </h3>
      </div>
      <button
        type="button"
        aria-label="合拢屏风"
        style="
          background: transparent;
          border: none;
          color: var(--ses-ink-light);
          font-size: 1.1rem;
          cursor: pointer;
        "
        @click="close"
      >
        ✕
      </button>
    </div>

    <div style="flex: 1; overflow-y: auto; padding: 1.25rem 0">
      <slot />
    </div>

    <div style="padding-top: 1rem; border-top: 0.5px solid var(--ses-border-hairline)">
      <slot name="footer" :close="close">
        <SesButton style="width: 100%" size="sm" :sound-freq="0" @click="close">合拢屏风</SesButton>
      </slot>
    </div>
  </aside>
</template>
