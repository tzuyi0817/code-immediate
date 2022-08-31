<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

const codeEditor = ref();

function createEditor() {
  const monacoEditor = editor.create(codeEditor.value, {
    // model: null,
    minimap: {
      enabled: false,
    },
    wordWrap: 'on',
    theme: 'vs-dark',
    // fontSize: 16,
    fontFamily: 'MonoLisa, monospace',
    contextmenu: false,
    fixedOverflowWidgets: true,
	  language: 'javascript',
  });

  monacoEditor.onDidChangeModelContent(() => {
    console.log('onDidChangeModelContent');
  });

  monacoEditor.onDidBlurEditorText(() => {
    console.log('onDidBlurEditorText');
  });
}

onMounted(createEditor);
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
  px-2
  pt-1;
}
</style>