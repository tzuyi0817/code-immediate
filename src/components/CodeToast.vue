<script setup lang="ts">
import toast from '@/utils/toast';

const { msg, status, isShowToast } = toast;
</script>

<template>
  <div :class="['toast', { 'toast-show': isShowToast }, status === 'success' ? 'bg-green-600' : 'bg-red-600']">
    {{ msg }}
  </div>
</template>

<style lang="postcss" scoped>
.toast {
  @apply z-50
  fixed
  right-0
  top-5
  translate-x-full
  transition-all
  p-[10px]
  rounded-[5px]
  text-white
  text-sm
  text-center
  font-semibold
  pointer-events-none;
  &-show {
    @apply -translate-x-3;
  }
}
</style>
