<script setup lang="ts">
import { createHtml } from '@/utils/create-html';
import { loadParseSources } from '@/utils/load-parse';
import { compile } from '@/utils/compile';
import { compileSfc } from '@/utils/compile-sfc';
import type { CodeProject } from '@/types/code-content';

interface Props {
  project: CodeProject;
}

const { project } = defineProps<Props>();
const srcdoc = await transformSrcdoc(project);

async function transformSrcdoc(codeProject: CodeProject) {
  const { CSS, HTML, JS, VUE, codeTemplate } = codeProject;
  const compileFun = VUE.content ? compileSfc : compile;

  await loadParseSources({ HTML, CSS, JS });
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
    sandbox="allow-scripts allow-same-origin"
    :title="`${project.id}-lazy-iframe`"
    frameborder="0"
    loading="lazy"
    scrolling="no"
    tabindex="-1"
  ></iframe>
</template>
