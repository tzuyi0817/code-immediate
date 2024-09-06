<script setup lang="ts">
import { ref } from 'vue';
import CodeConsole from '@/components/CodeConsole.vue';
import CodeLoading from '@/components/CodeLoading.vue';

interface Props {
  previewWidth: string;
}

defineProps<Props>();

const isShowConsole = ref(false);

function toggleConsole() {
  isShowConsole.value = !isShowConsole.value;
}
</script>

<template>
  <div class="code_footer">
    <section class="code_footer_section">
      <button
        class="btn_small btn_base"
        @click="toggleConsole"
      >
        Console
      </button>
    </section>

    <section class="code_footer_section">
      <code-loading />
    </section>

    <code-console
      v-model:is-show-console="isShowConsole"
      :preview-width="previewWidth"
    />
  </div>
</template>

<style lang="postcss" scoped>
.code_footer {
  @apply fixed
  flex
  justify-between
  items-center
  bg-black
  w-full
  h-8
  px-2
  bottom-0
  z-[3];
  &_section {
    @apply flex items-center gap-3;
  }
}
</style>
