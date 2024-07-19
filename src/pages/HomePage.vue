<script setup lang="ts">
import { ref, reactive, computed, provide, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCodeContentStore, useFlagStore } from '@/store';
import { getCode } from '@/apis/code';
import CodeHeader from '@/components/CodeHeader.vue';
import CodeEditorAction from '@/components/CodeEditorAction.vue';
import CodeDrag from '@/components/CodeDrag.vue';
import CodeEditor from '@/components/CodeEditor.vue';
import CodePreview from '@/components/CodePreview.vue';
import CodeFooter from '@/components/CodeFooter.vue';
import { isString } from '@/utils/checkType';
import type { CodeModel } from '@/types/codeContent';

const isShowPreview = ref(true);
const currentAction = ref<CodeModel>('HTML');
const iframe = ref(null);
const previewWidth = ref('55vw');
const offsetCodeWrap = ref('45vw');
const isShowMenuMap = reactive({ HTML: false, CSS: false, JS: false, VUE: false });
const { isSFC, codeId } = storeToRefs(useCodeContentStore());
const router = useRouter();
const route = useRoute();
let previousAction: CodeModel = 'HTML';

const wrapHeight = computed(() => {
  return isShowPreview.value ? 'h-[40vh]' : 'h-[calc(100vh-88px)]';
});

provide('iframe', iframe);
provide('codeMenu', { isShowMenuMap, toggleMenu });

selectProject();

function toggleMenu(model: CodeModel, isOpen?: boolean) {
  isShowMenuMap[model] = isOpen ?? !isShowMenuMap[model];
}

function closeInitLoading() {
  const { setInitLoading } = useFlagStore();
  setInitLoading(false);
}

function selectProject() {
  const { id } = route.params;

  if (!id || !isString(id) || id === codeId.value) return;

  const { setCodeId } = useCodeContentStore();

  getCode(id);
  setCodeId(id);
}

function setCurrentAction(isVueSfc: boolean) {
  if (isVueSfc) {
    previousAction = currentAction.value;
  }
  currentAction.value = isVueSfc ? 'VUE' : previousAction;
}

watch(codeId, id => router.push({ params: { id } }), { immediate: true });
watch(isSFC, setCurrentAction, { immediate: true });

onMounted(closeInitLoading);
</script>

<template>
  <code-header />

  <div class="lg:flex">
    <div
      :class="['code_wrap bg-black', `${wrapHeight} lg:h-[calc(100vh-88px)]`]"
      @click="toggleMenu(currentAction, false)"
    >
      <code-editor-action
        v-model:isShowPreview="isShowPreview"
        v-model:currentAction="currentAction"
      />

      <div
        v-show="!isSFC"
        class="code_wrap_editor flex"
      >
        <div :class="['code_wrap_code', { hidden: currentAction !== 'HTML' }]">
          <code-editor model="HTML" />
        </div>

        <div :class="['code_wrap_code', { hidden: currentAction !== 'CSS' }]">
          <code-editor model="CSS" />
        </div>

        <div :class="['code_wrap_code', { hidden: currentAction !== 'JS' }]">
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
      class="code_wrap_hidden h-[calc(100vh-88px)]"
      direction="x"
      v-model:dragA="offsetCodeWrap"
      v-model:dragB="previewWidth"
      unit="vw"
      :limit="{ min: 20, max: 80 }"
    />

    <code-preview
      v-show="isShowPreview"
      class="w-full h-[calc(60vh-88px)] lg:h-[calc(100vh-88px)] preview_width"
    />
  </div>
  <code-footer :previewWidth="previewWidth" />
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
