<script setup lang="ts">
import { useSound } from '../composables/useSound.js';

export interface SesBreadcrumbItem {
  label: string;
  href?: string;
  value?: string;
}

export interface SesBreadcrumbsProps {
  items: SesBreadcrumbItem[];
  separator?: string;
}

withDefaults(defineProps<SesBreadcrumbsProps>(), {
  separator: '·'
});

const emit = defineEmits<{
  navigate: [item: SesBreadcrumbItem, index: number];
}>();

const sound = useSound();

function onClick(item: SesBreadcrumbItem, index: number, isLast: boolean) {
  if (isLast) return;
  sound.playPluck(587.33);
  emit('navigate', item, index);
}
</script>

<template>
  <nav aria-label="breadcrumb" class="ses-breadcrumbs">
    <ol class="ses-breadcrumbs__list">
      <li v-for="(item, idx) in items" :key="`${item.label}-${idx}`" class="ses-breadcrumbs__item">
        <a
          v-if="item.href && idx < items.length - 1"
          :href="item.href"
          class="ses-breadcrumbs__link"
          @click.prevent="onClick(item, idx, false)"
        >
          {{ item.label }}
        </a>
        <button
          v-else-if="idx < items.length - 1"
          type="button"
          class="ses-breadcrumbs__link"
          @click="onClick(item, idx, false)"
        >
          {{ item.label }}
        </button>
        <span v-else class="ses-breadcrumbs__current" aria-current="page">
          {{ item.label }}
        </span>
        <span v-if="idx < items.length - 1" class="ses-breadcrumbs__sep" aria-hidden="true">
          {{ separator }}
        </span>
      </li>
    </ol>
  </nav>
</template>
