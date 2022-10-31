<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ajax from '@/utils/ajax';
import { compile } from '@/utils/compile';
import { compileSfc } from '@/utils/compileSfc';
import { createHtml } from '@/utils/createHtml';
import type { CodeProject } from '@/types/codeContent';

const emit = defineEmits(['update:isShowProjectsPop']);
const projects = ref<CodeProject[]>([]);
const page = ref(1);
const totalPage = ref(0);

async function getProjects() {
  const { resultMap } = await ajax.get('/code');
  const { codeList, page: P, totalPage: T } = resultMap;

  projects.value = [...projects.value, ...codeList];
  page.value = P;
  totalPage.value = T;
}

async function transformSrcdoc(project: CodeProject) {
  const { CSS, HTML, JS, VUE, codeTemplate, importMap } = project;
  const compileFun = VUE.content ? compileSfc : compile;
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
  }, false);

  return createHtml({
    ...compileResult,
    cssResources: CSS.resources,
    jsResources: JS.resources,
    importMap,
  });
}

function closePopup() {
  emit('update:isShowProjectsPop', false);
}

onMounted(getProjects);
</script>

<template>
  <div class="projects_popup popup" @click.self="closePopup">
    <div class="popup_content max-w-5xl">
      <div class="flex justify-between items-center">
        <h3>Projects</h3>
        <font-awesome-icon 
          icon="fa-solid fa-xmark"
          class="cursor-pointer"
          @click="closePopup"
        />
      </div>

      <ul class="grid grid-cols-1 lg:grid-cols-3 overflow-y-auto gap-3 py-5">
        <li v-for="project in projects" :key="project.id" class="projects_popup_card">
          <iframe
            :srcdoc="''"
            frameborder="0"
            loading="lazy"
            scrolling="no"
            class="w-full pointer-events-none rounded mb-3 overflow-hidden"
            tabindex="-1"
          ></iframe>
          <p>{{ project.title ?? 454545454 }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.projects_popup {
  &_card {
    @apply
    rounded
    border-[1px]
    border-transparent
    text-center
    text-gray-500
    cursor-pointer
    p-2
    transition-all
    duration-500
    hover:bg-black/5
    hover:drop-shadow-xl
    hover:border-gray-300
    hover:shadow-lg
    hover:font-bold
  }
}
</style>