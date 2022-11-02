<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import useMonacoEditor from '@/hooks/useMonacoEditor';
import { useCodeContentStore, useFlagStore } from '@/store';
import type { CodeModel } from '@/types/codeContent';

interface Props {
  model: CodeModel;
}

const props = defineProps<Props>();
const codeEditor = ref();
const { codeContent, codeTemplate } = storeToRefs(useCodeContentStore());
const { isCreateProject, isCodeLoading } = storeToRefs(useFlagStore());
const language = computed(() => codeContent.value[props.model].language);
const content = computed(() => codeContent.value[props.model].content);
const isFormatter = computed(() => useFlagStore().formatterMap[props.model]);
const resizeObserver = new ResizeObserver(entries => {
  entries.forEach(({ contentRect: { height, width } }) => {
    if (height === 0 || width === 0) return;
    monacoEditor.editor?.layout();
  });
});

const {
  monacoEditor,
  createEditor,
  updateEditorModel,
  updateEditorValue,
} = useMonacoEditor();

function initEditor() {
  createEditor(codeEditor.value, props.model);
  updateEditorModel(content.value, language.value);
  resizeObserver.observe(codeEditor.value.parentNode);
}

watch([language, codeTemplate], ([language]) => {
  updateEditorModel(content.value, language);
});

watch(isFormatter, (isFormatter) => {
  if (!isFormatter) return;
  const { setLoading, setFormatter } = useFlagStore();
  updateEditorValue(content.value);
  setLoading({ isOpen: false, type: 'Code formatter finished' });
  setFormatter({ model: props.model, isFormatter: false });
});

watch([isCreateProject, isCodeLoading], ([isCreate, isLoading]) => {
  console.log({ isCreate, isLoading })
  if (!isCreate && isLoading) return;
  const { setCreateProjectFlag, setLoading } = useFlagStore();
  updateEditorModel(content.value, language.value);
  if (!isLoading) return;
  setLoading({ isOpen: false, type: 'Create new project finished' });
  setCreateProjectFlag(false);
});

onMounted(initEditor);
onBeforeUnmount(() => {
  resizeObserver.unobserve(codeEditor.value.parentNode);
});
</script>

<template>
  <div class="code_editor">
    <div ref="codeEditor" class="w-full h-full"></div>
    <div v-if="isCodeLoading" class="code_editor_loading">
      <font-awesome-icon
        icon="fa-solid fa-spinner" 
        class="animate-spin text-yellow-400 text-2xl"
      />
    </div>
  </div>
</template>

<style lang="postcss">
.code_editor {
  @apply
  relative
  w-full
  bg-[#1e1e1e]
  border-b-2
  border-gray-700/60
  pt-1;
  .iPadShowKeyboard {
    @apply hidden;
  }
  &_loading {
    @apply
    absolute
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