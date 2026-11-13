<script setup lang="ts">
import { useToast } from '../composables/useToast.js';

const toast = useToast();
</script>

<template>
  <div
    v-if="toast.visible.value"
    role="status"
    aria-live="polite"
    style="
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      pointer-events: none;
    "
  >
    <div
      style="
        padding: 0.65rem 1.25rem;
        border-radius: 4px;
        background-color: var(--ses-ink-heavy);
        color: var(--ses-bg-canvas);
        border: 1px solid var(--ses-gold);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.78rem;
        letter-spacing: 0.18em;
      "
    >
      <span style="color: var(--ses-gold)">❖</span>
      <span>{{ toast.message.value }}</span>
    </div>
  </div>
</template>
