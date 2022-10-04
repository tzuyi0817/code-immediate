<script setup lang="ts">
import { ref, watch, inject, Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore, useFlagStore } from '@/store';
import { compile } from '@/utils/compile';
import { createHtml } from '@/utils/createHtml';
import type { CodeContent } from '@/types/codeContent';

const srcdoc = ref('');
const iframe: Ref<HTMLIFrameElement> = inject('iframe')!;
const { codeContent } = storeToRefs(useCodeContentStore());
const { setLoading } = useFlagStore();

async function runCode(content: CodeContent) {
  setLoading(true);
  const compileResult = await compile(content)
    .catch(error => { throw Error(error) });
  srcdoc.value = createHtml(compileResult);
  setLoading(false);
}

watch(codeContent, ({ HTML, CSS, JS }) => {
  runCode({
    html: HTML.content,
    css: CSS.content,
    js: JS.content,
  });
}, { deep: true , immediate: true });
</script>

<template>
  <div class="code_preview">
    <iframe 
      ref="iframe"
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