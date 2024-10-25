<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import LanguageSelect from '@/components/LanguageSelect.vue';
import CodeEditorMenu from '@/components/CodeEditorMenu.vue';
import { useCodeContentStore } from '@/store';
import { HTML_LANGUAGE_MAP, CSS_LANGUAGE_MAP, JS_LANGUAGE_MAP } from '@/config/language';
import { SUFFIX_MAP } from '@/config/suffix';
import type { CodeModel } from '@/types/code-content';

const isShowPreview = defineModel<boolean>('isShowPreview', { required: true });
const currentModel = defineModel<CodeModel>('currentModel', { required: true });
const { codeContent } = storeToRefs(useCodeContentStore());
const closeEvents: Set<(isClose: boolean) => void> = new Set();

const languageMap = computed(() => {
  const map = {
    HTML: HTML_LANGUAGE_MAP,
    CSS: CSS_LANGUAGE_MAP,
    JS: JS_LANGUAGE_MAP,
    VUE: {},
  } as const;
  return map[currentModel.value];
});

function updateModel(action: CodeModel) {
  currentModel.value = action;
}

function addCloseEvent(event: (isClose: boolean) => void) {
  closeEvents.add(event);
}

function implementCloseEvent() {
  closeEvents.forEach(event => event(false));
}

function onBlur() {
  if (document.activeElement?.tagName !== 'IFRAME') return;
  implementCloseEvent();
}

function onWindow() {
  window.addEventListener('click', implementCloseEvent);
  window.addEventListener('blur', onBlur);
}

function unWindow() {
  window.removeEventListener('click', implementCloseEvent);
  window.removeEventListener('blur', onBlur);
  closeEvents.clear();
}

onMounted(onWindow);
onBeforeUnmount(unWindow);
</script>

<template>
  <div class="code_editor_action">
    <div
      class="code_editor_action_left"
      data-testid="editor model select"
    >
      <button
        v-if="currentModel === 'VUE'"
        :class="['btn_select', 'btn_select-active']"
      >
        <span class="small-screen">VUE</span>
        <span class="large-screen">App.vue</span>
      </button>

      <template v-else>
        <button
          :class="['btn_select', { 'btn_select-active': currentModel === 'HTML' }]"
          @click="updateModel('HTML')"
        >
          <span class="small-screen">HTML</span>
          <span class="large-screen">{{ `index.${SUFFIX_MAP[codeContent.HTML.language]}` }}</span>
        </button>
        <button
          :class="['btn_select', { 'btn_select-active': currentModel === 'CSS' }]"
          @click="updateModel('CSS')"
        >
          <span class="small-screen">CSS</span>
          <span class="large-screen">{{ `index.${SUFFIX_MAP[codeContent.CSS.language]}` }}</span>
        </button>
        <button
          :class="['btn_select', { 'btn_select-active': currentModel === 'JS' }]"
          @click="updateModel('JS')"
        >
          <span class="small-screen">JS</span>
          <span class="large-screen">{{ `index.${SUFFIX_MAP[codeContent.JS.language]}` }}</span>
        </button>
      </template>

      <button
        :class="['btn_select lg:hidden', { 'btn_select-active': isShowPreview }]"
        @click="isShowPreview = !isShowPreview"
      >
        Result
      </button>
    </div>

    <div class="code_editor_action_right">
      <language-select
        v-if="currentModel !== 'VUE'"
        :language-map="languageMap"
        :model="currentModel"
        @add-close-event="addCloseEvent"
      />
      <code-editor-menu
        :model="currentModel"
        @add-close-event="addCloseEvent"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.code_editor_action {
  @apply h-10
  w-full
  px-1
  flex
  items-center
  justify-between
  border-b-2
  border-gray-700/60
  bg-black;
  &_left {
    @apply flex
    gap-[2px]
    items-center
    h-full;
  }
  &_right {
    @apply flex
    gap-1;
  }
  .small-screen {
    @apply lg:hidden;
  }
  .large-screen {
    @apply hidden lg:flex;
  }
}
</style>
