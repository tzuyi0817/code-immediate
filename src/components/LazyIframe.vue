<script setup lang="ts">
import { compile } from '@/utils/compile';
import { compileSfc } from '@/utils/compileSfc';
import { createHtml } from '@/utils/createHtml';
import { loadParseSource } from '@/utils/loadParse';
import {
  HTML_LANGUAGE_MAP,
  CSS_LANGUAGE_MAP,
  JS_LANGUAGE_MAP,
} from '@/config/language';
import type { CodeProject } from '@/types/codeContent';

interface Props {
  project: CodeProject;
}

const props = defineProps<Props>();
const srcdoc = await transformSrcdoc(props.project);

async function transformSrcdoc(project: CodeProject) {
  const { CSS, HTML, JS, VUE, codeTemplate } = project;
  const compileFun = VUE.content ? compileSfc : compile;
  await Promise.all([
    loadParseSource(HTML.language, HTML_LANGUAGE_MAP),
    loadParseSource(CSS.language, CSS_LANGUAGE_MAP),
    loadParseSource(JS.language, JS_LANGUAGE_MAP),
  ]);
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

  return createHtml({
    ...compileResult,
    cssResources: CSS.resources,
    jsResources: JS.resources,
  });
}
</script>

<template>
  <iframe
    :srcdoc="srcdoc"
    frameborder="0"
    loading="lazy"
    scrolling="no"
    class="w-full pointer-events-none rounded overflow-hidden bg-white border-gray-300 border-[1px] drop-shadow"
    tabindex="-1"
  ></iframe>
</template>
