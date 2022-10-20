<script setup lang="ts">
import { computed } from 'vue';
import LanguageSelect from '@/components/LanguageSelect.vue';
import CodeEditorFormat from '@/components/CodeEditorFormat.vue';
import type { CodeModel } from '@/types/codeContent';

interface Props {
  languageMap?: Record<string, string>;
  model: CodeModel;
}

const props = withDefaults(defineProps<Props>(), {
  languageMap: () => ({}),
});

const icon = computed(() => {
  const iconMap = {
    HTML: { name: 'html.png', width: 25 },
    CSS: { name: 'css.png', width: 25 },
    JS: { name: 'js.png', width: 25 },
    VUE: { name: 'vue.svg', width: 20 },
  };
  return iconMap[props.model];
});
</script>

<template>
  <div class="code_editor_tab">
    <div class="code_editor_tab_left">
      <img :src="`templateIcon/${icon.name}`" alt="" :width="icon.width" />
      {{ model }}
    </div>

    <div class="code_editor_tab_right">
      <language-select
        v-if="model !== 'VUE'"
        :languageMap="languageMap"
        :model="model"
      />
      <code-editor-format :model="model" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.code_editor_tab {
  @apply
  h-10
  pr-1
  hidden
  items-center
  justify-between
  border-gray-700/60
  border-x-2
  lg:flex;
  &_left {
    @apply
    bg-[#1e1e1e]
    text-gray-400
    font-bold
    px-3
    py-2
    border-t-2
    border-t-gray-500/60
    rounded-t
    flex
    gap-1
  }
  &_right {
    @apply
    flex
    gap-1;
  }
}
</style>