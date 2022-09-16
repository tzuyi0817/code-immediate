<script setup lang="ts">
import { computed } from 'vue';
import { useCodeContentStore } from '@/store';
import {
  HTML_LANGUAGE_MAP,
  CSS_LANGUAGE_MAP,
  JS_LANGUAGE_MAP,
} from '@/config/language';

interface Props {
  isShowPreview: boolean;
  currentAction: string;
}

const props = defineProps<Props>();
const emit = defineEmits([
  'update:isShowPreview',
  'update:currentAction',
]);

const languageMap = computed(() => {
  const map = {
    html: HTML_LANGUAGE_MAP,
    css: CSS_LANGUAGE_MAP,
    javascript: JS_LANGUAGE_MAP,
  };
  return map[props.currentAction as keyof typeof map];
});

const selected = computed(() => {
  const { selectedLanguage } = useCodeContentStore();
  const { currentAction } = props;
  return selectedLanguage[currentAction as keyof typeof selectedLanguage];
});

function changeLanguage(event: Event) {
  const { setSelectedLanguage, selectedLanguage } = useCodeContentStore();
  const { currentAction } = props;
  const { value } = event.target as HTMLSelectElement;

  setSelectedLanguage({
    ...selectedLanguage,
    [currentAction]: value,
  });
}
</script>

<template>
<div class="code_editor_action">
  <div class="code_editor_action_left">
    <button 
      :class="['btn_select', { 'btn_select-active': currentAction === 'html' }]"
      @click="emit('update:currentAction', 'html')"
    >HTML</button>
    <button
      :class="['btn_select', { 'btn_select-active': currentAction === 'css' }]"
      @click="emit('update:currentAction', 'css')"
    >CSS</button>
    <button
      :class="['btn_select', { 'btn_select-active': currentAction === 'javascript' }]"
      @click="emit('update:currentAction', 'javascript')"
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
  bg-black/90;
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