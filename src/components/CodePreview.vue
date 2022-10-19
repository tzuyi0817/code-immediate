<script setup lang="ts">
import { ref, watch, inject, Ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore, useFlagStore } from '@/store';
import { compile } from '@/utils/compile';
import { compileSfc } from '@/utils/compileSfc';
import { createHtml } from '@/utils/createHtml';
import type { CodeContent } from '@/types/codeContent';

const srcdoc = ref('');
const iframe: Ref<HTMLIFrameElement> | undefined = inject('iframe');
const { codeContent, isSFC } = storeToRefs(useCodeContentStore());
const { setLoading } = useFlagStore();

async function runCode(content: CodeContent) {
  setLoading(true);
  const compileFun = isSFC.value ? compileSfc : compile;
  const compileResult = await compileFun(content)
    .catch((error: Error) => {
      iframe?.value.contentWindow?.postMessage({
        type: 'throwError',
        value: error.message,
      });
      setLoading(false);
      throw error;
    });
  srcdoc.value = createHtml(compileResult);
  setLoading(false);
}

watch(codeContent, ({ HTML, CSS, JS, VUE }) => {
  runCode({
    html: HTML.content,
    css: CSS.content,
    js: JS.content,
    vue: VUE.content,
  });
}, { deep: true, immediate: true });
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
