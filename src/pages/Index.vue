<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store';
import CodeHeader from '@/components/CodeHeader.vue';
import CodeEditorAction from '@/components/CodeEditorAction.vue';
import CodeEditorTab from '@/components/CodeEditorTab.vue';
import CodeEditor from '@/components/CodeEditor.vue';
import CodePreview from '@/components/CodePreview.vue';
import CodeFooter from '@/components/CodeFooter.vue';
import {
  HTML_LANGUAGE_MAP,
  CSS_LANGUAGE_MAP,
  JS_LANGUAGE_MAP,
} from '@/config/language';
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
  <div class="code_wrap bg-black">
    <div v-show="!isSFC" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div :class="{ 'code_wrap_hidden': currentAction !== 'HTML' }">
        <code-editor-tab :languageMap="HTML_LANGUAGE_MAP" model="HTML" />
        <code-editor :class="wrapHeight" model="HTML" />
      </div>

      <code-editor
        :class="[{ 'code_wrap_hidden': currentAction !== 'CSS' }, wrapHeight]"
        model="CSS"
      />
      <code-editor
        :class="[{ 'code_wrap_hidden': currentAction !== 'JS' }, wrapHeight]"
        model="JS"
      />
    </div>

    <code-editor v-show="isSFC" model="VUE" :class="wrapHeight" />
  </div>
  <code-preview v-show="isShowPreview" />
  <code-footer />
</template>

<style lang="postcss" scoped>
.code_wrap {
  &_hidden {
    @apply
    hidden
    lg:block;
  }
}
</style>