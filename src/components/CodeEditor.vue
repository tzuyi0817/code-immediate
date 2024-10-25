<script setup lang="ts">
import { computed, watch, useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useMonacoEditor } from '@/hooks/use-monaco-editor';
import { useCodeContentStore, useFlagStore } from '@/store';
import { sleep } from '@/utils/common';
import type { CodeModel } from '@/types/code-content';

interface Props {
  model: CodeModel;
}

const { model } = defineProps<Props>();
const codeEditorRef = useTemplateRef<HTMLDivElement>('codeEditor');
const { codeContent, codeTemplate } = storeToRefs(useCodeContentStore());
const { isCreateProject, isCodeLoading } = storeToRefs(useFlagStore());
const language = computed(() => codeContent.value[model].language);
const content = computed(() => codeContent.value[model].content);
const isFormatter = computed(() => useFlagStore().formatterMap[model]);
const isEmbed = computed(() => useFlagStore().EmbedMap[model]);
const resizeObserver = new ResizeObserver(entries => {
  entries.forEach(({ contentRect: { height, width } }) => {
    if (height === 0 || width === 0) return;
    monacoEditor.editor?.layout();
  });
});

const { monacoEditor, createEditor, updateEditorModel, updateEditorValue } = useMonacoEditor();

function initEditor() {
  if (!codeEditorRef.value) return;

  createEditor(codeEditorRef.value, model);
  updateEditorModel(content.value, language.value);

  const parentNode = codeEditorRef.value.parentNode as HTMLElement;

  if (!parentNode) return;

  resizeObserver.observe(parentNode);
}

watch([language, codeTemplate], ([lang]) => {
  updateEditorModel(content.value, lang);
});

watch(isFormatter, isFormat => {
  if (!isFormat) return;
  const { setLoading, setFormatter } = useFlagStore();
  updateEditorValue(content.value);
  setLoading({ isOpen: false, type: 'Code formatter finished' });
  setFormatter({ model, isFormatter: false });
});

watch([isCreateProject, isCodeLoading], async ([isCreate, isLoading]) => {
  if (!isCreate && isLoading) return;
  const { setCreateProjectFlag, setLoading } = useFlagStore();
  updateEditorModel(content.value, language.value);
  if (!isCreate) return;
  await sleep(0);
  setLoading({ isOpen: false, type: 'Create new project finished' });
  setCreateProjectFlag(false);
});

watch(isEmbed, async isEmb => {
  if (!isEmb) return;
  const { setEmbedFlag } = useFlagStore();
  updateEditorValue(content.value);
  setEmbedFlag({ model, isEmbed: false });
});

onMounted(initEditor);
onBeforeUnmount(() => {
  const parentNode = codeEditorRef.value?.parentNode as HTMLElement;

  if (!parentNode) return;

  resizeObserver.unobserve(parentNode);
});
</script>

<template>
  <div class="code_editor">
    <div
      ref="codeEditor"
      class="w-full h-full"
      aria-label="code-editor"
    ></div>
    <div
      v-if="isCodeLoading"
      class="code_editor_loading"
    >
      <font-awesome-icon
        icon="fa-solid fa-spinner"
        class="animate-spin text-yellow-400 text-2xl"
      />
    </div>
  </div>
</template>

<style lang="postcss">
.code_editor {
  @apply relative
  w-full
  h-full
  bg-[#1e1e1e]
  border-b-2
  border-gray-700/60
  pt-1;
  .iPadShowKeyboard {
    @apply hidden;
  }
  &_loading {
    @apply absolute
    top-0
    left-0
    w-full
    h-full
    flex
    justify-center
    items-center
    bg-[#1e1e1e]/50;
  }
}
</style>
