<script setup lang="ts">
import { ref, computed } from 'vue';
import CodeHeader from '@/components/CodeHeader.vue';
import CodeEditorAction from '@/components/CodeEditorAction.vue';
import CodeEditor from '@/components/CodeEditor.vue';
import CodePreview from '@/components/CodePreview.vue';
import CodeFooter from '@/components/CodeFooter.vue';

const isShowPreview = ref(true);
const currentAction = ref('html');
const wrapHeight = computed(() => {
  return isShowPreview.value ? 'h-[calc(40vh-40px)]' : 'h-[calc(100vh-128px)]';
});
</script>

<template>
  <code-header />
  <code-editor-action
    v-model:isShowPreview="isShowPreview"
    v-model:currentAction="currentAction"
  />
  <div :class="['code_wrap', wrapHeight]">
    <code-editor
      :class="currentAction === 'html' ? 'block' : 'hidden'"
      language="html"
    />
    <code-editor
      :class="currentAction === 'css' ? 'block' : 'hidden'"
      language="css"
    />
    <code-editor
      :class="currentAction === 'javascript' ? 'block' : 'hidden'"
      language="javascript"
    />
  </div>
  <code-preview v-show="isShowPreview" />
  <code-footer />
</template>

<style lang="postcss" scoped>

</style>