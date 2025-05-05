<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from '@/components/common';
import { PRETTIER_MAP } from '@/config/prettier';
import { SUFFIX_MAP } from '@/config/suffix';
import { useCodeContentStore, useFlagStore } from '@/store';
import { sleep } from '@/utils/common';
import { exportZip } from '@/utils/export-zip';
import { readFile } from '@/utils/read-file';
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
    const code = await readFile(event)?.catch(() => {
      showToast({ message: 'Embed file failed', type: 'error' });
    });

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
  <div class="editor-menu">
    <button
      class="btn btn-base h-[26px] w-8 rounded-sm"
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
      class="editor-menu-content animate-popup"
    >
      <li @click="formatterCode">Format Code</li>
      <li @click="exportCode">Export Zip</li>
      <li @click="embedFile">Embed Local File</li>
    </ul>
  </div>
</template>

<style lang="css" scoped>
.editor-menu {
  position: relative;
}

.editor-menu-content {
  position: absolute;
  top: 10px;
  right: 0;
  background-color: #ffffff;
  border-radius: 4px;
  font-size: 12px;
  line-height: calc(1 / 0.75);
  padding: 8px 0;
  z-index: 15;

  li {
    padding: 4px 12px;
    user-select: none;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  li:hover {
    background-color: #e5e7eb;
  }
}
</style>
