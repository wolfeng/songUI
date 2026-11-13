<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getNightWatchLabel, getShichenName, validateField, type ValidationRule } from '@wolfeng/song-ui-core';
import { useSound } from '../composables/useSound.js';
import { useLocale } from '../composables/useLocale.js';
import { SONG_FORM_KEY, type SongFormFieldHandle } from '../composables/useFormContext.js';
import SesIcon from './SesIcon.vue';

export interface SesTimePickerProps {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  minuteStep?: number;
  min?: string;
  max?: string;
  disabled?: boolean;
  clearable?: boolean;
  showShichen?: boolean;
  rules?: ValidationRule<string>[];
  errorMessages?: string[];
}

const props = withDefaults(defineProps<SesTimePickerProps>(), {
  modelValue: '',
  label: undefined,
  placeholder: undefined,
  minuteStep: 1,
  min: undefined,
  max: undefined,
  disabled: false,
  clearable: true,
  showShichen: true,
  rules: () => [],
  errorMessages: () => []
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
}>();

const sound = useSound();
const locale = useLocale();
const formCtx = inject(SONG_FORM_KEY, null);

const open = ref(false);
const wrapRef = ref<HTMLElement | null>(null);
const hourColRef = ref<HTMLElement | null>(null);
const minuteColRef = ref<HTMLElement | null>(null);
const internalErrors = ref<string[]>([]);

function parseTimeStr(str?: string): { h: number; m: number } | null {
  if (!str) return null;
  const match = /^(\d{2}):(\d{2})$/.exec(str.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

function formatTimeStr(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const parsedSelected = computed(() => parseTimeStr(props.modelValue));
const draftHour = ref(parsedSelected.value?.h ?? 9);
const draftMinute = ref(parsedSelected.value?.m ?? 0);

watch(
  () => props.modelValue,
  (val) => {
    const parsed = parseTimeStr(val);
    if (parsed) {
      draftHour.value = parsed.h;
      draftMinute.value = parsed.m;
    }
    if (internalErrors.value.length > 0) {
      runValidation(val ?? '');
    }
  }
);

const activeErrors = computed(() =>
  props.errorMessages.length > 0 ? props.errorMessages : internalErrors.value
);

function runValidation(value = props.modelValue ?? ''): boolean {
  if (!props.rules || props.rules.length === 0) {
    internalErrors.value = [];
    return true;
  }
  const res = validateField(value, props.rules);
  internalErrors.value = res.errors;
  return res.valid;
}

const fieldHandle: SongFormFieldHandle = {
  validate: () => runValidation(props.modelValue ?? ''),
  resetValidation: () => {
    internalErrors.value = [];
  }
};

onMounted(() => {
  formCtx?.register(fieldHandle);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  formCtx?.unregister(fieldHandle);
  document.removeEventListener('click', handleClickOutside);
});

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = computed(() => {
  const step = Math.max(1, Math.min(30, Math.floor(props.minuteStep)));
  const list: number[] = [];
  for (let m = 0; m < 60; m += step) {
    list.push(m);
  }
  return list;
});

function isTimeOutOfRange(timeStr: string): boolean {
  if (props.min && timeStr < props.min) return true;
  if (props.max && timeStr > props.max) return true;
  return false;
}

function isHourDisabled(h: number): boolean {
  return minutes.value.every((m) => isTimeOutOfRange(formatTimeStr(h, m)));
}

function isMinuteDisabled(m: number): boolean {
  return isTimeOutOfRange(formatTimeStr(draftHour.value, m));
}

const resolvedPlaceholder = computed(
  () => props.placeholder ?? (locale.isEn.value ? 'Select time…' : '司辰 · 请选择时分……')
);

function getShichenMeta(timeStr: string) {
  const parsed = parseTimeStr(timeStr);
  if (!parsed) return null;
  const total = parsed.h * 60 + parsed.m;
  return {
    shichen: getShichenName(total),
    watch: getNightWatchLabel(total)
  };
}

const selectedMeta = computed(() => (props.modelValue ? getShichenMeta(props.modelValue) : null));
const draftTimeStr = computed(() => formatTimeStr(draftHour.value, draftMinute.value));
const draftMeta = computed(() => getShichenMeta(draftTimeStr.value));

const shichenPresets = computed(() => [
  { label: locale.isEn.value ? '06:00' : '卯正 06:00', h: 6, m: 0 },
  { label: locale.isEn.value ? '12:00' : '午正 12:00', h: 12, m: 0 },
  { label: locale.isEn.value ? '18:00' : '酉正 18:00', h: 18, m: 0 },
  { label: locale.isEn.value ? '00:00' : '子正 00:00', h: 0, m: 0 }
]);

function scrollActiveIntoView() {
  nextTick(() => {
    const hEl = hourColRef.value?.querySelector('.is-selected') as HTMLElement | null;
    const mEl = minuteColRef.value?.querySelector('.is-selected') as HTMLElement | null;
    if (hEl && hourColRef.value) {
      hourColRef.value.scrollTop = Math.max(0, hEl.offsetTop - 48);
    }
    if (mEl && minuteColRef.value) {
      minuteColRef.value.scrollTop = Math.max(0, mEl.offsetTop - 48);
    }
  });
}

function toggleOpen() {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) {
    const parsed = parseTimeStr(props.modelValue);
    if (parsed) {
      draftHour.value = parsed.h;
      draftMinute.value = parsed.m;
    }
    scrollActiveIntoView();
  }
  sound.playChime(open.value ? 740 : 587);
}

function commitTime(h: number, m: number) {
  const str = formatTimeStr(h, m);
  if (isTimeOutOfRange(str)) return;
  draftHour.value = h;
  draftMinute.value = m;
  emit('update:modelValue', str);
  emit('change', str);
  runValidation(str);
}

function selectHour(h: number) {
  if (isHourDisabled(h)) return;
  sound.playChime(720);
  let targetMin = draftMinute.value;
  if (isTimeOutOfRange(formatTimeStr(h, targetMin))) {
    const validMin = minutes.value.find((m) => !isTimeOutOfRange(formatTimeStr(h, m)));
    if (validMin === undefined) return;
    targetMin = validMin;
  }
  commitTime(h, targetMin);
}

function selectMinute(m: number) {
  if (isMinuteDisabled(m)) return;
  sound.playChime(840);
  commitTime(draftHour.value, m);
}

function applyPreset(h: number, m: number) {
  const str = formatTimeStr(h, m);
  if (isTimeOutOfRange(str)) return;
  sound.playChime(880);
  commitTime(h, m);
  scrollActiveIntoView();
}

function pickNow() {
  const now = new Date();
  const h = now.getHours();
  const step = Math.max(1, Math.min(30, Math.floor(props.minuteStep)));
  const m = Math.floor(now.getMinutes() / step) * step;
  if (isTimeOutOfRange(formatTimeStr(h, m))) return;
  sound.playChime(880);
  commitTime(h, m);
  open.value = false;
}

function clearValue(e?: MouseEvent) {
  e?.stopPropagation();
  if (props.disabled) return;
  sound.playChime(523);
  emit('update:modelValue', '');
  emit('change', '');
  runValidation('');
  open.value = false;
}

function confirmClose() {
  if (!props.modelValue) {
    commitTime(draftHour.value, draftMinute.value);
  }
  sound.playChime(880);
  open.value = false;
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
</script>

<template>
  <div ref="wrapRef" class="ses-picker-wrap" @keydown="handleKeydown">
    <label v-if="label" class="ses-input-label">{{ label }}</label>

    <div style="position: relative">
      <button
        type="button"
        class="ses-yaqian-trigger ses-picker-trigger"
        :disabled="disabled"
        :aria-expanded="open"
        aria-haspopup="dialog"
        :class="{ 'is-disabled': disabled, 'has-error': activeErrors.length > 0 }"
        @click="toggleOpen"
      >
        <span class="ses-picker-trigger-main">
          <SesIcon name="clock" :size="16" class="ses-picker-icon" />
          <span v-if="modelValue" class="ses-picker-value">{{ modelValue }}</span>
          <span v-else class="ses-picker-placeholder">{{ resolvedPlaceholder }}</span>
          <span v-if="selectedMeta && showShichen" class="ses-picker-badge">
            {{ selectedMeta.shichen }} · {{ selectedMeta.watch.text }}
          </span>
        </span>
        <span class="ses-picker-trigger-actions">
          <span
            v-if="clearable && modelValue && !disabled"
            role="button"
            tabindex="0"
            class="ses-picker-clear"
            :aria-label="locale.isEn.value ? 'Clear time' : '清除时间'"
            @click="clearValue"
            @keydown.enter.stop="clearValue()"
          >
            ✕
          </span>
          <span
            class="ses-picker-caret"
            :style="{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }"
            aria-hidden="true"
          >
            ▾
          </span>
        </span>
      </button>

      <div
        v-if="open"
        role="dialog"
        :aria-label="locale.isEn.value ? 'Time picker' : '司辰择时'"
        class="ses-picker-popover ses-timepicker-popover"
      >
        <div class="ses-timepicker-summary">
          <span class="ses-timepicker-clock">{{ draftTimeStr }}</span>
          <span v-if="draftMeta && showShichen" class="ses-timepicker-shichen">
            {{ draftMeta.watch.isNight ? '🌙' : '☀' }} {{ draftMeta.shichen }} · {{ draftMeta.watch.text }}
          </span>
        </div>

        <div class="ses-timepicker-columns">
          <div ref="hourColRef" class="ses-timepicker-col" :aria-label="locale.isEn.value ? 'Hours' : '时'">
            <button
              v-for="h in hours"
              :key="h"
              type="button"
              class="ses-timepicker-item"
              :class="{
                'is-selected': draftHour === h,
                'is-disabled': isHourDisabled(h)
              }"
              :disabled="isHourDisabled(h)"
              @click="selectHour(h)"
            >
              {{ String(h).padStart(2, '0') }}
            </button>
          </div>

          <div ref="minuteColRef" class="ses-timepicker-col" :aria-label="locale.isEn.value ? 'Minutes' : '分'">
            <button
              v-for="m in minutes"
              :key="m"
              type="button"
              class="ses-timepicker-item"
              :class="{
                'is-selected': draftMinute === m,
                'is-disabled': isMinuteDisabled(m)
              }"
              :disabled="isMinuteDisabled(m)"
              @click="selectMinute(m)"
            >
              {{ String(m).padStart(2, '0') }}
            </button>
          </div>
        </div>

        <div v-if="showShichen" class="ses-timepicker-presets">
          <button
            v-for="preset in shichenPresets"
            :key="preset.label"
            type="button"
            class="ses-timepicker-preset-btn"
            :disabled="isTimeOutOfRange(formatTimeStr(preset.h, preset.m))"
            @click="applyPreset(preset.h, preset.m)"
          >
            {{ preset.label }}
          </button>
        </div>

        <div class="ses-picker-footer">
          <button type="button" class="ses-picker-foot-btn" @click="pickNow">
            {{ locale.isEn.value ? 'Now' : '此刻' }}
          </button>
          <div style="display: flex; gap: 0.45rem; align-items: center">
            <button v-if="clearable" type="button" class="ses-picker-foot-btn is-muted" @click="clearValue()">
              {{ locale.isEn.value ? 'Clear' : '清除' }}
            </button>
            <button type="button" class="ses-picker-foot-btn is-confirm" @click="confirmClose">
              {{ locale.isEn.value ? 'Done' : '确定' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeErrors.length > 0" class="ses-input-errors" role="alert">
      <div v-for="(err, idx) in activeErrors" :key="idx">{{ err }}</div>
    </div>
  </div>
</template>
