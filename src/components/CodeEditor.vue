<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import useMonacoEditor from '@/hooks/useMonacoEditor';
import { debounce } from '@/utils/common';
import { useCodeContentStore } from '@/store';
import type { CodeModel } from '@/types/codeContent';

interface Props {
  model: CodeModel;
}

const props = defineProps<Props>();
const codeEditor = ref();
const { codeContent, codeTemplate } = storeToRefs(useCodeContentStore());
const language = computed(() => codeContent.value[props.model].language);
const resizeEditor = debounce(() => monacoEditor.editor?.layout(), 100);
const resizeObserver = new ResizeObserver(entries => {
  entries.forEach(({ contentRect: { height, width } }) => {
    if (height === 0 || width === 0) return;
    resizeEditor();
  });
});

const {
  monacoEditor,
  createEditor,
  updateEditorModel,
} = useMonacoEditor();

function initEditor() {
  const { content } = codeContent.value[props.model];
  createEditor(codeEditor.value, props.model);
  updateEditorModel(content, language.value);
  resizeObserver.observe(codeEditor.value.parentNode);
}

watch([language, codeTemplate], ([language]) => {
  const { content } = codeContent.value[props.model];
  updateEditorModel(content, language);
});

onMounted(initEditor);
onBeforeUnmount(() => {
  resizeObserver.unobserve(codeEditor.value.parentNode);
});
</script>

<template>
  <div class="code_editor">
    <div ref="codeEditor" class="w-full h-full"></div>
  </div>
</template>

<style lang="postcss">
.code_editor {
  @apply
  w-full
  bg-black/90
  border-b-2
  border-gray-700/60
  pt-1;
  .iPadShowKeyboard {
    @apply hidden;
  }
}
</style>