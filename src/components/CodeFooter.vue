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
      <!-- <font-awesome-icon 
        icon="fa-solid fa-angle-down" 
        :class="['text-base', 'rotate-180']"
      /> -->
      Console
    </button>

    <select class="select select_base">
      <option value="1">1.0x</option>
      <option value="0.5">0.5x</option>
      <option value="0.25">0.25x</option>
    </select>

    <CodeLoading />
    <CodeConsole v-model:isShowConsole="isShowConsole" />
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
  bottom-0;
}
</style>