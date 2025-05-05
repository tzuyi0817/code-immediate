<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { nextTick, ref, useTemplateRef } from 'vue';
import { DEFAULT_TITLE } from '@/config/common';
import { useCodeContentStore, useUserStore } from '@/store';
import AppHeaderActions from './Actions.vue';

defineOptions({ name: 'AppHeader' });

const { user, isLogin } = storeToRefs(useUserStore());
const { codeTitle } = storeToRefs(useCodeContentStore());
const titleInputRef = useTemplateRef<HTMLInputElement>('titleInput');
const isShowEditTitle = ref(false);

setupTitle();

function setupTitle() {
  if (codeTitle.value) return;
  codeTitle.value = DEFAULT_TITLE;
}

function blurTitle() {
  isShowEditTitle.value = false;
  setupTitle();
}

async function openTitle() {
  isShowEditTitle.value = true;

  if (codeTitle.value === DEFAULT_TITLE) {
    codeTitle.value = '';
  }

  await nextTick();
  titleInputRef.value?.focus();
}
</script>

<template>
  <header class="app-header">
    <div class="app-header-left">
      <img
        src="/logo.png"
        class="w-10 basis-10 shrink-0"
        alt="logo"
      />
      <div class="w-[calc(100%-36px)]">
        <div class="font-bold flex items-center gap-1 w-full">
          <input
            v-if="isShowEditTitle"
            ref="titleInput"
            v-model="codeTitle"
            type="text"
            class="w-full bg-black text-white focus:outline-none"
            @blur="blurTitle"
          />
          <template v-else>
            <p class="max-w-[calc(100%-16px)] truncate">
              {{ codeTitle }}
            </p>
            <font-awesome-icon
              icon="fa-solid fa-pen-fancy"
              title="fa-pen-fancy"
              class="cursor-pointer"
              @click="openTitle"
            />
          </template>
        </div>
        <p class="text-xs text-gray-300 truncate">
          {{ isLogin ? user.account : 'Captain Anonymous' }}
        </p>
      </div>
    </div>

    <app-header-actions
      v-model:title="codeTitle"
      :default-title="DEFAULT_TITLE"
    />
  </header>
</template>

<style lang="css" scoped>
.app-header {
  height: 56px;
  padding: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: calc(1.25 / 0.875);
  border-bottom: 2px solid rgb(55 65 81 / 0.6);
  background-color: #000000;
}

.app-header-left {
  color: #ffffff;
  display: flex;
  align-items: center;
  flex: 1 1 0%;
  max-width: calc(100% - 200px);
  gap: 8px;

  svg {
    font-size: 12px;
    line-height: calc(1 / 0.75);
  }
}

@media (min-width: 1024px) {
  .app-header-left {
    max-width: calc(100% - 590px);
  }
}
</style>
