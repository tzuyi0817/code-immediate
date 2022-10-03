<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store'; 
import { TEMPLATE_MAP } from '@/config/template';
import type { CodeTemplate } from '@/types/codeContent';

const emit = defineEmits(['update:isShowTemplatePop']);
const { codeTemplate } = storeToRefs(useCodeContentStore())
const templateList: { name: CodeTemplate; src: string; }[] = [
  { name: 'ES6', src: getImageSrc('/templateIcon/es6.png') },
  { name: 'React', src: getImageSrc('/templateIcon/react.svg') },
  { name: 'Vue', src: getImageSrc('/templateIcon/vue.svg') },
  { name: 'Angular', src: getImageSrc('/templateIcon/angular.png') },
];

function selectTemplate(name: CodeTemplate) {
  const { setCodeTemplate, setCodeMap } = useCodeContentStore();
  setCodeTemplate(name);
  setCodeMap(TEMPLATE_MAP[name]);
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
  <div class="template_popup" @click.self="closePopup">
    <div class="template_popup_content">
      <div class="flex justify-between items-center">
        <p class="text-base font-bold text-gray-600">Common Templates</p>
        <font-awesome-icon icon="fa-solid fa-xmark" @click="closePopup" />
      </div>
      <ul>
        <li 
          v-for="template in templateList" 
          :key="template.name"
          :class="{ active: codeTemplate === template.name }"
          @click="selectTemplate(template.name)"
        >
          <img :src="template.src" alt="" class="template_popup_content_icon">
          <p>{{ template.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="postcss">
.template_popup {
  @apply
  fixed
  top-0
  left-0
  bg-black/30
  flex
  items-center
  justify-center
  z-10
  w-full
  h-full;
  &_content {
    @apply
    px-4
    pt-4
    pb-12
    w-[90%]
    max-w-md
    rounded-md
    bg-white;
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
        items-center
        justify-start
        w-[calc(50%-16px)]
        border-b-2
        border-gray-400
        rounded-sm
        p-2
        mt-5;
        &.active {
          @apply 
          bg-yellow-400/80
          border-yellow-400/80;
        }
      }
    }
  }
}
</style>