<script setup lang="ts">
import { ref } from 'vue';
import { useSound } from '../composables/useSound.js';
import SesButton from './SesButton.vue';

export interface SesUploadProps {
  modelValue?: File[];
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  disabled?: boolean;
  title?: string;
  hint?: string;
}

const props = withDefaults(defineProps<SesUploadProps>(), {
  modelValue: () => [],
  multiple: true,
  maxSizeMb: 10,
  disabled: false,
  title: '素笺入画 · 呈卷上传',
  hint: '点击择取或拖拽文书、画卷至此'
});

const emit = defineEmits<{
  'update:modelValue': [files: File[]];
  change: [files: File[]];
  reject: [reason: string];
}>();

const sound = useSound();
const inputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

function triggerSelect() {
  if (props.disabled) return;
  inputRef.value?.click();
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getExtLabel(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '卷宗';
}

function processFiles(fileList: FileList | null) {
  if (!fileList || props.disabled) return;
  const maxBytes = props.maxSizeMb * 1024 * 1024;
  const accepted: File[] = [];

  for (const file of Array.from(fileList)) {
    if (file.size > maxBytes) {
      sound.playChime(392);
      emit('reject', `「${file.name}」超出 ${props.maxSizeMb} MB 限制`);
      continue;
    }
    accepted.push(file);
  }

  if (accepted.length === 0) return;

  const next = props.multiple ? [...props.modelValue, ...accepted] : [accepted[0]];
  sound.playChime(784);
  emit('update:modelValue', next);
  emit('change', next);
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  processFiles(target.files);
  target.value = '';
}

function onDrop(event: DragEvent) {
  isDragging.value = false;
  if (props.disabled) return;
  processFiles(event.dataTransfer?.files ?? null);
}

function removeFile(idx: number) {
  if (props.disabled) return;
  const next = props.modelValue.filter((_, i) => i !== idx);
  sound.playChime(523.25);
  emit('update:modelValue', next);
  emit('change', next);
}
</script>

<template>
  <div class="ses-upload">
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      style="display: none"
      @change="onFileChange"
    />

    <div
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled"
      class="ses-upload-zone"
      :class="{ 'is-dragging': isDragging, 'is-disabled': disabled }"
      @click="triggerSelect"
      @keydown.enter.prevent="triggerSelect"
      @keydown.space.prevent="triggerSelect"
      @dragover.prevent="isDragging = !disabled"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <div class="ses-upload-emblem" aria-hidden="true">卷</div>
      <div class="ses-upload-title ses-slender-gold">{{ title }}</div>
      <div class="ses-upload-hint">{{ hint }}</div>
      <div class="ses-upload-meta">
        <span>单卷上限 {{ maxSizeMb }} MB</span>
        <span v-if="accept">· 制式：{{ accept }}</span>
      </div>
    </div>

    <ul v-if="modelValue.length > 0" class="ses-upload-list">
      <li v-for="(file, idx) in modelValue" :key="`${file.name}-${file.size}-${idx}`" class="ses-upload-item">
        <div class="ses-upload-file-info">
          <span class="ses-brocade-tag" style="padding: 0.1rem 0.5rem; font-size: 0.68rem">
            {{ getExtLabel(file.name) }}
          </span>
          <span class="ses-upload-file-name">{{ file.name }}</span>
          <span class="ses-upload-file-size">{{ formatSize(file.size) }}</span>
        </div>
        <SesButton
          size="sm"
          variant="outline"
          :disabled="disabled"
          :sound-freq="0"
          @click="removeFile(idx)"
        >
          撤回
        </SesButton>
      </li>
    </ul>
  </div>
</template>
