<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useSound } from '../composables/useSound.js';

export interface SesSelectOption {
  label: string;
  value: string;
  meta?: string;
}

export interface SesSelectProps {
  modelValue: string;
  options: SesSelectOption[];
  placeholder?: string;
  metaLabel?: string;
}

const props = withDefaults(defineProps<SesSelectProps>(), {
  placeholder: '请选择书帙……',
  metaLabel: '书衣材质：八答晕宋锦'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [option: SesSelectOption];
}>();

const sound = useSound();
const open = ref(false);
const wrapRef = ref<HTMLElement | null>(null);

const selectedOption = computed(() =>
  props.options.find((opt) => opt.value === props.modelValue)
);

function toggleDropdown() {
  open.value = !open.value;
  sound.playChime(open.value ? 740 : 587);
}

function selectOption(opt: SesSelectOption) {
  open.value = false;
  sound.playChime(880);
  emit('update:modelValue', opt.value);
  emit('change', opt);
}

function handleClickOutside(event: MouseEvent) {
  if (wrapRef.value && !wrapRef.value.contains(event.target as Node)) {
    open.value = false;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="wrapRef" @keydown="handleKeydown">
    <div style="position: relative">
      <button
        type="button"
        class="ses-yaqian-trigger"
        :aria-expanded="open"
        aria-haspopup="listbox"
        @click="toggleDropdown"
      >
        <span style="display: flex; align-items: center; gap: 0.5rem">
          <span style="color: var(--ses-gold)" aria-hidden="true">🔖</span>
          <span>{{ selectedOption ? selectedOption.label : placeholder }}</span>
        </span>
        <span
          style="font-size: 0.75rem; color: var(--ses-gold); transition: transform 0.3s ease"
          :style="{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }"
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      <div v-if="open" role="listbox" class="ses-yaqian-menu">
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          role="option"
          :aria-selected="opt.value === modelValue"
          class="ses-yaqian-option"
          @click="selectOption(opt)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div
      v-if="selectedOption?.meta"
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.7rem;
        color: var(--ses-ink-light);
        padding-top: 0.5rem;
        margin-top: 0.65rem;
        border-top: 0.5px solid var(--ses-border-hairline);
      "
    >
      <span>{{ metaLabel }}</span>
      <span style="color: var(--ses-cinnabar)">{{ selectedOption.meta }}</span>
    </div>
  </div>
</template>
