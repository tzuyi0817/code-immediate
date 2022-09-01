<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useMonacoEditor from '@/hooks/useMonacoEditor';

const codeEditor = ref();
const {
  monacoEditor,
  createEditor,
  updateEditorModel,
} = useMonacoEditor();

function initEditor() {
  createEditor(codeEditor.value);
  updateEditorModel('', 'html');
}

onMounted(initEditor);
</script>

<template>
  <div class="code_wrap">
    <div ref="codeEditor" class="w-full h-full"></div>
  </div>
</template>

<style lang="postcss" scoped>
.code_wrap {
  @apply
  h-[calc(40vh-40px)]
  w-full
  bg-gray-900
  pt-1;
}
</style>