<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { TEMPLATE_LIST, TEMPLATE_MAP } from '@/config/template';
import { useCodeContentStore } from '@/store';
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
    class="template-popup popup"
    @click.self="closePopup"
  >
    <div class="popup-header">
      <h3>Templates</h3>
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        class="cursor-pointer"
        title="fa-xmark"
        @click="closePopup"
      />
    </div>

    <div class="popup-content">
      <ul class="mt-2 h-full overflow-y-auto">
        <li
          v-for="template in TEMPLATE_LIST"
          :key="template.name"
          :class="{ active: codeTemplate === template.name }"
          @click="selectTemplate(template.name)"
        >
          <img
            :src="getImageSrc(template.src)"
            class="template-popup-icon"
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

<style lang="css" scoped>
.template-popup {
  ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0 12px 16px;
    gap: 8px;

    li {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
      border-bottom: 2px solid #99a1af;
      border-radius: 2px;
      cursor: pointer;
      padding: 8px;
      margin-top: 20px;
    }

    li:hover {
      background-color: #e5e7eb;
    }

    li.active {
      background-color: rgb(252 200 0 / 0.8);
      border-color: rgb(252 200 0 / 0.8);
    }
  }
}

.template-popup-icon {
  margin: 0 4px;
  width: 56px;
  height: 56px;
}

@media (min-width: 1024px) {
  .template-popup {
    ul {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .template-popup-icon {
    margin: 0 12px;
  }
}
</style>
