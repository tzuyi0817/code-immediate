<script setup lang="ts">
import { computed } from 'vue';
import { useCodeContentStore, useFlagStore } from '@/store';
import { loadParse } from '@/utils/loadParse';
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
  const { setLoading } = useFlagStore();
  const { model, languageMap } = props;
  const { value } = event.target as HTMLSelectElement;
  type CodeLanguage = keyof typeof languageMap;
  const source = languageMap[value as CodeLanguage];

  setLoading(true);
  source && await loadParse(source).catch(error => { throw new Error(error) });
  setCodeLanguage({
    type: model,
    language: value,
  });
  setLoading(false);
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
