<script setup lang="ts">
export interface SesCardProps {
  hoverable?: boolean;
  corners?: boolean;
}

withDefaults(defineProps<SesCardProps>(), {
  hoverable: true,
  corners: true
});
</script>

<template>
  <section
    class="ses-card"
    :class="{
      'ses-card--hoverable': hoverable,
      'ses-card--corners': corners
    }"
  >
    <slot />
  </section>
</template>
