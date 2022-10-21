<script setup lang="ts">
import { ref, reactive, computed, provide } from 'vue';
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
const isShowMenuMap = reactive({
  HTML: false,
  CSS: false,
  JS: false,
  VUE: false,
});
const { isSFC } = storeToRefs(useCodeContentStore());
const wrapHeight = computed(() => {
  return isShowPreview.value
    ? 'h-[calc(40vh-40px)]' + (isSFC.value ? ' lg:h-[calc(100vh-128px)]' : '')
    : 'h-[calc(100vh-128px)]';
});

provide('iframe', iframe);
provide('codeFormatMenu', { isShowMenuMap, toggleMenu });

function toggleMenu(model: CodeModel) {
  isShowMenuMap[model] = !isShowMenuMap[model];
}

function closeMenu(model: CodeModel) {
  isShowMenuMap[model] = false;
}
</script>

<template>
  <code-header />
  <code-editor-action
    v-model:isShowPreview="isShowPreview"
    v-model:currentAction="currentAction"
  />
  <div :class="{ 'lg:flex': isSFC }">
    <div :class="['code_wrap bg-black', { 'lg:w-1/3': isSFC }]">
      <div v-show="!isSFC" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div :class="{ 'code_wrap_hidden': currentAction !== 'HTML' }" @click="closeMenu('HTML')">
          <code-editor-tab :languageMap="HTML_LANGUAGE_MAP" model="HTML" />
          <code-editor :class="wrapHeight" model="HTML" />
        </div>
        <div :class="{ 'code_wrap_hidden': currentAction !== 'CSS' }" @click="closeMenu('CSS')">
          <code-editor-tab :languageMap="CSS_LANGUAGE_MAP" model="CSS" />
          <code-editor :class="wrapHeight" model="CSS" />
        </div>
        <div :class="{ 'code_wrap_hidden': currentAction !== 'JS' }" @click="closeMenu('JS')">
          <code-editor-tab :languageMap="JS_LANGUAGE_MAP" model="JS" />
          <code-editor :class="wrapHeight" model="JS" />
        </div>
      </div>

      <div v-show="isSFC" @click.self="closeMenu('VUE')">
        <code-editor-tab model="VUE" />
        <code-editor model="VUE" :class="wrapHeight" />
      </div>
    </div>

    <code-preview
      v-show="isShowPreview"
      :class="[
        'w-full', 
        'h-[calc(60vh-88px)]',
        { 'lg:w-2/3 lg:h-[calc(100vh-88px)]': isSFC },
      ]"
    />
  </div>
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