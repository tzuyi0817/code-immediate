<script setup lang="ts">
import { ref, computed, provide, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store';
import { getCode } from '@/apis/code';
import CodeHeader from '@/components/CodeHeader.vue';
import CodeEditorAction from '@/components/CodeEditorAction.vue';
import CodeDrag from '@/components/CodeDrag.vue';
import CodeEditor from '@/components/CodeEditor.vue';
import CodePreview from '@/components/CodePreview.vue';
import CodeFooter from '@/components/CodeFooter.vue';
import { isString } from '@/utils/check-type';
import type { CodeModel } from '@/types/code-content';

const isShowPreview = ref(true);
const iframeRef = ref<HTMLIFrameElement | null>(null);
const { isSFC, codeId, currentModel, previewWidth, offsetCodeWrap } = storeToRefs(useCodeContentStore());
const router = useRouter();
const route = useRoute();
let previousModel: CodeModel = 'HTML';

if (isSFC.value) currentModel.value = 'VUE';

const wrapHeight = computed(() => {
  return isShowPreview.value ? 'h-[40vh]' : 'h-[calc(100vh-88px)]';
});

provide('iframeRef', iframeRef);

selectProject();

function closeInitLoading() {
  const loadingBox = document.querySelector('#init-loading');

  if (!loadingBox || !(loadingBox instanceof HTMLElement)) return;
  loadingBox.style.display = 'none';
}

function selectProject() {
  const { id } = route.params;

  if (!id || !isString(id) || id === codeId.value) return;

  const { setCodeId } = useCodeContentStore();

  getCode(id);
  setCodeId(id);
}

function setCurrentModel(isVueSfc: boolean) {
  if (!isVueSfc) {
    currentModel.value = previousModel;
    return;
  }
  if (currentModel.value === 'VUE') return;
  previousModel = currentModel.value;
  currentModel.value = 'VUE';
}

watch(codeId, id => router.push({ params: { id } }), { immediate: true });
watch(isSFC, setCurrentModel);

onMounted(closeInitLoading);
</script>

<template>
  <code-header />

  <div class="lg:flex">
    <div :class="['code_wrap bg-black', `${wrapHeight} lg:h-[calc(100vh-88px)]`]">
      <code-editor-action
        v-model:is-show-preview="isShowPreview"
        v-model:current-model="currentModel"
      />

      <div
        v-show="!isSFC"
        class="code_wrap_editor flex"
      >
        <div :class="['code_wrap_code', { hidden: currentModel !== 'HTML' }]">
          <code-editor model="HTML" />
        </div>

        <div :class="['code_wrap_code', { hidden: currentModel !== 'CSS' }]">
          <code-editor model="CSS" />
        </div>

        <div :class="['code_wrap_code', { hidden: currentModel !== 'JS' }]">
          <code-editor model="JS" />
        </div>
      </div>

      <div
        v-show="isSFC"
        class="code_wrap_editor flex"
      >
        <div class="code_wrap_code">
          <code-editor model="VUE" />
        </div>
      </div>
    </div>

    <code-drag
      v-model:drag-a="offsetCodeWrap"
      v-model:drag-b="previewWidth"
      class="code_wrap_hidden h-[calc(100vh-88px)]"
      direction="x"
      unit="vw"
      :limit="{ min: 20, max: 80 }"
    />

    <code-preview
      v-show="isShowPreview"
      class="w-full h-[calc(60vh-88px)] lg:h-[calc(100vh-88px)] preview_width"
    />
  </div>
  <code-footer :preview-width="previewWidth" />
</template>

<style lang="postcss" scoped>
.code_wrap {
  &_hidden {
    @apply hidden lg:block;
  }
  &_code {
    @apply w-full flex-1;
    @media (min-width: 1024px) {
      width: calc(v-bind(offsetCodeWrap));
    }
  }
  &_editor {
    @apply h-[calc(100%-40px)];
  }
}

.preview_width {
  @media (min-width: 1024px) {
    width: calc(v-bind(previewWidth) - 18px);
  }
}
</style>
