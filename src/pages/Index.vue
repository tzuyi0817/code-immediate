<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store';
import CodeHeader from '@/components/CodeHeader.vue';
import CodeEditorAction from '@/components/CodeEditorAction.vue';
import CodeEditor from '@/components/CodeEditor.vue';
import CodePreview from '@/components/CodePreview.vue';
import CodeFooter from '@/components/CodeFooter.vue';
import type { CodeModel } from '@/types/codeContent';

const isShowPreview = ref(true);
const currentAction = ref<CodeModel>('HTML');
const iframe = ref();
const { isSFC } = storeToRefs(useCodeContentStore());
const wrapHeight = computed(() => {
  return isShowPreview.value ? 'h-[calc(40vh-40px)]' : 'h-[calc(100vh-128px)]';
});

provide('iframe', iframe);
</script>

<template>
  <code-header />
  <code-editor-action
    v-model:isShowPreview="isShowPreview"
    v-model:currentAction="currentAction"
  />
  <div :class="['code_wrap', wrapHeight]">
    <code-editor
      :class="{ hidden: currentAction !== 'HTML' || isSFC }"
      model="HTML"
    />
    <code-editor
      :class="{ hidden: currentAction !== 'CSS' || isSFC }"
      model="CSS"
    />
    <code-editor
      :class="{ hidden: currentAction !== 'JS' || isSFC }"
      model="JS"
    />
    <code-editor
      :class="{ hidden: !isSFC }"
      model="VUE"
    />
  </div>
  <code-preview v-show="isShowPreview" />
  <code-footer />
</template>

<style lang="postcss" scoped>

</style>