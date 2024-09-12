<script setup lang="ts">
import { ref, nextTick, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';
import CodeFeature from '@/components/CodeFeature.vue';
import { useUserStore, useCodeContentStore } from '@/store';
import { DEFAULT_TITLE } from '@/config/common';

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
  <header class="code_header">
    <div class="code_header_left">
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
            <p class="max-w-[calc(100%-16px)] text_ellipsis">
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
        <p class="text-xs text-gray-300 text_ellipsis">
          {{ isLogin ? user.account : 'Captain Anonymous' }}
        </p>
      </div>
    </div>

    <code-feature
      v-model:title="codeTitle"
      :default-title="DEFAULT_TITLE"
    />
  </header>
</template>

<style lang="postcss" scoped>
.code_header {
  @apply h-14
  p-2
  flex
  gap-2
  items-center
  justify-between
  text-sm
  border-b-2
  border-gray-700/60
  bg-black;
  &_left {
    @apply text-white
    flex
    items-center
    w-full
    max-w-[calc(100%-200px)]
    lg:max-w-[calc(100%-590px)]
    gap-2;
    svg {
      @apply text-xs;
    }
  }
}
</style>
