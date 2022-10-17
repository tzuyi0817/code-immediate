<script setup lang="ts">
import { ref } from 'vue';
import SettingsPopup from '@/components/SettingsPopup.vue';
import TemplatePopup from '@/components/TemplatePopup.vue';

const isShowSettingsPop = ref(false);
const isShowTemplatePop = ref(false);

function toggleSettingsPop() {
  isShowSettingsPop.value = !isShowSettingsPop.value;
}

function toggleTemplatePop() {
  isShowTemplatePop.value = !isShowTemplatePop.value;
}
</script>

<template>
  <header class="code_header">
    <div class="code_header_left">
      <p class="font-bold">
        untitled <font-awesome-icon icon="fa-solid fa-pen-fancy" />
      </p>
      <p class="text-xs">Captain Anonymous</p>
    </div>

    <div class="code_header_right">
      <button class="btn btn_base" @click="toggleSettingsPop">
        <font-awesome-icon icon="fa-solid fa-gear" class="mr-1" /> Settings
      </button>
      <button class="btn btn_base" @click="toggleTemplatePop">
        <font-awesome-icon icon="fa-solid fa-fire-flame-simple" class="mr-1" /> Template
      </button>
    </div>

    <SettingsPopup
      v-if="isShowSettingsPop"
      v-model:isShowSettingsPop="isShowSettingsPop"
    />
    <TemplatePopup 
      v-if="isShowTemplatePop"
      v-model:isShowTemplatePop="isShowTemplatePop"
    />
  </header>
</template>

<style lang="postcss" scoped>
.code_header {
  @apply
  h-14
  p-2
  flex
  items-center
  justify-between
  text-sm
  border-b-2
  border-gray-700/60
  bg-black;
  &_left {
    @apply text-white;
    svg {
      @apply text-xs;
    }
  }
  &_right {
    @apply
    flex
    gap-1;
  }
}
</style>