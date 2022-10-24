<script setup lang="ts">
import { ref } from 'vue';
import CodeConsole from '@/components/CodeConsole.vue';
import CodeLoading from '@/components/CodeLoading.vue';

const isShowConsole = ref(false);

function toggleConsole() {
  isShowConsole.value = !isShowConsole.value;
}
</script>

<template>
  <div class="code_footer">
    <button class="btn btn_base rounded-sm h-5 mx-2" @click="toggleConsole">
      Console
    </button>

    <select class="select select_base">
      <option value="1">1.0x</option>
      <option value="0.5">0.5x</option>
      <option value="0.25">0.25x</option>
    </select>

    <code-loading />
    <code-console v-model:isShowConsole="isShowConsole" />
  </div>
</template>

<style lang="postcss" scoped>
.code_footer {
  @apply
  fixed
  flex
  items-center
  bg-gray-900
  w-full
  h-8
  bottom-0
  z-[3];
}
</style>