<script setup lang="ts">
import { ref } from 'vue';
import { useCodeContentStore, useFlagStore } from '@/store';
import { PRETTIER_MAP } from '@/config/prettier';
import type { CodeModel } from '@/types/codeContent';

interface Props {
  model: CodeModel;
}

const props = defineProps<Props>();
const isShowMenu = ref(false);

function toggleMenu() {
  isShowMenu.value = !isShowMenu.value;
}

function formatterCode() {
  const { codeContent, setCodeContent } = useCodeContentStore();
  const { setFormatter, setLoading } = useFlagStore();
  const { model } = props;
  const { content, language } = codeContent[model];
  const formatter = self.prettier?.format(content, {
    parser: PRETTIER_MAP[language as keyof typeof PRETTIER_MAP],
    plugins: self.prettierPlugins,
  });

  toggleMenu();
  setLoading({ isOpen: true, type: 'Code formatter' });
  setFormatter({ model, isFormatter: true });
  setCodeContent({ type: model, code: formatter });
}
</script>

<template>
  <div class="code_editor_format">
    <button class="btn btn_base h-[26px] w-8 rounded-sm" @click="toggleMenu">
      <font-awesome-icon icon="fa-solid fa-angle-down" class="text-base" />
    </button>

    <ul v-if="isShowMenu" class="code_editor_format_menu animate-popup">
      <li @click="formatterCode">Format Code</li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.code_editor_format {
  @apply relative;
  &_menu {
    @apply
    absolute
    top-10
    right-0
    bg-white
    rounded
    text-xs
    transition-all
    py-2
    z-[1];
    li {
      @apply
      px-3
      py-1
      select-none
      whitespace-nowrap
      hover:bg-gray-200
      hover:cursor-pointer;
    }
  }
}
</style>