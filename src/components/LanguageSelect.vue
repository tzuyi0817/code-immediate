<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCodeContentStore } from '@/store';
import { loadParseSource } from '@/utils/loadParse';
import { sleep } from '@/utils/common';
import type { CodeModel, Languages } from '@/types/codeContent';

interface Props {
  languageMap: Record<string, string>;
  model: CodeModel;
}

const props = defineProps<Props>();
const isOpen = ref(false);
const isShowOptions = ref(false);

const selected = computed(() => {
  const { codeContent } = useCodeContentStore();
  const { model } = props;

  return codeContent[model].language;
});

async function toggleDropdown() {
  const status = !isOpen.value;

  if (status) {
    isOpen.value = status;

    requestAnimationFrame(() => {
      isShowOptions.value = status;
    });
    return;
  }
  isShowOptions.value = status;

  await sleep(150);
  isOpen.value = status;
}

async function changeLanguage(language: string) {
  const { setCodeLanguage } = useCodeContentStore();
  const { model } = props;

  await loadParseSource(language, props.languageMap);
  setCodeLanguage({ type: model, language: language as Languages });
  toggleDropdown();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false;
  }
}
</script>

<template>
  <div class="language-select relative">
    <div
      class="select w-full h-full"
      @click.stop="toggleDropdown"
      @keydown="handleKeydown"
      :aria-expanded="isOpen"
      role="combobox"
      aria-haspopup="listbox"
      aria-owns="language-select-listbox"
      tabindex="0"
    >
      <span class="select-label">{{ selected }}</span>

      <font-awesome-icon
        :class="['select-icon', { open: isShowOptions }]"
        icon="fa-solid fa-caret-down"
        title="fa-caret-down"
      />
    </div>

    <ul
      v-if="isOpen"
      :class="['select-options', { open: isShowOptions }]"
      id="language-select-listbox"
      role="listbox"
      @keydown="handleKeydown"
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
