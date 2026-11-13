<script setup lang="ts">
import { provide, ref } from 'vue';
import { SONG_FORM_KEY, type SongFormFieldHandle } from '../composables/useFormContext.js';
import { useSound } from '../composables/useSound.js';

export interface SesFormProps {
  modelValue?: boolean;
}

withDefaults(defineProps<SesFormProps>(), {
  modelValue: true
});

const emit = defineEmits<{
  'update:modelValue': [valid: boolean];
  submit: [payload: { valid: boolean; event: Event }];
}>();

const sound = useSound();
const fields = ref<Set<SongFormFieldHandle>>(new Set());

provide(SONG_FORM_KEY, {
  register(field) {
    fields.value.add(field);
  },
  unregister(field) {
    fields.value.delete(field);
  }
});

function validate(): boolean {
  let allValid = true;
  for (const field of fields.value) {
    if (!field.validate()) {
      allValid = false;
    }
  }
  emit('update:modelValue', allValid);
  return allValid;
}

function resetValidation(): void {
  for (const field of fields.value) {
    field.resetValidation();
  }
  emit('update:modelValue', true);
}

function onSubmit(event: Event) {
  const valid = validate();
  if (valid) {
    sound.playSeal();
  } else {
    sound.playChime();
  }
  emit('submit', { valid, event });
}

defineExpose({
  validate,
  resetValidation
});
</script>

<template>
  <form class="ses-form" novalidate @submit.prevent="onSubmit">
    <slot :validate="validate" :reset-validation="resetValidation" />
  </form>
</template>
