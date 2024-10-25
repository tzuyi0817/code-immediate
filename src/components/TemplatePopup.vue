<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store';
import { TEMPLATE_MAP, TEMPLATE_LIST } from '@/config/template';
import type { CodeTemplate } from '@/types/code-content';

const isShowTemplatePop = defineModel<boolean>('isShowTemplatePop');
const { codeTemplate } = storeToRefs(useCodeContentStore());

function selectTemplate(name: CodeTemplate) {
  const { setCodeTemplate, setCodeMap } = useCodeContentStore();
  setCodeTemplate(name);
  setCodeMap(TEMPLATE_MAP[name]);
  closePopup();
}

function getImageSrc(path: string) {
  return new URL(path, import.meta.url).href;
}

function closePopup() {
  isShowTemplatePop.value = false;
}
</script>

<template>
  <div
    class="template_popup popup"
    @click.self="closePopup"
  >
    <div class="popup_header">
      <h3>Templates</h3>
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        class="cursor-pointer"
        title="fa-xmark"
        @click="closePopup"
      />
    </div>

    <div class="popup_content">
      <ul class="mt-2 h-full overflow-y-auto">
        <li
          v-for="template in TEMPLATE_LIST"
          :key="template.name"
          :class="{ active: codeTemplate === template.name }"
          @click="selectTemplate(template.name)"
        >
          <img
            :src="getImageSrc(template.src)"
            class="template_popup_icon"
            :alt="template.name"
          />
          <div class="flex flex-col flex-1 justify-center items-center">
            <p>{{ template.name }}</p>
            <span class="text-xs text-gray-500">{{ template.version }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.template_popup {
  &_icon {
    @apply mx-1
    lg:mx-3
    w-14
    h-14;
  }
  ul {
    @apply grid
    grid-cols-2
    lg:grid-cols-3
    pb-4
    px-3
    gap-2;
    li {
      @apply flex
      transition-all
      items-center
      justify-start
      border-b-2
      border-gray-400
      rounded-sm
      cursor-pointer
      p-2
      mt-5
      hover:bg-gray-200;
      &.active {
        @apply bg-yellow-400/80
        border-yellow-400/80;
      }
    }
  }
}
</style>
