<script setup lang="ts">
import { inject } from 'vue';
import { useCodeContentStore, useFlagStore } from '@/store';
import { PRETTIER_MAP } from '@/config/prettier';
import { SUFFIX_MAP } from '@/config/suffix';
import { sleep } from '@/utils/common';
import exportZip from '@/utils/exportZip';
import readFile from '@/utils/readFile';
import toast from '@/utils/toast';
import type { CodeModel } from '@/types/codeContent';

interface Props {
  model: CodeModel;
}

interface InjectCodeMenu {
  isShowMenuMap: Record<CodeModel, boolean>;
  toggleMenu: (model: CodeModel) => void;
}

const props = defineProps<Props>();
const injectCodeMenu = inject<InjectCodeMenu>('codeMenu');

async function formatterCode() {
  const { codeContent, setCodeContent } = useCodeContentStore();
  const { setFormatter, setLoading } = useFlagStore();
  const { model } = props;
  const { content, language } = codeContent[model] ?? {};
  const parser = PRETTIER_MAP[language];

  setLoading({ isOpen: true, type: 'Code formatter' });
  injectCodeMenu?.toggleMenu(model);
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
  const { model } = props;
  const { content, language } = codeContent[model];

  injectCodeMenu?.toggleMenu(model);
  setLoading({ isOpen: true, type: 'Exporting zip' });
  await exportZip({ content, language }, codeTitle);
  setLoading({ isOpen: false, type: 'Export zip finished' });
}

function EmbedFile() {
  const { codeContent, setCodeContent } = useCodeContentStore();
  const { setEmbedFlag } = useFlagStore();
  const { model } = props;
  const { language } = codeContent[model];
  let element: HTMLInputElement | null = document.createElement('input');

  injectCodeMenu?.toggleMenu(model);
  element.type = 'file';
  element.accept = `.${SUFFIX_MAP[language]}`;
  element.click();
  element.addEventListener('change', async event => {
    const code = await readFile(event).catch(() => toast.showToast('Embed file failed', 'error'));

    if (code) {
      setCodeContent({ type: model, code });
      setEmbedFlag({ model, isEmbed: true });
    }
    element = null;
  });
}
</script>

<template>
  <div class="code_editor_menu">
    <button
      class="btn btn_base h-[26px] w-8 rounded-sm"
      @click.stop="injectCodeMenu?.toggleMenu(model)"
    >
      <font-awesome-icon
        icon="fa-solid fa-angle-down"
        title="fa-angle-down"
        class="text-base"
      />
    </button>

    <ul
      v-if="injectCodeMenu?.isShowMenuMap[model]"
      class="code_editor_menu_content animate-popup"
    >
      <li @click="formatterCode">Format Code</li>
      <li @click="exportCode">Export Zip</li>
      <li @click="EmbedFile">Embed Local File</li>
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
