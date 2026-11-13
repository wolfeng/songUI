<script setup lang="ts">
export interface SesAlertProps {
  variant?: 'jinzipai' | 'celadon';
  title: string;
  badge?: string;
}

withDefaults(defineProps<SesAlertProps>(), {
  variant: 'jinzipai'
});
</script>

<template>
  <div
    role="alert"
    :class="variant === 'jinzipai' ? 'ses-jinzipai-alert' : 'ses-celadon-alert'"
  >
    <div
      style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.4rem; margin-bottom: 0.5rem"
      :style="{
        borderBottom:
          variant === 'jinzipai'
            ? '1px solid rgba(223, 184, 112, 0.3)'
            : '1px solid var(--ses-border-hairline)'
      }"
    >
      <span
        class="ses-slender-display"
        style="font-size: 0.875rem; font-weight: 700; letter-spacing: 0.22em"
        :style="{ color: variant === 'jinzipai' ? '#F7DF9C' : 'var(--ses-ink-heavy)' }"
      >
        {{ title }}
      </span>
      <span
        v-if="badge"
        style="font-size: 0.65rem; padding: 0.125rem 0.45rem; border-radius: 2px; font-family: monospace"
        :style="{
          backgroundColor: variant === 'jinzipai' ? 'rgba(0,0,0,0.3)' : 'var(--ses-bg-canvas)',
          color: variant === 'jinzipai' ? '#F3D999' : 'var(--ses-gold)'
        }"
      >
        {{ badge }}
      </span>
    </div>
    <div
      style="font-size: 0.78rem; line-height: 1.65"
      :style="{ color: variant === 'jinzipai' ? 'rgba(247, 239, 224, 0.92)' : 'var(--ses-ink-medium)' }"
    >
      <slot />
    </div>
  </div>
</template>
