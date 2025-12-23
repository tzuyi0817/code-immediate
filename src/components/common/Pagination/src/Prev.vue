<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentPage: number;
  disabled?: boolean;
}

const { disabled, currentPage } = defineProps<Props>();

const internalDisabled = computed(() => disabled || currentPage <= 1);
</script>

<template>
  <button
    class="btn btn-yellow h-8 w-8"
    :disabled="internalDisabled"
    aria-label="pagination prev"
    :aria-disabled="internalDisabled"
  >
    <font-awesome-icon icon="fa-solid fa-angle-left" />
  </button>
</template>
