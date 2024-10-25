<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCodeContentStore } from '@/store';
import { loadParseSource } from '@/utils/load-parse';
import { sleep } from '@/utils/common';
import type { CodeModel, Languages } from '@/types/code-content';

interface Props {
  languageMap: Record<string, string>;
  model: CodeModel;
}

const { languageMap, model } = defineProps<Props>();
const emit = defineEmits(['addCloseEvent']);
const isOpenSelect = ref(false);
const isShowOptions = ref(false);

emit('addCloseEvent', toggleDropdown);

const selected = computed(() => {
  const { codeContent } = useCodeContentStore();

  return codeContent[model].language;
});

async function toggleDropdown(isOpen = !isOpenSelect.value) {
  if (isOpen) {
    isOpenSelect.value = isOpen;

    requestAnimationFrame(() => {
      isShowOptions.value = isOpen;
    });
    return;
  }
  isShowOptions.value = isOpen;

  await sleep(150);
  isOpenSelect.value = isOpen;
}

async function changeLanguage(language: string) {
  const { setCodeLanguage } = useCodeContentStore();

  await loadParseSource(language, languageMap);
  setCodeLanguage({ type: model, language: language as Languages });
  toggleDropdown();
}
</script>

<template>
  <div class="language-select relative">
    <div
      class="select w-full h-full"
      :aria-expanded="isOpenSelect"
      role="combobox"
      aria-haspopup="listbox"
      aria-owns="language-select-listbox"
      tabindex="0"
      @click.stop="() => toggleDropdown()"
    >
      <span class="select-label">{{ selected }}</span>

      <font-awesome-icon
        :class="['select-icon', { open: isShowOptions }]"
        icon="fa-solid fa-caret-down"
        title="fa-caret-down"
      />
    </div>

    <ul
      v-if="isOpenSelect"
      id="language-select-listbox"
      :class="['select-options', { open: isShowOptions }]"
      role="listbox"
    >
      <li
        v-for="(_, language) in languageMap"
        :key="language"
        role="option"
        :aria-selected="selected === language"
        :class="{ selected: selected === language }"
        @click="changeLanguage(language)"
      >
        {{ language }}
      </li>
    </ul>
  </div>
</template>
