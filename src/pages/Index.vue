<script setup lang="ts">
import { ref, reactive, computed, provide, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia';
import { useCodeContentStore, useFlagStore } from '@/store';
import { getCode } from '@/apis/code';
import CodeHeader from '@/components/CodeHeader.vue';
import CodeEditorAction from '@/components/CodeEditorAction.vue';
import CodeDrag from '@/components/CodeDrag.vue';
import CodeEditorTab from '@/components/CodeEditorTab.vue';
import CodeEditor from '@/components/CodeEditor.vue';
import CodePreview from '@/components/CodePreview.vue';
import CodeFooter from '@/components/CodeFooter.vue';
import {
  HTML_LANGUAGE_MAP,
  CSS_LANGUAGE_MAP,
  JS_LANGUAGE_MAP,
} from '@/config/language';
import type { CodeModel } from '@/types/codeContent';

const isShowPreview = ref(true);
const currentAction = ref<CodeModel>('HTML');
const iframe = ref(null);
const codeWrapHeight = ref('40vh');
const previewHeight = ref('60vh');
const previewWidth = ref('66.7vw');
const offsetHtmlWrap = ref('33.3%');
const offsetCssWrap = ref('33.3%');
const offsetJsWrap = ref('33.3%');
const offsetVueWrap = ref('33.3vw');
const isShowMenuMap = reactive({
  HTML: false,
  CSS: false,
  JS: false,
  VUE: false,
});
const { isSFC, codeId } = storeToRefs(useCodeContentStore());
const router = useRouter();
const route = useRoute();
const wrapHeight = computed(() => {
  return isShowPreview.value ? 'h-[40vh]' : 'h-[calc(100vh-88px)]';
});

provide('iframe', iframe);
provide('codeMenu', { isShowMenuMap, toggleMenu });

function toggleMenu(model: CodeModel, isOpen?: boolean) {
  isShowMenuMap[model] = isOpen ?? !isShowMenuMap[model];
}

function closeInitLoading() {
  const { setInitLoading } = useFlagStore();
  setInitLoading(false);
}

watch(codeId, (id) => router.push({ params: { id } }));
getCode(route.params.id as string);
useCodeContentStore().setCodeId(route.params.id as string ?? 0);
onMounted(closeInitLoading);
</script>

<template>
  <code-header />

  <div :class="{ 'lg:flex': isSFC }">
    <div :class="[
      'code_wrap bg-black',
      isSFC ? `${wrapHeight} lg:h-[calc(100vh-88px)]` : `${wrapHeight} dragHeight`,
    ]">
      <code-editor-action
        v-model:isShowPreview="isShowPreview"
        v-model:currentAction="currentAction"
      />

      <div v-show="!isSFC" class="flex h-full lg:h-[calc(100%-18px)] overflow-hidden">
        <div class="code_wrap_hidden w-[18px]"></div>
        <div 
          :class="['code_wrap_html', { 'code_wrap_hidden': currentAction !== 'HTML' }]" 
          @click="toggleMenu('HTML', false)"
        >
          <code-editor-tab
            :languageMap="HTML_LANGUAGE_MAP"
            model="HTML" 
            :width="offsetHtmlWrap"
          />
          <code-editor class="h-[calc(100%-40px)]" model="HTML" />
        </div>

        <code-drag
          class="code_wrap_hidden"
          direction="x"
          v-model:dragA="offsetHtmlWrap"
          v-model:dragB="offsetCssWrap"
          v-model:dragC="offsetJsWrap"
          typeC="next"
        />

        <div
          :class="['code_wrap_css', { 'code_wrap_hidden': currentAction !== 'CSS' }]"
          @click="toggleMenu('CSS', false)"
        >
          <code-editor-tab
            :languageMap="CSS_LANGUAGE_MAP"
            model="CSS"
            :width="offsetCssWrap"
          />
          <code-editor class="h-[calc(100%-40px)]" model="CSS" />
        </div>

        <code-drag
          class="code_wrap_hidden"
          direction="x"
          v-model:dragA="offsetCssWrap"
          v-model:dragB="offsetJsWrap"
          v-model:dragC="offsetHtmlWrap"
          typeC="previous"
        />

        <div
          :class="['code_wrap_js', { 'code_wrap_hidden': currentAction !== 'JS' }]"
          @click="toggleMenu('JS', false)"
        >
          <code-editor-tab
            :languageMap="JS_LANGUAGE_MAP"
            model="JS"
            :width="offsetJsWrap"
          />
          <code-editor class="h-[calc(100%-40px)]" model="JS" />
        </div>
      </div>

      <code-drag
        v-if="!isSFC"
        class="code_wrap_hidden"
        direction="y"
        v-model:dragA="codeWrapHeight"
        v-model:dragB="previewHeight"
        unit="vh"
        :limit="{ min: 20, max: 80 }"
      />

      <div v-show="isSFC" @click="toggleMenu('VUE', false)" class="h-full flex">
        <div class="code_wrap_vue flex-1">
          <code-editor-tab model="VUE" />
          <code-editor class="h-[calc(100%-40px)]" model="VUE" />
        </div>
        <code-drag
          class="code_wrap_hidden h-full"
          direction="x"
          v-model:dragA="offsetVueWrap"
          v-model:dragB="previewWidth"
          unit="vw"
          :limit="{ min: 20, max: 80 }"
        />
      </div>
    </div>

    <code-preview
      v-show="isShowPreview"
      :class="[
        'w-full',
        'h-[calc(60vh-88px)]',
        isSFC ? 'lg:h-[calc(100vh-88px)] preview_width' : 'preview_height'
      ]"
    />
  </div>
  <code-footer :previewWidth="previewWidth" />
</template>

<style lang="postcss" scoped>
.code_wrap {
  &.dragHeight {
    @media (min-width: 1024px) {
      height: v-bind(codeWrapHeight);
    }
  }
  &_hidden {
    @apply hidden lg:block;
  }
  &_html {
    @apply w-full;
    @media (min-width: 1024px) {
      width: calc(v-bind(offsetHtmlWrap) - 18px);
    }
  }
  &_css {
    @apply w-full z-[1];
    @media (min-width: 1024px) {
      width: calc(v-bind(offsetCssWrap) - 18px);
    }
  }
  &_js {
    @apply w-full z-[2];
    @media (min-width: 1024px) {
      width: calc(v-bind(offsetJsWrap) - 18px);
    }
  }
  &_vue {
    @apply w-full;
    @media (min-width: 1024px) {
      width: calc(v-bind(offsetVueWrap));
    }
  }
}

.preview_height {
  @media (min-width: 1024px) {
    height: calc(v-bind(previewHeight) - 88px);
  }
}

.preview_width {
  @media (min-width: 1024px) {
    width: calc(v-bind(previewWidth) - 18px);
  }
}
</style>