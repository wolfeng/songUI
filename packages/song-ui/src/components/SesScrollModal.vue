<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';
import { useSound } from '../composables/useSound.js';
import SesButton from './SesButton.vue';

export interface SesScrollModalProps {
  modelValue: boolean;
  title: string;
  subtitle?: string;
}

const props = defineProps<SesScrollModalProps>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const sound = useSound();

function close() {
  sound.playChime(523.25);
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
      sound.playPluck(329.63);
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
    class="ses-scroll-backdrop"
    :class="{ open: modelValue }"
    @click.self="close"
  >
    <div
      class="ses-scroll-container"
      role="dialog"
      aria-modal="true"
      :aria-hidden="!modelValue"
      :aria-label="title"
    >
      <div class="ses-scroll-roller" aria-hidden="true" />
      <div class="ses-scroll-body">
        <div
          style="
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            border-bottom: 0.5px solid var(--ses-border-hairline);
            padding-bottom: 0.75rem;
            margin-bottom: 1rem;
          "
        >
          <div>
            <span
              v-if="subtitle"
              style="display: block; font-size: 0.7rem; color: var(--ses-cinnabar); letter-spacing: 0.25em"
            >
              {{ subtitle }}
            </span>
            <h3 class="ses-slender-gold" style="margin: 0.25rem 0 0; font-size: 1.25rem; font-weight: 700">
              {{ title }}
            </h3>
          </div>
          <button
            type="button"
            aria-label="收卷"
            style="
              background: transparent;
              border: none;
              color: var(--ses-ink-light);
              font-size: 1.1rem;
              cursor: pointer;
              padding: 0.25rem 0.5rem;
            "
            @click="close"
          >
            ✕
          </button>
        </div>

        <div style="font-size: 0.88rem; line-height: 1.75; color: var(--ses-ink-medium)">
          <slot />
        </div>

        <div
          style="
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
            padding-top: 0.75rem;
            border-top: 0.5px solid var(--ses-border-hairline);
          "
        >
          <slot name="footer" :close="close">
            <SesButton size="sm" variant="outline" :sound-freq="0" @click="close">缓缓收卷</SesButton>
          </slot>
        </div>
      </div>
      <div class="ses-scroll-roller" aria-hidden="true" />
    </div>
  </div>
</template>
