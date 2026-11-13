<script setup lang="ts">
import { computed } from 'vue';
import { SONG_ICON_DEFS, type SongIconName } from '../icons/song-icons.js';

export interface SesIconProps {
  name: SongIconName;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  spin?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<SesIconProps>(), {
  size: 20,
  color: 'currentColor',
  strokeWidth: 1.5,
  spin: false,
  label: undefined
});

const iconDef = computed(() => SONG_ICON_DEFS[props.name]);
const resolvedSize = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size
);
</script>

<template>
  <svg
    class="ses-icon"
    :class="{ 'ses-icon--spin': spin }"
    :width="resolvedSize"
    :height="resolvedSize"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <template v-if="iconDef">
      <component
        :is="shape.tag"
        v-for="(shape, idx) in iconDef.shapes"
        :key="idx"
        v-bind="shape.attrs"
      />
    </template>
  </svg>
</template>
