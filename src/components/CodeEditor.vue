<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useMonacoEditor from '@/hooks/useMonacoEditor';

interface Props {
  language: string;
}

const props = defineProps<Props>();
const codeEditor = ref();
const {
  monacoEditor,
  createEditor,
  updateEditorModel,
} = useMonacoEditor();

function initEditor() {
  createEditor(codeEditor.value, props.language);
  updateEditorModel('', props.language);
}

onMounted(initEditor);
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