<script setup lang="ts">
import { computed } from 'vue';
import { useCodeContentStore } from '@/store';
import { loadParseSource } from '@/utils/loadParse';
import type { CodeModel } from '@/types/codeContent';

interface Props {
  languageMap: Record<string, string>;
  model: CodeModel;
}

const props = defineProps<Props>();

const selected = computed(() => {
  const { codeContent } = useCodeContentStore();
  const { model } = props;
  return codeContent[model].language;
});

async function changeLanguage(event: Event) {
  const { setCodeLanguage } = useCodeContentStore();
  const { value } = event.target as HTMLSelectElement;
  const { model } = props;

  await loadParseSource(value, props.languageMap);
  setCodeLanguage({ type: model, language: value });
}
</script>

<template>
  <select
    class="select select_border"
    @change="changeLanguage"
    :value="selected"
  >
    <option
      v-for="(_, language) in languageMap"
      :value="language"
      :key="language"
    >{{ language }}</option>
  </select>
</template>
