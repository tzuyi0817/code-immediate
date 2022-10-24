<script setup lang="ts">
import { ref, watch, inject, Ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore, useFlagStore } from '@/store';
import { compile } from '@/utils/compile';
import { compileSfc } from '@/utils/compileSfc';
import { createHtml } from '@/utils/createHtml';
import { loadParseSource } from '@/utils/loadParse';
import {
  HTML_LANGUAGE_MAP,
  CSS_LANGUAGE_MAP,
  JS_LANGUAGE_MAP,
} from '@/config/language';
import type { CodeContent, CodeModel } from '@/types/codeContent';

const srcdoc = ref('');
const iframe: Ref<HTMLIFrameElement> | undefined = inject('iframe');
const { codeContent, isSFC } = storeToRefs(useCodeContentStore());
const { isFormatter } = storeToRefs(useFlagStore());

async function runCode(content: CodeContent) {
  const { setLoading } = useFlagStore();
  const compileFun = isSFC.value ? compileSfc : compile;

  setLoading({ isOpen: true, type: 'Process code' });
  const compileResult = await compileFun(content)
    .catch((error: Error) => {
      iframe?.value.contentWindow?.postMessage({
        type: 'throwError',
        value: error.message,
      });
      setLoading({ isOpen: false, type: 'Process code error' });
      throw error;
    });
  srcdoc.value = createHtml(compileResult);
  setLoading({ isOpen: false, type: 'Process code finished' });
}

function initLoadParseSource() {
  const { codeContent } = useCodeContentStore();
  const { HTML, CSS, JS } = codeContent;

  Promise.all([
    loadParseSource(HTML.language, HTML_LANGUAGE_MAP),
    loadParseSource(CSS.language, CSS_LANGUAGE_MAP),
    loadParseSource(JS.language, JS_LANGUAGE_MAP),
  ]).then(() => {
    runCode(pickContent(codeContent));
  });
}

function pickContent(codeMap: Record<CodeModel, Record<'content', string>>) {
  const { HTML, CSS, JS, VUE } = codeMap;
  return { html: HTML.content, css: CSS.content, js: JS.content, vue: VUE.content };
}

watch(codeContent, (codeMap) => {
  !isFormatter.value && runCode(pickContent(codeMap));
}, { deep: true });

onMounted(initLoadParseSource);
</script>

<template>
  <div class="code_preview">
    <iframe 
      ref="iframe"
      class="h-full w-full pointer-events-none"
      :srcdoc="srcdoc"
      frameborder="0"
    ></iframe>
  </div>
</template>
