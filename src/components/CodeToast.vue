<script setup lang="ts">
import { toast } from '@/utils/toast';

const { msg, status, isShowToast } = toast;
</script>

<template>
  <div
    :class="['toast', { 'toast-show': isShowToast }, status]"
    role="alert"
  >
    <pre>{{ msg }}</pre>
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
  py-3
  px-5
  border-2
  bg-[#292218]/90
  whitespace-pre-wrap
  rounded-md
  text-sm
  font-semibold
  drop-shadow
  duration-300
  pointer-events-none;
  &-show {
    @apply -translate-x-3;
  }
  &.success {
    @apply border-green-600 text-green-400;
  }
  &.error {
    @apply border-red-600 text-red-400;
  }
  &.warn {
    @apply border-yellow-600 text-yellow-400;
  }
}
</style>
