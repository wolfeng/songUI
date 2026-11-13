<script setup lang="ts">
import { ref, computed } from 'vue';

export interface SesMountainPoint {
  label: string;
  backValue: number;
  frontValue: number;
  unit?: string;
}

export interface SesMountainChartProps {
  data: SesMountainPoint[];
  seriesBackName?: string;
  seriesFrontName?: string;
  peakLabel?: string;
}

const props = withDefaults(defineProps<SesMountainChartProps>(), {
  seriesBackName: '石青主峰',
  seriesFrontName: '石绿前坡',
  peakLabel: '极峰'
});

interface SvgPoint {
  x: number;
  y: number;
}

function buildCatmullRomAreaPath(points: SvgPoint[], baseY = 220, tension = 0.23): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const isP1Ext = (p1.y <= p0.y && p1.y <= p2.y) || (p1.y >= p0.y && p1.y >= p2.y);
    const isP2Ext = (p2.y <= p1.y && p2.y <= p3.y) || (p2.y >= p1.y && p2.y >= p3.y);

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = isP1Ext ? p1.y : p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = isP2Ext ? p2.y : p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(1)} ${baseY} L ${points[0].x.toFixed(1)} ${baseY} Z`;
  return d;
}

const maxVal = computed(() => {
  const m = Math.max(...props.data.map((d) => Math.max(d.backValue, d.frontValue)), 1);
  return m * 1.15;
});

const coords = computed(() => {
  const count = Math.max(2, props.data.length);
  return props.data.map((d, idx) => {
    const x = (idx / (count - 1)) * 600;
    const by = 205 - (d.backValue / maxVal.value) * 165;
    const fy = 205 - (d.frontValue / maxVal.value) * 165;
    return { ...d, x, by, fy };
  });
});

const backPath = computed(() =>
  buildCatmullRomAreaPath(coords.value.map((c) => ({ x: c.x, y: c.by })))
);
const frontPath = computed(() =>
  buildCatmullRomAreaPath(coords.value.map((c) => ({ x: c.x, y: c.fy })))
);
const farPath = computed(() =>
  buildCatmullRomAreaPath(
    coords.value.map((c, idx) => ({
      x: c.x,
      y: Math.max(48, Math.min(160, c.by - 16 + Math.sin(idx * 1.15) * 14))
    }))
  )
);

const peakPoint = computed(() => {
  if (coords.value.length === 0) return { leftPct: 50, topPx: 18, val: 0, unit: '' };
  let best = coords.value[0];
  for (const c of coords.value) {
    if (c.backValue > best.backValue) best = c;
  }
  return {
    leftPct: (best.x / 600) * 100,
    topPx: Math.max(12, (best.by / 240) * 240 - 30),
    val: best.backValue,
    unit: best.unit ?? ''
  };
});

const hoverIdx = ref<number | null>(null);
const hoveredItem = computed(() =>
  hoverIdx.value !== null ? coords.value[hoverIdx.value] ?? null : null
);

function onMouseMove(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  hoverIdx.value = Math.min(props.data.length - 1, Math.round(ratio * (props.data.length - 1)));
}
</script>

<template>
  <div
    style="
      position: relative;
      width: 100%;
      height: 270px;
      border-radius: 4px;
      border: 0.5px solid var(--ses-border-gold);
      background: var(--ses-bg-canvas);
      overflow: hidden;
      cursor: crosshair;
      user-select: none;
    "
    @mousemove="onMouseMove"
    @mouseleave="hoverIdx = null"
  >
    <svg viewBox="0 0 600 240" style="width: 100%; height: 100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sesDistMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#527B99" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#232924" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="sesAzuritePeak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2E5A78" stop-opacity="0.92" />
          <stop offset="55%" stop-color="#4A7A68" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#232924" stop-opacity="0.04" />
        </linearGradient>
        <linearGradient id="sesMalachiteSlope" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4E7D5B" stop-opacity="0.88" />
          <stop offset="65%" stop-color="#769671" stop-opacity="0.58" />
          <stop offset="100%" stop-color="#8A663B" stop-opacity="0.15" />
        </linearGradient>
      </defs>

      <path :d="farPath" fill="url(#sesDistMist)" style="transition: d 0.8s var(--ses-ease-scroll)" />
      <path :d="backPath" fill="url(#sesAzuritePeak)" stroke="#7EA8BE" stroke-width="1.2" vector-effect="non-scaling-stroke" style="transition: d 0.8s var(--ses-ease-scroll)" />
      <path :d="frontPath" fill="url(#sesMalachiteSlope)" stroke="var(--ses-gold)" stroke-width="1.5" vector-effect="non-scaling-stroke" style="transition: d 0.8s var(--ses-ease-scroll)" />
    </svg>

    <!-- 悬停指示线与正圆数据点（HTML 叠层避免 preserveAspectRatio="none" 导致圆点变形） -->
    <template v-if="hoveredItem">
      <div
        :style="{
          position: 'absolute',
          left: `${(hoveredItem.x / 600) * 100}%`,
          top: '8.33%',
          bottom: '10.42%',
          width: '0px',
          borderLeft: '1.5px dashed var(--ses-gold)',
          transform: 'translateX(-0.5px)',
          pointerEvents: 'none'
        }"
      />
      <div
        :style="{
          position: 'absolute',
          left: `${(hoveredItem.x / 600) * 100}%`,
          top: `${(hoveredItem.by / 240) * 100}%`,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#7EA8BE',
          border: '1.5px solid #1B201C',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }"
      />
      <div
        :style="{
          position: 'absolute',
          left: `${(hoveredItem.x / 600) * 100}%`,
          top: `${(hoveredItem.fy / 240) * 100}%`,
          width: '11px',
          height: '11px',
          borderRadius: '50%',
          backgroundColor: 'var(--ses-cinnabar)',
          border: '1.5px solid #F7F4EC',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }"
      />
    </template>

    <div
      class="ses-slender-display"
      style="
        pointer-events: none;
        position: absolute;
        transform: translateX(-50%);
        padding: 0.2rem 0.65rem;
        border-radius: 3px;
        background: var(--ses-cinnabar);
        border: 1px solid var(--ses-gold);
        color: #F7F4EC;
        font-size: 0.68rem;
        white-space: nowrap;
      "
      :style="{ left: `${peakPoint.leftPct}%`, top: `${peakPoint.topPx}px` }"
    >
      {{ peakLabel }} · {{ peakPoint.val }}{{ peakPoint.unit }}
    </div>

    <div
      v-if="hoveredItem"
      style="
        pointer-events: none;
        position: absolute;
        top: 0.75rem;
        left: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        background: var(--ses-bg-sidebar);
        border: 1px solid var(--ses-border-gold);
        font-size: 0.72rem;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
      "
    >
      <div style="color: var(--ses-gold); font-weight: 600">{{ hoveredItem.label }}</div>
      <div style="color: var(--ses-ink-heavy); margin-top: 0.2rem">
        {{ seriesBackName }}：<strong>{{ hoveredItem.backValue }}{{ hoveredItem.unit ?? '' }}</strong>
      </div>
      <div style="color: var(--ses-ink-medium)">
        {{ seriesFrontName }}：<strong>{{ hoveredItem.frontValue }}{{ hoveredItem.unit ?? '' }}</strong>
      </div>
    </div>

    <div
      style="
        position: absolute;
        bottom: 0.35rem;
        left: 0.75rem;
        right: 0.75rem;
        display: flex;
        justify-content: space-between;
        font-size: 0.65rem;
        color: var(--ses-ink-light);
      "
    >
      <span v-for="item in data" :key="item.label">{{ item.label }}</span>
    </div>
  </div>
</template>
