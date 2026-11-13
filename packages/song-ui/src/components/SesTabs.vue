<script setup lang="ts">
import { useSound } from '../composables/useSound.js';

export interface SesTabItem {
  value: string;
  label: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface SesTabsProps {
  modelValue: string;
  items: SesTabItem[];
}

const props = defineProps<SesTabsProps>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const sound = useSound();

function selectTab(item: SesTabItem) {
  if (item.disabled || item.value === props.modelValue) return;
  sound.playPluck();
  emit('update:modelValue', item.value);
}

function onKeyDown(event: KeyboardEvent, index: number) {
  const enabled = props.items.filter((i) => !i.disabled);
  if (enabled.length === 0) return;

  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    const dir = event.key === 'ArrowRight' ? 1 : -1;
    let next = index;
    for (let step = 0; step < props.items.length; step++) {
      next = (next + dir + props.items.length) % props.items.length;
      if (!props.items[next].disabled) {
        selectTab(props.items[next]);
        break;
      }
    }
  }
}
</script>

<template>
  <div class="ses-tabs" role="tablist">
    <button
      v-for="(item, idx) in items"
      :key="item.value"
      type="button"
      role="tab"
      :aria-selected="modelValue === item.value"
      :disabled="item.disabled"
      class="ses-tab-btn"
      :class="{ active: modelValue === item.value, disabled: item.disabled }"
      @click="selectTab(item)"
      @keydown="onKeyDown($event, idx)"
    >
      <span>{{ item.label }}</span>
      <span v-if="item.badge !== undefined" class="ses-tab-badge">{{ item.badge }}</span>
    </button>
  </div>
</template>
