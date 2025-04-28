<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted } from 'vue';
import CodeEditorMenu from '@/components/CodeEditorMenu.vue';
import LanguageSelect from '@/components/LanguageSelect.vue';
import { CSS_LANGUAGE_MAP, HTML_LANGUAGE_MAP, JS_LANGUAGE_MAP } from '@/config/language';
import { SUFFIX_MAP } from '@/config/suffix';
import { useCodeContentStore } from '@/store';
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
  <div class="file-tabs">
    <div
      class="file-tabs-left"
      data-testid="editor model select"
    >
      <button
        v-if="currentModel === 'VUE'"
        :class="['btn-select', 'btn-select-active']"
      >
        <span class="small-screen">VUE</span>
        <span class="large-screen">App.vue</span>
      </button>

      <template v-else>
        <button
          :class="['btn-select', { 'btn-select-active': currentModel === 'HTML' }]"
          @click="updateModel('HTML')"
        >
          <span class="small-screen">HTML</span>
          <span class="large-screen">{{ `index.${SUFFIX_MAP[codeContent.HTML.language]}` }}</span>
        </button>
        <button
          :class="['btn-select', { 'btn-select-active': currentModel === 'CSS' }]"
          @click="updateModel('CSS')"
        >
          <span class="small-screen">CSS</span>
          <span class="large-screen">{{ `index.${SUFFIX_MAP[codeContent.CSS.language]}` }}</span>
        </button>
        <button
          :class="['btn-select', { 'btn-select-active': currentModel === 'JS' }]"
          @click="updateModel('JS')"
        >
          <span class="small-screen">JS</span>
          <span class="large-screen">{{ `index.${SUFFIX_MAP[codeContent.JS.language]}` }}</span>
        </button>
      </template>

      <button
        :class="['btn-select lg:hidden', { 'btn-select-active': isShowPreview }]"
        @click="isShowPreview = !isShowPreview"
      >
        Result
      </button>
    </div>

    <div class="file-tabs-right">
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

<style lang="css" scoped>
.file-tabs {
  height: 40px;
  width: 100%;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgb(54 65 83 / 0.6);
  background-color: #000000;
}

.file-tabs-left {
  display: flex;
  gap: 2px;
  align-items: center;
  height: 100%;
}

.file-tabs-right {
  display: flex;
  gap: 4px;
}

.large-screen {
  display: none;
}

@media (min-width: 1024px) {
  .small-screen {
    display: none;
  }

  .large-screen {
    display: flex;
  }
}
</style>
