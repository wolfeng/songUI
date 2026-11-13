<script setup lang="ts">
import { computed } from 'vue';
import { useSound } from '../composables/useSound.js';

export interface SesPaginationProps {
  modelValue: number;
  totalPages: number;
  useChineseNumerals?: boolean;
}

const props = withDefaults(defineProps<SesPaginationProps>(), {
  useChineseNumerals: true
});

const emit = defineEmits<{
  'update:modelValue': [page: number];
}>();

const sound = useSound();
const CN_NUMERALS = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾'];

const pages = computed(() =>
  Array.from({ length: Math.max(1, props.totalPages) }, (_, idx) => idx + 1)
);

function formatPageLabel(page: number): string {
  if (props.useChineseNumerals && page >= 1 && page <= CN_NUMERALS.length) {
    return CN_NUMERALS[page - 1];
  }
  return String(page);
}

function goTo(page: number) {
  const clamped = Math.max(1, Math.min(props.totalPages, page));
  if (clamped === props.modelValue) return;
  sound.playSeal();
  emit('update:modelValue', clamped);
}
</script>

<template>
  <nav aria-label="活字分页导航" style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap">
    <button
      type="button"
      class="ses-clay-type"
      :disabled="modelValue <= 1"
      aria-label="上一印版"
      @click="goTo(modelValue - 1)"
    >
      ◁
    </button>

    <button
      v-for="page in pages"
      :key="page"
      type="button"
      class="ses-clay-type"
      :class="{ active: page === modelValue }"
      :aria-current="page === modelValue ? 'page' : undefined"
      @click="goTo(page)"
    >
      {{ formatPageLabel(page) }}
    </button>

    <button
      type="button"
      class="ses-clay-type"
      :disabled="modelValue >= totalPages"
      aria-label="下一印版"
      @click="goTo(modelValue + 1)"
    >
      ▷
    </button>
  </nav>
</template>
