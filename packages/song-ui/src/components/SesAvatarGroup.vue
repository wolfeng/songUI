<script setup lang="ts">
import { computed } from 'vue';
import { useSound } from '../composables/useSound.js';

export interface SesAvatarItem {
  name: string;
  title?: string;
  src?: string;
  tone?: 'celadon' | 'gold' | 'cinnabar' | 'ink';
}

export interface SesAvatarGroupProps {
  items: SesAvatarItem[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const props = withDefaults(defineProps<SesAvatarGroupProps>(), {
  max: 5,
  size: 'md',
  interactive: true
});

const emit = defineEmits<{
  select: [item: SesAvatarItem, index: number];
}>();

const sound = useSound();

const visibleItems = computed(() => props.items.slice(0, Math.max(1, props.max)));
const overflowCount = computed(() => Math.max(0, props.items.length - visibleItems.value.length));

function getInitial(name: string): string {
  return name.trim().charAt(0) || '士';
}

function handleSelect(item: SesAvatarItem, index: number) {
  if (!props.interactive) return;
  sound.playChime(659.25 + index * 45);
  emit('select', item, index);
}
</script>

<template>
  <div class="ses-avatar-group" :class="`ses-avatar-group--${size}`" role="group" aria-label="名士头像组">
    <button
      v-for="(item, idx) in visibleItems"
      :key="`${item.name}-${idx}`"
      type="button"
      class="ses-avatar-item"
      :class="[`ses-avatar-tone--${item.tone ?? 'celadon'}`, { 'is-interactive': interactive }]"
      :title="item.title ? `${item.name} · ${item.title}` : item.name"
      :aria-label="item.title ? `${item.name}（${item.title}）` : item.name"
      :disabled="!interactive"
      @click="handleSelect(item, idx)"
    >
      <img v-if="item.src" :src="item.src" :alt="item.name" class="ses-avatar-img" />
      <span v-else class="ses-avatar-char">{{ getInitial(item.name) }}</span>
    </button>

    <span
      v-if="overflowCount > 0"
      class="ses-avatar-item ses-avatar-overflow"
      :title="`其余 ${overflowCount} 位名士`"
    >
      +{{ overflowCount }}
    </span>
  </div>
</template>
