<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { validateField, type ValidationRule } from '@wolfeng/song-ui-core';
import { useSound } from '../composables/useSound.js';
import { useLocale } from '../composables/useLocale.js';
import { SONG_FORM_KEY, type SongFormFieldHandle } from '../composables/useFormContext.js';

export interface SesDatePickerProps {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  clearable?: boolean;
  showGanZhi?: boolean;
  rules?: ValidationRule<string>[];
  errorMessages?: string[];
}

const props = withDefaults(defineProps<SesDatePickerProps>(), {
  modelValue: '',
  label: undefined,
  placeholder: undefined,
  min: undefined,
  max: undefined,
  disabled: false,
  clearable: true,
  showGanZhi: true,
  rules: () => [],
  errorMessages: () => []
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
}>();

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
const WEEKDAYS_ZH = ['日', '一', '二', '三', '四', '五', '六'] as const;
const WEEKDAYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
const MONTHS_ZH = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'] as const;
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const sound = useSound();
const locale = useLocale();
const formCtx = inject(SONG_FORM_KEY, null);

const open = ref(false);
const viewMode = ref<'days' | 'months'>('days');
const wrapRef = ref<HTMLElement | null>(null);
const internalErrors = ref<string[]>([]);

function parseDateStr(str?: string): { y: number; m: number; d: number } | null {
  if (!str) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y, m, d };
}

function formatDateStr(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function getTodayParts() {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

const initialParts = parseDateStr(props.modelValue) ?? getTodayParts();
const viewYear = ref(initialParts.y);
const viewMonth = ref(initialParts.m);

watch(
  () => props.modelValue,
  (val) => {
    const parsed = parseDateStr(val);
    if (parsed) {
      viewYear.value = parsed.y;
      viewMonth.value = parsed.m;
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

function getYearGanZhi(year: number): string {
  const offset = ((year - 4) % 60 + 60) % 60;
  return `${STEMS[offset % 10]}${BRANCHES[offset % 12]}年`;
}

const resolvedPlaceholder = computed(
  () => props.placeholder ?? (locale.isEn.value ? 'Select date…' : '择日 · 请选择日期……')
);

const weekdays = computed(() => (locale.isEn.value ? WEEKDAYS_EN : WEEKDAYS_ZH));
const monthNames = computed(() => (locale.isEn.value ? MONTHS_EN : MONTHS_ZH));

const todayStr = computed(() => {
  const t = getTodayParts();
  return formatDateStr(t.y, t.m, t.d);
});

const headerTitle = computed(() => {
  if (locale.isEn.value) {
    return `${MONTHS_EN[viewMonth.value - 1]} ${viewYear.value}`;
  }
  return `${viewYear.value}年 ${viewMonth.value}月`;
});

const ganZhiBadge = computed(() => {
  if (!props.showGanZhi) return '';
  return getYearGanZhi(viewYear.value);
});

interface CalendarCell {
  dateStr: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

function isDateOutOfRange(dateStr: string): boolean {
  if (props.min && dateStr < props.min) return true;
  if (props.max && dateStr > props.max) return true;
  return false;
}

const calendarCells = computed<CalendarCell[]>(() => {
  const y = viewYear.value;
  const m = viewMonth.value;
  const firstDow = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();
  const prevMonth = m === 1 ? 12 : m - 1;
  const prevYear = m === 1 ? y - 1 : y;
  const daysInPrev = new Date(prevYear, prevMonth, 0).getDate();
  const nextMonth = m === 12 ? 1 : m + 1;
  const nextYear = m === 12 ? y + 1 : y;

  const cells: CalendarCell[] = [];
  for (let i = firstDow - 1; i >= 0; i--) {
    const day = daysInPrev - i;
    const dateStr = formatDateStr(prevYear, prevMonth, day);
    cells.push({
      dateStr,
      day,
      inMonth: false,
      isToday: dateStr === todayStr.value,
      isSelected: dateStr === props.modelValue,
      isDisabled: isDateOutOfRange(dateStr)
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateStr(y, m, day);
    cells.push({
      dateStr,
      day,
      inMonth: true,
      isToday: dateStr === todayStr.value,
      isSelected: dateStr === props.modelValue,
      isDisabled: isDateOutOfRange(dateStr)
    });
  }

  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const dateStr = formatDateStr(nextYear, nextMonth, day);
    cells.push({
      dateStr,
      day,
      inMonth: false,
      isToday: dateStr === todayStr.value,
      isSelected: dateStr === props.modelValue,
      isDisabled: isDateOutOfRange(dateStr)
    });
  }
  return cells;
});

function toggleOpen() {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) {
    viewMode.value = 'days';
    const parsed = parseDateStr(props.modelValue) ?? getTodayParts();
    viewYear.value = parsed.y;
    viewMonth.value = parsed.m;
  }
  sound.playChime(open.value ? 740 : 587);
}

function shiftMonth(delta: number) {
  let m = viewMonth.value + delta;
  let y = viewYear.value;
  if (m < 1) {
    m = 12;
    y -= 1;
  } else if (m > 12) {
    m = 1;
    y += 1;
  }
  viewMonth.value = m;
  viewYear.value = y;
  sound.playChime(660);
}

function shiftYear(delta: number) {
  viewYear.value += delta;
  sound.playChime(620);
}

function selectCell(cell: CalendarCell) {
  if (cell.isDisabled) return;
  sound.playChime(880);
  emit('update:modelValue', cell.dateStr);
  emit('change', cell.dateStr);
  runValidation(cell.dateStr);
  open.value = false;
}

function selectMonth(monthIdx: number) {
  viewMonth.value = monthIdx + 1;
  viewMode.value = 'days';
  sound.playChime(740);
}

function pickToday() {
  const t = todayStr.value;
  if (isDateOutOfRange(t)) return;
  const parts = getTodayParts();
  viewYear.value = parts.y;
  viewMonth.value = parts.m;
  sound.playChime(880);
  emit('update:modelValue', t);
  emit('change', t);
  runValidation(t);
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
          <span class="ses-picker-icon" aria-hidden="true">📅</span>
          <span v-if="modelValue" class="ses-picker-value">{{ modelValue }}</span>
          <span v-else class="ses-picker-placeholder">{{ resolvedPlaceholder }}</span>
          <span v-if="modelValue && showGanZhi" class="ses-picker-badge">
            {{ getYearGanZhi(parseDateStr(modelValue)?.y ?? viewYear) }}
          </span>
        </span>
        <span class="ses-picker-trigger-actions">
          <span
            v-if="clearable && modelValue && !disabled"
            role="button"
            tabindex="0"
            class="ses-picker-clear"
            :aria-label="locale.isEn.value ? 'Clear date' : '清除日期'"
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
        :aria-label="locale.isEn.value ? 'Date picker' : '宋历择日'"
        class="ses-picker-popover ses-datepicker-popover"
      >
        <div class="ses-datepicker-header">
          <div class="ses-datepicker-nav-group">
            <button type="button" class="ses-datepicker-nav-btn" :title="locale.isEn.value ? 'Previous year' : '上一年'" @click="shiftYear(-1)">«</button>
            <button type="button" class="ses-datepicker-nav-btn" :title="locale.isEn.value ? 'Previous month' : '上一月'" @click="shiftMonth(-1)">‹</button>
          </div>

          <button
            type="button"
            class="ses-datepicker-title-btn"
            @click="viewMode = viewMode === 'days' ? 'months' : 'days'"
          >
            <span>{{ headerTitle }}</span>
            <span v-if="ganZhiBadge" class="ses-datepicker-ganzhi">{{ ganZhiBadge }}</span>
          </button>

          <div class="ses-datepicker-nav-group">
            <button type="button" class="ses-datepicker-nav-btn" :title="locale.isEn.value ? 'Next month' : '下一月'" @click="shiftMonth(1)">›</button>
            <button type="button" class="ses-datepicker-nav-btn" :title="locale.isEn.value ? 'Next year' : '下一年'" @click="shiftYear(1)">»</button>
          </div>
        </div>

        <template v-if="viewMode === 'days'">
          <div class="ses-datepicker-weekdays">
            <span v-for="wd in weekdays" :key="wd" class="ses-datepicker-wd">{{ wd }}</span>
          </div>

          <div class="ses-datepicker-grid">
            <button
              v-for="cell in calendarCells"
              :key="cell.dateStr"
              type="button"
              class="ses-datepicker-cell"
              :class="{
                'is-outside': !cell.inMonth,
                'is-today': cell.isToday,
                'is-selected': cell.isSelected,
                'is-disabled': cell.isDisabled
              }"
              :disabled="cell.isDisabled"
              :aria-pressed="cell.isSelected"
              @click="selectCell(cell)"
            >
              {{ cell.day }}
            </button>
          </div>
        </template>

        <div v-else class="ses-datepicker-months">
          <button
            v-for="(mLabel, idx) in monthNames"
            :key="mLabel"
            type="button"
            class="ses-datepicker-month-btn"
            :class="{ 'is-selected': viewMonth === idx + 1 }"
            @click="selectMonth(idx)"
          >
            {{ mLabel }}
          </button>
        </div>

        <div class="ses-picker-footer">
          <button type="button" class="ses-picker-foot-btn" :disabled="isDateOutOfRange(todayStr)" @click="pickToday">
            {{ locale.isEn.value ? 'Today' : '今日' }}
          </button>
          <button v-if="clearable" type="button" class="ses-picker-foot-btn is-muted" @click="clearValue()">
            {{ locale.isEn.value ? 'Clear' : '清除' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="activeErrors.length > 0" class="ses-input-errors" role="alert">
      <div v-for="(err, idx) in activeErrors" :key="idx">{{ err }}</div>
    </div>
  </div>
</template>
