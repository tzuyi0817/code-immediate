<script setup lang="ts">
import { computed } from 'vue';
import { useCodeContentStore, useFlagStore } from '@/store';
import { loadParse } from '@/utils/loadParse';
import {
  HTML_LANGUAGE_MAP,
  CSS_LANGUAGE_MAP,
  JS_LANGUAGE_MAP,
} from '@/config/language';
import type { CodeModel } from '@/types/codeContent';

interface Props {
  isShowPreview: boolean;
  currentAction: CodeModel;
}

const props = defineProps<Props>();
const emit = defineEmits([
  'update:isShowPreview',
  'update:currentAction',
]);

const languageMap = computed(() => {
  const map = {
    HTML: HTML_LANGUAGE_MAP,
    CSS: CSS_LANGUAGE_MAP,
    JS: JS_LANGUAGE_MAP,
  };
  return map[props.currentAction as keyof typeof map];
});

const selected = computed(() => {
  const { codeContent } = useCodeContentStore();
  const { currentAction } = props;
  return codeContent[currentAction].language;
});

async function changeLanguage(event: Event) {
  const { setCodeLanguage } = useCodeContentStore();
  const { setLoading } = useFlagStore();
  const { currentAction } = props;
  const { value } = event.target as HTMLSelectElement;
  type CodeLanguage = keyof typeof languageMap.value;
  const source = languageMap.value[value as CodeLanguage];

  setLoading(true);
  source && await loadParse(source).catch(error => { throw new Error(error) });
  setCodeLanguage({
    type: currentAction,
    language: value,
  });
  setLoading(false);
}
</script>

<template>
<div class="code_editor_action">
  <div class="code_editor_action_left">
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
    <button
      :class="['btn_select', { 'btn_select-active': isShowPreview }]"
      @click="emit('update:isShowPreview', !isShowPreview)"
    >Result</button>
  </div>

  <div class="code_editor_action_right">
    <select class="select select_border" @change="changeLanguage" :value="selected">
      <option
        v-for="(_, language) in languageMap"
        :value="language"
        :key="language"
      >{{ language }}</option>
    </select>

    <button class="btn btn_base h-[26px] w-8 rounded-sm">
      <font-awesome-icon icon="fa-solid fa-angle-down" class="text-base" />
    </button>
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
  bg-black;
  &_left {
    @apply
    flex
    gap-[2px]
    items-center
    h-full
  }
  &_right {
    @apply
    flex
    gap-1
  }
}
</style>