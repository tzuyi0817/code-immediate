<script setup lang="ts">
import LanguageSelect from '@/components/LanguageSelect.vue';
import type { CodeModel } from '@/types/codeContent';

interface Props {
  languageMap: Record<string, string>;
  model: CodeModel;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="code_editor_tab">

    <div class="code_editor_tab_right">
      <language-select :languageMap="languageMap" :model="model" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.code_editor_tab {
  @apply
  h-10
  px-1
  hidden
  items-center
  justify-between
  border-gray-700/60
  border-x-2
  lg:flex;
  &_right {
    @apply
    flex
    gap-1;
  }
}
</style>