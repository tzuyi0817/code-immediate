<script setup lang="ts">
interface Props {
  isLoading: boolean;
  disabled?: boolean;
}

defineProps<Props>();
</script>

<template>
  <button
    class="btn text-sm"
    :disabled="isLoading || disabled"
  >
    <font-awesome-icon
      v-show="isLoading"
      icon="fa-solid fa-spinner"
      class="animate-spin mr-3"
    />
    <slot></slot>
  </button>
</template>
