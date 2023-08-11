<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store';
import {
  HTML_LANGUAGE_MAP,
  CSS_LANGUAGE_MAP,
  JS_LANGUAGE_MAP,
} from '@/config/language';
import LanguageSelect from '@/components/LanguageSelect.vue';
import CodeEditorMenu from '@/components/CodeEditorMenu.vue';
import type { CodeModel } from '@/types/codeContent';

interface Props {
  isShowPreview: boolean;
  currentAction: Exclude<CodeModel, 'VUE'>;
}

const props = defineProps<Props>();
const emit = defineEmits([
  'update:isShowPreview',
  'update:currentAction',
]);

const { isSFC } = storeToRefs(useCodeContentStore());
const languageMap = computed(() => {
  const map = {
    HTML: HTML_LANGUAGE_MAP,
    CSS: CSS_LANGUAGE_MAP,
    JS: JS_LANGUAGE_MAP,
  } as const;
  return map[props.currentAction];
});
</script>

<template>
<div class="code_editor_action">
  <div class="code_editor_action_left">
    <button
      v-if="isSFC"
      :class="['btn_select', 'btn_select-active']"
    >VUE</button>

    <template v-else>
      <button 
        :class="['btn_select', { 'btn_select-active': currentAction === 'HTML' }]"
        @click="emit('update:currentAction', 'HTML')"
      >HTML</button>
      <button
        :class="['btn_select', { 'btn_select-active': currentAction === 'CSS' }]"
        @click="emit('update:currentAction', 'CSS')"
      >CSS</button>
      <button
        :class="['btn_select', { 'btn_select-active': currentAction === 'JS' }]"
        @click="emit('update:currentAction', 'JS')"
      >JS</button>
    </template>

    <button
      :class="['btn_select', { 'btn_select-active': isShowPreview }]"
      @click="emit('update:isShowPreview', !isShowPreview)"
    >Result</button>
  </div>

  <div class="code_editor_action_right">
    <language-select v-if="!isSFC" :languageMap="languageMap" :model="currentAction" />
    <code-editor-menu :model="currentAction" />
  </div>
</div>
</template>

<style lang="postcss" scoped>
.code_editor_action {
  @apply 
  h-10
  w-full
  px-1
  flex
  items-center
  justify-between
  border-b-2
  border-gray-700/60
  bg-black
  lg:hidden;
  &_left {
    @apply
    flex
    gap-[2px]
    items-center
    h-full;
  }
  &_right {
    @apply
    flex
    gap-1;
  }
}
</style>