<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import axios, { type AxiosResponse } from 'axios';
import { useCodeContentStore } from '@/store';
import { debounce } from '@/utils/common';
import { toast } from '@/utils/toast';
import { BUILT_IN_RESOURCES } from '@/config/template';
import type { CdnItem, CdnJsResponse } from '@/types/cdn';

type SelectName = 'CSS' | 'JS';
type CdnResourceMap = Record<SelectName, CdnItem['latest'][]>;

interface TabItem {
  name: SelectName;
  title: string;
  description: string;
}

const isShowSettingsPop = defineModel<boolean>('isShowSettingsPop');
const currentSelect = ref<SelectName>('CSS');
const keyword = ref('');
const cdnList = ref<CdnItem[]>([]);
const isSearch = ref(false);
const cdnResources = reactive<CdnResourceMap>({ CSS: [], JS: [] });
const tabList: TabItem[] = [
  {
    name: 'CSS',
    title: 'Add External Stylesheets',
    description: "Any URL's added here will be added as <link>s in order, and before the CSS in the editor.",
  },
  {
    name: 'JS',
    title: 'Add External Scripts',
    description:
      "Any URL's added here will be added as <script>s in order, and run before the JavaScript in the editor.",
  },
];

const selectTabItem = computed(() => tabList.find(({ name }) => currentSelect.value === name));
const keywordHandler = debounce(searchCdn);

function changeSelect(name: SelectName) {
  keyword.value = '';
  cdnList.value = [];
  currentSelect.value = name;
}

function setCdn() {
  const { setCodeResource } = useCodeContentStore();
  const resources = cdnResources[currentSelect.value].filter(Boolean);

  setCodeResource({
    type: currentSelect.value,
    resources,
  });
  closePopup();
}

function addCdn(cdn: string) {
  const resources = cdnResources[currentSelect.value];

  keyword.value = '';
  cdnList.value = [];
  if (resources.includes(cdn)) return;
  resources.push(cdn);
}

function deleteCdn(index: number) {
  cdnResources[currentSelect.value].splice(index, 1);
}

function searchCdn(word: string) {
  if (word === '') {
    cdnList.value = [];
    return;
  }
  const { VITE_CDN_API_URL } = import.meta.env;

  isSearch.value = true;
  axios
    .get<CdnItem, AxiosResponse<CdnJsResponse>>(VITE_CDN_API_URL, {
      params: {
        search: word,
        search_fields: 'name',
        fields: 'description,fileType,filename,latest,name,objectID,version',
      },
    })
    .then(({ data }) => {
      const { results } = data;
      const selectFileType = currentSelect.value.toLowerCase();

      cdnList.value = results.filter(({ fileType }) => fileType === selectFileType);
      isSearch.value = false;
    })
    .catch(error => {
      const message = error.response?.data?.message || error.message;

      isSearch.value = false;
      toast.showToast(message, 'error');
      if (import.meta.env.MODE !== 'test') throw new Error(message, { cause: error });
    });
}

function visitCdn(cdn: string) {
  self.open(cdn);
}

function closePopup() {
  isShowSettingsPop.value = false;
}

onMounted(() => {
  const {
    codeContent: { CSS, JS },
  } = useCodeContentStore();
  cdnResources.CSS = [...CSS.resources];
  cdnResources.JS = [...JS.resources];
});
</script>

<template>
  <div
    class="settings_popup popup"
    @click.self="closePopup"
  >
    <div class="popup_header">
      <h3>CDN Settings</h3>
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        title="fa-xmark"
        class="cursor-pointer"
        @click="closePopup"
      />
    </div>

    <div class="popup_content">
      <ul class="settings_popup_tab">
        <li
          v-for="tab in tabList"
          :key="tab.name"
          :class="{ active: currentSelect === tab.name }"
          @click="changeSelect(tab.name)"
        >
          {{ tab.name }}
        </li>
      </ul>

      <div class="settings_popup_content">
        <h3>{{ selectTabItem?.title }}</h3>
        <section class="text-gray-500 mb-3">
          {{ selectTabItem?.description }}
        </section>

        <div class="relative">
          <input
            v-model.trim="keyword"
            type="text"
            class="input px-9"
            placeholder="Search CDNjs resources"
            @input="keywordHandler(keyword)"
          />
          <font-awesome-icon
            icon="fa-solid fa-magnifying-glass"
            title="fa-magnifying-glass"
            class="absolute top-3 left-3 text-lg text-gray-500"
          />
          <font-awesome-icon
            v-if="isSearch"
            icon="fa-solid fa-spinner"
            title="fa-spinner"
            class="animate-spin absolute top-3 right-3 text-lg text-yellow-400"
          />
          <ul class="absolute bg-white w-full rounded-md shadow-lg">
            <li
              v-for="cdn in cdnList"
              :key="cdn.objectID"
              class="p-3 border-[1px] border-gray-300 cursor-pointer hover:bg-yellow-400/80"
              @click="addCdn(cdn.latest)"
            >
              <p class="flex justify-between mb-1">
                <span>{{ cdn.name }}</span>
                <span>{{ cdn.version }}</span>
              </p>
              <section class="text-gray-500 text-xs">
                {{ cdn.description }}
              </section>
            </li>
          </ul>
        </div>

        <ul class="py-3">
          <li
            v-for="(cdn, index) in cdnResources[currentSelect]"
            :key="cdn"
            class="flex items-center justify-between mb-2"
          >
            <input
              v-model.trim.lazy="cdnResources[currentSelect][index]"
              type="text"
              class="input_cdn"
              placeholder="https://cdnjs.cloudflare.com/ajax/libs/customresource"
              :disabled="BUILT_IN_RESOURCES.has(cdn)"
            />

            <div class="flex flex-col ml-2 gap-1">
              <font-awesome-icon
                v-if="!BUILT_IN_RESOURCES.has(cdn)"
                icon="fa-solid fa-xmark"
                title="fa-xmark-cdn"
                class="settings_popup_icon"
                @click="deleteCdn(index)"
              />
              <font-awesome-icon
                icon="fa-regular fa-eye"
                title="fa-eye"
                class="settings_popup_icon"
                @click="visitCdn(cdn)"
              />
            </div>
          </li>

          <button
            class="btn btn_yellow"
            @click="addCdn('')"
          >
            + custom resource
          </button>
        </ul>
      </div>

      <button
        class="btn btn_yellow float-right mt-4 text-sm"
        @click="setCdn"
      >
        Confirm
      </button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.settings_popup {
  &_tab {
    @apply flex
    pt-3
    mb-3
    gap-1;
    li {
      @apply cursor-pointer
      p-2
      min-w-[45px]
      transition-all
      rounded-md
      text-center
      hover:bg-yellow-400
      hover:text-white;
      &.active {
        @apply bg-yellow-400
        text-white;
      }
    }
  }
  &_content {
    @apply p-3
    overflow-y-auto
    h-[calc(60vh-165px)]
    bg-black/5
    border-[1px]
    border-gray-300
    rounded
    shadow-lg;
  }
  &_icon {
    @apply cursor-pointer
    text-gray-500
    hover:text-yellow-400/80;
  }
}
</style>
