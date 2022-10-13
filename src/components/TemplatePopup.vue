<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store'; 
import { TEMPLATE_MAP } from '@/config/template';
import type { CodeTemplate } from '@/types/codeContent';

const emit = defineEmits(['update:isShowTemplatePop']);
const { codeTemplate } = storeToRefs(useCodeContentStore())
const templateList: Record<string, string>[] = [
  { name: 'ES6', src: getImageSrc('/templateIcon/es6.png'), version: '' },
  { name: 'React', src: getImageSrc('/templateIcon/react.svg'), version: 'v18.2.0' },
  { name: 'Vue', src: getImageSrc('/templateIcon/vue.svg'), version: 'v3.2.4' },
  { name: 'VueSFC', src: getImageSrc('/templateIcon/vue.svg'), version: 'v3.2.4' },
  { name: 'Angular', src: getImageSrc('/templateIcon/angular.png'), version: 'v1.8.3' },
];

function selectTemplate(name: string) {
  const { setCodeTemplate, setCodeMap } = useCodeContentStore();
  setCodeTemplate(name);
  setCodeMap(TEMPLATE_MAP[name as CodeTemplate]);
  closePopup();
}

function getImageSrc(path: string) {
  return new URL(path, import.meta.url).toString();
}

function closePopup() {
  emit('update:isShowTemplatePop', false);
}
</script>

<template>
  <div class="template_popup popup" @click.self="closePopup">
    <div class="popup_content">
      <div class="flex justify-between items-center">
        <p class="text-base font-bold text-gray-600">Common Templates</p>
        <font-awesome-icon 
          icon="fa-solid fa-xmark"
          class="cursor-pointer"
          @click="closePopup"
        />
      </div>
      <ul>
        <li 
          v-for="template in templateList" 
          :key="template.name"
          :class="{ active: codeTemplate === template.name }"
          @click="selectTemplate(template.name)"
        >
          <img :src="template.src" alt="" class="template_popup_icon">
          <div class="flex flex-col justify-center items-center">
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
    @apply
    mx-3
    w-14
    h-14;
  }
  ul {
    @apply
    flex
    flex-wrap
    justify-center
    gap-2;
    li {
      @apply
      flex
      transition-all
      items-center
      justify-start
      w-[calc(50%-16px)]
      border-b-2
      border-gray-400
      rounded-sm
      cursor-pointer
      p-2
      mt-5
      hover:bg-gray-200;
      &.active {
        @apply 
        bg-yellow-400/80
        border-yellow-400/80;
      }
    }
  }
}
</style>