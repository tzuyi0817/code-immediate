<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store';
import { compile } from '@/utils/compile';
import type { CodeContent } from '@/types/codeContent';

const { codeContent } = storeToRefs(useCodeContentStore());
const srcdoc = ref('');
const htmlContent = computed(() => codeContent.value.HTML.content);
const cssContent = computed(() => codeContent.value.CSS.content);

function runCode(content: CodeContent) {
  srcdoc.value = compile(content);
}

watch([htmlContent, cssContent], ([html, css]) => {
  runCode({ html, css })
});
</script>

<template>
  <div class="code_preview">
    <iframe 
      class="h-full w-full"
      :srcdoc="srcdoc"
    ></iframe>
  </div>
</template>

<style lang="postcss" scoped>
.code_preview {
  @apply
  w-full
  h-[calc(60vh-88px)]
}
</style>