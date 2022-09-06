<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import useMonacoEditor from '@/hooks/useMonacoEditor';
import { throttle } from '@/utils/common';

interface Props {
  language: string;
}

const props = defineProps<Props>();
const codeEditor = ref();
const resizeEditor = throttle(() => monacoEditor.editor?.layout());
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
  createEditor(codeEditor.value, props.language);
  updateEditorModel('', props.language);
  resizeObserver.observe(codeEditor.value.parentNode);
}

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

<style lang="postcss" scoped>
.code_editor {
  @apply
  w-full
  h-full
  bg-black/90
  border-b-2
  border-gray-700/60
  pt-1;
}
</style>