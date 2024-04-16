<script setup lang="ts">
interface Props {
  isLoading: boolean;
}

defineProps<Props>();
</script>

<template>
  <button
    class="btn text-sm"
    :disabled="isLoading"
  >
    <font-awesome-icon
      v-show="isLoading"
      icon="fa-solid fa-spinner"
      class="animate-spin mr-3"
    />
    <slot></slot>
  </button>
</template>
