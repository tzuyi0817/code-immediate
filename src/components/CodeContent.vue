<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store';

const { codeContent } = storeToRefs(useCodeContentStore());
const srcdoc = ref('');
const htmlContent = computed(() => codeContent.value.HTML.content);

function runCode(content: string) {
  srcdoc.value = content;
}

watch(htmlContent, runCode);
</script>

<template>
  <div class="code_content">
    <iframe 
      class="h-full w-full"
      :srcdoc="srcdoc"
    ></iframe>
  </div>
</template>

<style lang="postcss" scoped>
.code_content {
  @apply
  w-full
  h-[calc(60vh-88px)]
}
</style>