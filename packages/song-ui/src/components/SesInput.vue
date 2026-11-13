<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { validateField, type ValidationRule } from '@wolfeng/song-ui-core';
import { useSound } from '../composables/useSound.js';
import { SONG_FORM_KEY, type SongFormFieldHandle } from '../composables/useFormContext.js';

export interface SesInputProps {
  modelValue: string;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  rules?: ValidationRule<string>[];
  errorMessages?: string[];
  validateOn?: 'input' | 'blur' | 'submit';
}

const props = withDefaults(defineProps<SesInputProps>(), {
  placeholder: '请于素笺之上落墨……',
  multiline: false,
  rows: 4,
  rules: () => [],
  errorMessages: () => [],
  validateOn: 'blur'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const sound = useSound();
const formCtx = inject(SONG_FORM_KEY, null);
const internalErrors = ref<string[]>([]);

const activeErrors = computed(() =>
  props.errorMessages.length > 0 ? props.errorMessages : internalErrors.value
);

function runValidation(value = props.modelValue): boolean {
  if (!props.rules || props.rules.length === 0) {
    internalErrors.value = [];
    return true;
  }
  const res = validateField(value, props.rules);
  internalErrors.value = res.errors;
  return res.valid;
}

function resetValidation() {
  internalErrors.value = [];
}

const fieldHandle: SongFormFieldHandle = {
  validate: () => runValidation(props.modelValue),
  resetValidation
};

onMounted(() => {
  formCtx?.register(fieldHandle);
});

onBeforeUnmount(() => {
  formCtx?.unregister(fieldHandle);
});

function onInput(event: Event) {
  sound.playBrush();
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit('update:modelValue', target.value);
  if (props.validateOn === 'input' || internalErrors.value.length > 0) {
    runValidation(target.value);
  }
}

function onBlur() {
  if (props.validateOn === 'blur') {
    runValidation(props.modelValue);
  }
}

defineExpose({
  validate: () => runValidation(props.modelValue),
  resetValidation
});
</script>

<template>
  <div>
    <label
      v-if="label"
      style="display: block; font-size: 0.75rem; color: var(--ses-ink-medium); letter-spacing: 0.2em; margin-bottom: 0.4rem"
    >
      {{ label }}
    </label>
    <div
      class="ses-xuan-input-wrap"
      :class="{ 'ses-xuan-input-wrap--error': activeErrors.length > 0 }"
      :style="multiline ? { paddingTop: '0.75rem', paddingBottom: '0.75rem' } : undefined"
    >
      <span
        aria-hidden="true"
        style="position: absolute; left: 0.75rem; font-size: 0.85rem; color: var(--ses-cinnabar)"
        :style="multiline ? { top: '0.85rem' } : { top: '50%', transform: 'translateY(-50%)' }"
      >
        {{ multiline ? '✒' : '🖌' }}
      </span>
      <textarea
        v-if="multiline"
        :value="modelValue"
        :rows="rows"
        :placeholder="placeholder"
        class="ses-xuan-input"
        style="resize: none; line-height: 2"
        @input="onInput"
        @blur="onBlur"
      />
      <input
        v-else
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        class="ses-xuan-input"
        @input="onInput"
        @blur="onBlur"
      />
    </div>
    <p v-if="activeErrors.length > 0" class="ses-input-error" role="alert">
      <span>朱批：</span>{{ activeErrors[0] }}
    </p>
  </div>
</template>
