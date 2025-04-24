<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentPage: number;
  pageCount: number;
  disabled?: boolean;
}

const { disabled, currentPage, pageCount } = defineProps<Props>();

const internalDisabled = computed(() => disabled || currentPage >= pageCount);
</script>

<template>
  <button
    class="btn btn_yellow w-8 h-8"
    :disabled="internalDisabled"
    aria-label="pagination next"
    :aria-disabled="internalDisabled"
  >
    <font-awesome-icon icon="fa-solid fa-angle-right" />
  </button>
</template>
