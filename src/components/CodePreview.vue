<script setup lang="ts">
import { ref, watch, inject, Ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore, useFlagStore } from '@/store';
import { compile } from '@/utils/compile';
import { createHtml } from '@/utils/createHtml';
import { loadParseSources } from '@/utils/loadParse';
import { dynamicImport } from '@/utils/import';

const srcdoc = ref('');
const iframe: Ref<HTMLIFrameElement> | undefined = inject('iframe');
const { codeContent, isSFC } = storeToRefs(useCodeContentStore());
const { isFormatter, isStartDrag } = storeToRefs(useFlagStore());

async function runCode() {
  const { compileSfc } = await dynamicImport('compileSfc');
  const { setLoading } = useFlagStore();
  const {
    codeContent: { HTML, CSS, JS, VUE },
    codeTemplate,
  } = useCodeContentStore();
  const compileFun = isSFC.value ? compileSfc : compile;

  setLoading({ isOpen: true, type: 'Process code' });

  try {
    const compileResult = await compileFun({
      html: {
        language: HTML.language,
        content: HTML.content,
      },
      css: {
        language: CSS.language,
        content: CSS.content,
        resources: CSS.resources,
      },
      js: {
        language: JS.language,
        content: JS.content,
        resources: JS.resources,
      },
      vue: {
        language: VUE.language,
        content: VUE.content,
      },
      codeTemplate,
    });

    srcdoc.value = createHtml({
      ...compileResult,
      cssResources: CSS.resources,
      jsResources: JS.resources,
    });
    setLoading({ isOpen: false, type: 'Process code finished' });
  } catch (error) {
    const isErrorConstructor = error instanceof Error;
    const message = isErrorConstructor ? error.message : String(error);

    iframe?.value?.contentWindow?.postMessage?.(
      {
        type: 'throwError',
        value: message,
      },
      '*',
    );
    setLoading({ isOpen: false, type: 'Process code error' });
    if (import.meta.env.MODE !== 'test') throw new Error(message, { cause: isErrorConstructor ? error : void 0 });
  }
}

function initLoadParseSource() {
  const { HTML, CSS, JS } = codeContent.value;

  loadParseSources({ HTML, CSS, JS }).then(runCode);
}

watch(
  codeContent,
  () => {
    !isFormatter.value && runCode();
  },
  { deep: true },
);

onMounted(initLoadParseSource);
</script>

<template>
  <div class="code_preview">
    <iframe
      ref="iframe"
      title="code preview"
      :class="['h-full w-full', { 'pointer-events-none': isStartDrag }]"
      :srcdoc="srcdoc"
      frameborder="0"
    ></iframe>
  </div>
</template>
