<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSound } from '../composables/useSound.js';

export interface SesTableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface SesTableProps {
  columns: SesTableColumn[];
  rows: Record<string, unknown>[];
  rowKey?: string;
}

const props = withDefaults(defineProps<SesTableProps>(), {
  rowKey: 'id'
});

const sound = useSound();
const sortKey = ref<string | null>(null);
const sortAsc = ref(false);

const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows;
  const key = sortKey.value;
  return [...props.rows].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    const na = typeof va === 'number' ? va : Number(String(va).replace(/,/g, ''));
    const nb = typeof vb === 'number' ? vb : Number(String(vb).replace(/,/g, ''));
    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      return sortAsc.value ? na - nb : nb - na;
    }
    return sortAsc.value
      ? String(va ?? '').localeCompare(String(vb ?? ''))
      : String(vb ?? '').localeCompare(String(va ?? ''));
  });
});

function toggleSort(col: SesTableColumn) {
  if (!col.sortable) return;
  if (sortKey.value === col.key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = col.key;
    sortAsc.value = false;
  }
  sound.playChime(sortAsc.value ? 659.25 : 783.99);
}
</script>

<template>
  <div style="overflow-x: auto">
    <table class="ses-fishscale-table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{
              textAlign: col.align ?? 'left',
              cursor: col.sortable ? 'pointer' : 'default'
            }"
            @click="toggleSort(col)"
          >
            <span>{{ col.title }}</span>
            <span v-if="col.sortable" style="margin-left: 0.35rem; font-size: 0.7rem; color: var(--ses-gold)">
              {{ sortKey === col.key ? (sortAsc ? '▲' : '▼') : '⇅' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedRows" :key="String(row[rowKey] ?? idx)">
          <td
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align ?? 'left' }"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
