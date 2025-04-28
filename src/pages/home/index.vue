<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCode } from '@/apis/code';
import CodeEditorAction from '@/components/CodeEditorAction.vue';
import CodeFooter from '@/components/CodeFooter.vue';
import CodeHeader from '@/components/CodeHeader.vue';
import CodePreview from '@/components/CodePreview.vue';
import { Drag } from '@/components/Drag';
import { Editor } from '@/components/Editor';
import { useCodeContentStore } from '@/store';
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
    <div :class="['code-wrap bg-black', `${wrapHeight} lg:h-[calc(100vh-88px)]`]">
      <code-editor-action
        v-model:is-show-preview="isShowPreview"
        v-model:current-model="currentModel"
      />

      <div
        v-show="!isSFC"
        class="code-wrap-editor flex"
      >
        <div :class="['code-wrap-code', { hidden: currentModel !== 'HTML' }]">
          <editor model="HTML" />
        </div>

        <div :class="['code-wrap-code', { hidden: currentModel !== 'CSS' }]">
          <editor model="CSS" />
        </div>

        <div :class="['code-wrap-code', { hidden: currentModel !== 'JS' }]">
          <editor model="JS" />
        </div>
      </div>

      <div
        v-show="isSFC"
        class="code-wrap-editor flex"
      >
        <div class="code-wrap-code">
          <editor model="VUE" />
        </div>
      </div>
    </div>

    <drag
      v-model:drag-a="offsetCodeWrap"
      v-model:drag-b="previewWidth"
      class="code-wrap-hidden h-[calc(100vh-88px)]"
      direction="x"
      unit="vw"
      :limit="{ min: 20, max: 80 }"
    />

    <code-preview
      v-show="isShowPreview"
      class="w-full h-[calc(60vh-88px)] lg:h-[calc(100vh-88px)] preview-width"
    />
  </div>
  <code-footer :preview-width="previewWidth" />
</template>

<style lang="css" scoped>
.code-wrap-hidden {
  display: none;
}

.code-wrap-code {
  width: 100%;
  flex: 1 1 0%;
}

.code-wrap-editor {
  height: calc(100% - 40px);
}

@media (min-width: 1024px) {
  .code-wrap-hidden {
    display: block;
  }

  .code-wrap-code {
    width: calc(v-bind(offsetCodeWrap));
  }

  .preview-width {
    width: calc(v-bind(previewWidth) - 18px);
  }
}
</style>
