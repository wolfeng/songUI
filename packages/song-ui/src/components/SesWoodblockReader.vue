<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSound } from '../composables/useSound.js';
import SesButton from './SesButton.vue';

export interface SesWoodblockReaderProps {
  title?: string;
  vertical?: boolean;
  toggleable?: boolean;
}

const props = withDefaults(defineProps<SesWoodblockReaderProps>(), {
  vertical: true,
  toggleable: true
});

const emit = defineEmits<{
  'update:vertical': [value: boolean];
}>();

const sound = useSound();
const isVertical = ref(props.vertical);

watch(
  () => props.vertical,
  (val) => {
    isVertical.value = val;
  }
);

function toggleOrientation() {
  isVertical.value = !isVertical.value;
  sound.playChime(isVertical.value ? 880 : 659.25);
  emit('update:vertical', isVertical.value);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 0.85rem">
    <div v-if="toggleable" style="display: flex; justify-content: flex-end">
      <SesButton size="sm" variant="gold" :sound-freq="0" @click="toggleOrientation">
        {{ isVertical ? '📜 切换为现代横排' : '🏮 切换为宋刻竖排' }}
      </SesButton>
    </div>

    <article
      class="ses-woodblock-reader"
      :class="{ 'vertical-mode': isVertical }"
      style="color: var(--ses-ink-heavy)"
    >
      <div
        v-if="title"
        class="ses-woodblock-title ses-slender-display"
        style="font-weight: 700; color: var(--ses-cinnabar)"
      >
        {{ title }}
      </div>
      <slot />
    </article>
  </div>
</template>
