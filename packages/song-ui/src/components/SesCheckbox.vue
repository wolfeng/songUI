<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { validateField, type ValidationRule } from '@song-ui/core';
import { useSound } from '../composables/useSound.js';
import { SONG_FORM_KEY, type SongFormFieldHandle } from '../composables/useFormContext.js';

export interface SesCheckboxProps {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  rules?: ValidationRule<boolean>[];
}

const props = withDefaults(defineProps<SesCheckboxProps>(), {
  disabled: false,
  indeterminate: false,
  rules: () => []
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
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

function toggle() {
  if (props.disabled) return;
  const next = !props.modelValue;
  sound.playPluck(next ? 587.33 : 440);
  emit('update:modelValue', next);
  if (internalErrors.value.length > 0) {
    runValidation(next);
  }
}

defineExpose({
  validate: () => runValidation(props.modelValue),
  resetValidation
});
</script>

<template>
  <div class="ses-checkbox-field">
    <button
      type="button"
      role="checkbox"
      :aria-checked="indeterminate ? 'mixed' : modelValue"
      :disabled="disabled"
      class="ses-checkbox"
      :class="{ checked: modelValue, indeterminate, disabled }"
      @click="toggle"
    >
      <span class="ses-checkbox__box" aria-hidden="true">
        <span v-if="indeterminate" class="ses-checkbox__mark">—</span>
        <span v-else-if="modelValue" class="ses-checkbox__mark">~</span>
      </span>
      <span v-if="label || $slots.default" class="ses-checkbox__label">
        <slot>{{ label }}</slot>
      </span>
    </button>
    <p v-if="internalErrors.length > 0" class="ses-input-error" role="alert">
      <span>朱批：</span>{{ internalErrors[0] }}
    </p>
  </div>
</template>
