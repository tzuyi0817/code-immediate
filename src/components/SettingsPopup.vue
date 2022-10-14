<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCodeContentStore } from '@/store';
import { debounce } from '@/utils/common';
import type { CdnItem } from '@/types/cdn';

const emit = defineEmits(['update:isShowSettingsPop']);
const currentSelect = ref('CSS');
const keyword = ref('');
const cdnList = ref<CdnItem[]>([]);

const fakeCdn = [
  {
    description: "ssi-modal is the most flexible and powerful modal window.",
    fileType: "js",
    filename: "js/ssi-modal.min.js",
    name: "ssi-modal",
    objectID: "ssi-modal",
    version: "1.0.28",
  },
  {
    description: "Manage HTML metadata in Vue.js components with ssr support",
    fileType: "js",
    filename: "js/contact-form.min.js",
    name: "bootstrap3-contact-form",
    objectID: "bootstrap3-contact-form",
    version: "1.4.1",
  },
  {
    description: "Quickly integrate Bootstrap 4 components with Vue.js",
    fileType: "js",
    filename: "bootstrap-vue.min.js",
    name: "bootstrap-vue",
    objectID: "bootstrap-vue",
    version: "2.22.0",
  },
  {
    description: "JavaScript implementations of network transports, cryptography, ciphers, PKI, message digests, and various utilities.",
    fileType: "js",
    filename: "forge.min.js",
    name: "forge",
    objectID: "forge",
    version: "1.3.1",
  },
  {
    description: "A polyfill for http://www.w3.org/TR/eventsource/",
    fileType: "js",
    filename: "eventsource.min.js",
    name: "event-source-polyfill",
    objectID: "event-source-polyfill",
    version: "0.0.9",
  },
  {
    description: "Bootstrap 3 components implemented by Vue 2.",
    fileType: "js",
    filename: "Btn.min.js",
    name: "uiv",
    objectID: "uiv",
    version: "2.0.4",
  },
  {
    description: "Portal client for Node.js",
    fileType: "js",
    filename: "portal.min.js",
    name: "portal",
    objectID: "portal",
    version: "1.1.1",
  },
];

const tabList = [
  {
    name: 'CSS',
    title: 'Add External Stylesheets',
    description: "Any URL's added here will be added as <link>s in order, and before the CSS in the editor."
  },
  {
    name: 'JS',
    title: 'Add External Scripts',
    description: "Any URL's added here will be added as <script>s in order, and run before the JavaScript in the editor.",
  }
];

const selectTabItem = computed(() => tabList.find(({ name }) => currentSelect.value === name));
const cdnResources = computed(() => {
  const { codeContent } = useCodeContentStore();
  return codeContent[currentSelect.value].resources;
});
const keywordHandler = debounce(searchCdn);

function changeSelect(name: string) {
  currentSelect.value = name;
}

function setCdn() {
  // 'https://cdnjs.cloudflare.com/ajax/libs/'
  console.log('setCdn!!!!!!!!');
}

function addCdn(cdn: CdnItem) {
  const { setCodeResource } = useCodeContentStore();

  keyword.value = '';
  cdnList.value = [];
  setCodeResource({
    type: currentSelect.value,
    resources: [...new Set([...cdnResources.value, cdn])],
  });
};

function deleteCdn(index: number) {
  cdnResources.value.splice(index, 1);
}

function searchCdn(word: string) {
  cdnList.value = word === ''
    ? []
    : fakeCdn.filter(({ name }) => name.includes(word));
}

function closePopup() {
  emit('update:isShowSettingsPop', false);
}

watch(keyword, keywordHandler);
</script>

<template>
  <div class="settings_popup popup" @click.self="closePopup">
    <div class="popup_content">
      <div class="flex justify-between items-center">
        <h3>CDN Settings</h3>
        <font-awesome-icon 
          icon="fa-solid fa-xmark"
          class="cursor-pointer"
          @click="closePopup"
        />
      </div>

      <ul class="settings_popup_tab">
        <li 
          v-for="tab in tabList" :key="tab.name"
          :class="{ active: currentSelect === tab.name }"
          @click="changeSelect(tab.name)"
        >{{ tab.name }}</li>
      </ul>

      <div class="settings_popup_content">
        <h3>{{ selectTabItem?.title }}</h3>
        <section class="text-gray-500 mb-3">{{ selectTabItem?.description }}</section>

        <div class="relative">
          <input type="text" v-model.trim="keyword" class="input pl-9" placeholder="Search CDNjs" />
          <font-awesome-icon 
            icon="fa-solid fa-magnifying-glass"
            class="absolute top-3 left-3 text-lg text-gray-500"
          />
          <ul class="absolute bg-white w-full rounded-md shadow-lg">
            <li
              v-for="cdn in cdnList"
              class="p-3 border-[1px] border-gray-300 cursor-pointer hover:bg-yellow-400/80"
              @click="addCdn(cdn)"
            >
              <p class="flex justify-between mb-1">
                <span>{{ cdn.name }}</span> 
                <span>{{ cdn.version }}</span>
              </p>
              <section class="text-gray-500 text-xs">{{ cdn.description }}</section>
            </li>
          </ul>
        </div>

        <ul class="py-3">
          <li v-for="(cdn, index) in cdnResources" :key="cdn.name" class="flex items-center justify-between">
            <p class="text-ellipsis overflow-hidden whitespace-nowrap p-3 bg-white mb-2 rounded text-xs flex-1">
              {{ `https://cdnjs.cloudflare.com/ajax/libs/${cdn.filename}` }}
            </p>
            <font-awesome-icon 
              icon="fa-solid fa-xmark"
              class="cursor-pointer ml-3 text-gray-500 hover:text-yellow-400/80"
              @click="deleteCdn(index)"
            />
          </li>
        </ul>
      </div>

      <button class="btn btn_yellow float-right mt-4 text-sm" @click="setCdn">Confirm</button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.settings_popup {
  &_tab {
    @apply
    flex
    pt-3
    mb-3
    gap-1;
    li {
      @apply
      cursor-pointer
      p-2
      min-w-[45px]
      transition-all
      rounded-md
      text-center
      hover:bg-yellow-400/80
      hover:text-white;
      &.active {
        @apply 
        bg-yellow-400/80
        text-white;
      }
    }
  }
  &_content {
    @apply
    p-3
    overflow-y-auto
    h-[calc(60vh-165px)]
    bg-black/5
    border-[1px]
    border-gray-300
    rounded
    shadow-lg;
  }
}
</style>