<script setup lang="ts">
import { ref } from 'vue';
import { useCodeContentStore, useFlagStore } from '@/store';
import { PRETTIER_MAP } from '@/config/prettier';
import { SUFFIX_MAP } from '@/config/suffix';
import { sleep } from '@/utils/common';
import { exportZip } from '@/utils/export-zip';
import { readFile } from '@/utils/read-file';
import { toast } from '@/utils/toast';
import type { CodeModel } from '@/types/code-content';

interface Props {
  model: CodeModel;
}

const { model } = defineProps<Props>();
const emit = defineEmits(['addCloseEvent']);
const isShowMenu = ref(false);

emit('addCloseEvent', toggleMenu);

async function formatterCode() {
  const { codeContent, setCodeContent } = useCodeContentStore();
  const { setFormatter, setLoading } = useFlagStore();
  const { content, language } = codeContent[model] ?? {};
  const parser = PRETTIER_MAP[language];

  setLoading({ isOpen: true, type: 'Code formatter' });
  toggleMenu();
  if (!parser) {
    await sleep();
    return setLoading({ isOpen: false, type: "This syntax isn't supported error" });
  }

  try {
    const formatter = self.prettier.format(content, {
      parser,
      plugins: self.prettierPlugins,
    });

    setFormatter({ model, isFormatter: true });
    setCodeContent({ type: model, code: formatter });
  } catch {
    await sleep();
    setLoading({ isOpen: false, type: 'Code formatter error' });
  }
}

async function exportCode() {
  const { codeContent, codeTitle } = useCodeContentStore();
  const { setLoading } = useFlagStore();
  const { content, language } = codeContent[model];

  toggleMenu();
  setLoading({ isOpen: true, type: 'Exporting zip' });
  await exportZip({ content, language }, codeTitle);
  setLoading({ isOpen: false, type: 'Export zip finished' });
}

function embedFile() {
  const { codeContent, setCodeContent } = useCodeContentStore();
  const { setEmbedFlag } = useFlagStore();
  const { language } = codeContent[model];
  let element: HTMLInputElement | null = document.createElement('input');

  const onChangeFile = async (event: Event) => {
    const code = await readFile(event)?.catch(() => toast.showToast('Embed file failed', 'error'));

    if (code) {
      setCodeContent({ type: model, code });
      setEmbedFlag({ model, isEmbed: true });
    }
    if (!element) return;
    element.removeEventListener('change', onChangeFile);
    element = null;
  };

  element.type = 'file';
  element.accept = `.${SUFFIX_MAP[language]}`;
  element.addEventListener('change', onChangeFile);
  element.click();
  toggleMenu();
}

function toggleMenu(isShow = !isShowMenu.value) {
  isShowMenu.value = isShow;
}
</script>

<template>
  <div class="code_editor_menu">
    <button
      class="btn btn_base h-[26px] w-8 rounded-sm"
      @click.stop="() => toggleMenu()"
    >
      <font-awesome-icon
        icon="fa-solid fa-angle-down"
        title="fa-angle-down"
        class="text-base"
      />
    </button>

    <ul
      v-if="isShowMenu"
      class="code_editor_menu_content animate-popup"
    >
      <li @click="formatterCode">Format Code</li>
      <li @click="exportCode">Export Zip</li>
      <li @click="embedFile">Embed Local File</li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.code_editor_menu {
  @apply relative;
  &_content {
    @apply absolute
    top-10
    right-0
    bg-white
    rounded
    text-xs
    transition-all
    py-2
    z-[15];
    li {
      @apply px-3
      py-1
      select-none
      whitespace-nowrap
      hover:bg-gray-200
      hover:cursor-pointer;
    }
  }
}
</style>
