<script setup lang="ts">
interface Props {
  isLoading?: boolean;
  disabled?: boolean;
}

defineOptions({ name: 'LoadingButton' });
defineProps<Props>();
</script>

<template>
  <button
    class="btn text-sm select-none"
    :disabled="isLoading || disabled"
  >
    <font-awesome-icon
      v-show="isLoading"
      aria-label="fa-spinner"
      :aria-hidden="false"
      icon="fa-solid fa-spinner"
      class="animate-spin mr-3"
    />
    <slot></slot>
  </button>
</template>
