<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSound } from '../composables/useSound.js';

export interface SesAccordionItem {
  id: string;
  title: string;
  content?: string;
}

export interface SesAccordionProps {
  items: SesAccordionItem[];
  modelValue?: string | null;
}

const props = withDefaults(defineProps<SesAccordionProps>(), {
  modelValue: undefined
});

const emit = defineEmits<{
  'update:modelValue': [id: string | null];
}>();

const sound = useSound();
const internalActive = ref<string | null>(props.modelValue ?? (props.items[0]?.id ?? null));

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) internalActive.value = val;
  }
);

function isOpen(id: string): boolean {
  const active = props.modelValue !== undefined ? props.modelValue : internalActive.value;
  return active === id;
}

function toggleItem(id: string) {
  const next = isOpen(id) ? null : id;
  internalActive.value = next;
  sound.playPluck(329.63);
  emit('update:modelValue', next);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 0.6rem">
    <div
      v-for="item in items"
      :key="item.id"
      class="ses-sutra-fold"
      :class="{ open: isOpen(item.id) }"
    >
      <button
        type="button"
        :aria-expanded="isOpen(item.id)"
        style="
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          background: transparent;
          border: none;
          padding: 0;
          font-family: var(--ses-font-serif);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--ses-ink-heavy);
          cursor: pointer;
        "
        @click="toggleItem(item.id)"
      >
        <span>{{ item.title }}</span>
        <span
          aria-hidden="true"
          :style="{ color: isOpen(item.id) ? 'var(--ses-cinnabar)' : 'var(--ses-ink-light)' }"
        >
          {{ isOpen(item.id) ? '▾' : '▸' }}
        </span>
      </button>

      <div
        v-if="isOpen(item.id)"
        style="
          margin-top: 0.65rem;
          padding-top: 0.65rem;
          border-top: 0.5px solid var(--ses-border-hairline);
          font-size: 0.78rem;
          color: var(--ses-ink-medium);
          line-height: 1.65;
        "
      >
        <slot :name="`item-${item.id}`" :item="item">
          {{ item.content }}
        </slot>
      </div>
    </div>
  </div>
</template>
