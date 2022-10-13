<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['update:isShowSettingsPop']);
const currentSelect = ref('CSS');
const keyword = ref('');
const fakeCdn = [
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
];
const tabList = [
  { name: 'CSS' },
  { name: 'JS' },
];

function changeSelect(name: string) {
  currentSelect.value = name;
}

function closePopup() {
  emit('update:isShowSettingsPop', false);
}
</script>

<template>
  <div class="settings_popup popup" @click.self="closePopup">
    <div class="popup_content">
      <div class="flex justify-between items-center">
        <p class="text-base font-bold text-gray-600">CDN Settings</p>
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
        <input type="text" v-model.trim="keyword" class="input" />
        <ul>
          <li v-for="cdn in fakeCdn" :key="cdn">
            {{ cdn }}
          </li>
        </ul>
      </div>
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
    max-h-[calc(70vh-120px)]
  }
}
</style>