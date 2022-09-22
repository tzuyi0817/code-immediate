<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store';
import { compile } from '@/utils/compile';
import { createHtml } from '@/utils/createHtml';
import type { CodeContent } from '@/types/codeContent';

const { codeContent } = storeToRefs(useCodeContentStore());
const srcdoc = ref('');

async function runCode(content: CodeContent) {
  const compileResult = await compile(content);
  srcdoc.value = createHtml(compileResult);
}

watch(codeContent, ({ HTML, CSS, JS, VUE }) => {
  runCode({
    html: HTML.content,
    css: CSS.content,
    js: JS.content,
  });
}, { deep: true });
</script>

<template>
  <div class="code_preview">
    <iframe 
      class="h-full w-full"
      :srcdoc="srcdoc"
      frameborder="0"
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