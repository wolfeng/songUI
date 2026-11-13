<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { validateField, type ValidationRule } from '@song-ui/core';
import { useSound } from '../composables/useSound.js';
import { SONG_FORM_KEY, type SongFormFieldHandle } from '../composables/useFormContext.js';

export interface SesRadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SesRadioGroupProps {
  modelValue: string | number;
  options: SesRadioOption[];
  label?: string;
  direction?: 'horizontal' | 'vertical';
  rules?: ValidationRule<string | number>[];
}

const props = withDefaults(defineProps<SesRadioGroupProps>(), {
  direction: 'horizontal',
  rules: () => []
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const sound = useSound();
const formCtx = inject(SONG_FORM_KEY, null);
const internalErrors = ref<string[]>([]);

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

onMounted(() => formCtx?.register(fieldHandle));
onBeforeUnmount(() => formCtx?.unregister(fieldHandle));

function selectOption(opt: SesRadioOption) {
  if (opt.disabled || opt.value === props.modelValue) return;
  sound.playPluck(523.25);
  emit('update:modelValue', opt.value);
  if (internalErrors.value.length > 0) {
    runValidation(opt.value);
  }
}

defineExpose({
  validate: () => runValidation(props.modelValue),
  resetValidation
});
</script>

<template>
  <div class="ses-radio-field">
    <div v-if="label" class="ses-radio-group-label">{{ label }}</div>
    <div
      role="radiogroup"
      :aria-label="label"
      class="ses-radio-group"
      :class="`ses-radio-group--${direction}`"
    >
      <button
        v-for="opt in options"
        :key="String(opt.value)"
        type="button"
        role="radio"
        :aria-checked="modelValue === opt.value"
        :disabled="opt.disabled"
        class="ses-radio"
        :class="{ checked: modelValue === opt.value, disabled: opt.disabled }"
        @click="selectOption(opt)"
      >
        <span class="ses-radio__ring" aria-hidden="true">
          <span class="ses-radio__dot" />
        </span>
        <span class="ses-radio__label">{{ opt.label }}</span>
      </button>
    </div>
    <p v-if="internalErrors.length > 0" class="ses-input-error" role="alert">
      <span>朱批：</span>{{ internalErrors[0] }}
    </p>
  </div>
</template>
