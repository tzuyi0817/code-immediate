<script setup lang="ts">
import { computed } from 'vue';
import { HTML_LANGUAGE_MAP, CSS_LANGUAGE_MAP, JS_LANGUAGE_MAP } from '@/config/language';
import LanguageSelect from '@/components/LanguageSelect.vue';
import CodeEditorMenu from '@/components/CodeEditorMenu.vue';
import type { CodeModel } from '@/types/codeContent';

const isShowPreview = defineModel<boolean>('isShowPreview', { required: true });
const currentAction = defineModel<CodeModel>('currentAction', { required: true });
const languageMap = computed(() => {
  const map = {
    HTML: HTML_LANGUAGE_MAP,
    CSS: CSS_LANGUAGE_MAP,
    JS: JS_LANGUAGE_MAP,
    VUE: {},
  } as const;
  return map[currentAction.value];
});

function updateAction(action: CodeModel) {
  currentAction.value = action;
}
</script>

<template>
  <div class="code_editor_action">
    <div class="code_editor_action_left">
      <button
        v-if="currentAction === 'VUE'"
        :class="['btn_select', 'btn_select-active']"
      >
        VUE
      </button>

      <template v-else>
        <button
          :class="['btn_select', { 'btn_select-active': currentAction === 'HTML' }]"
          @click="updateAction('HTML')"
        >
          HTML
        </button>
        <button
          :class="['btn_select', { 'btn_select-active': currentAction === 'CSS' }]"
          @click="updateAction('CSS')"
        >
          CSS
        </button>
        <button
          :class="['btn_select', { 'btn_select-active': currentAction === 'JS' }]"
          @click="updateAction('JS')"
        >
          JS
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
        v-if="currentAction !== 'VUE'"
        :languageMap="languageMap"
        :model="currentAction"
      />
      <code-editor-menu :model="currentAction" />
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
}
</style>
