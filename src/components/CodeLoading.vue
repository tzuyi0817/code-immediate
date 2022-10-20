<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFlagStore } from '@/store';
import { sleep } from '@/utils/common';

const { isLoading, loadingType } = storeToRefs(useFlagStore());
const isShowTick = ref(false);
const isError = computed(() => loadingType.value.endsWith('error'));

async function flashTick() {
  isShowTick.value = true;
  await sleep(1000);
  isShowTick.value = false;
}

watch(isLoading, (isOpen) => !isOpen && flashTick());
</script>

<template>
  <div class="code_loading">
    <p
      v-if="isLoading || isShowTick"
      :class="['text-xs mr-5', { 'text-red-500': isError }]"
    >{{ loadingType }}</p>

    <font-awesome-icon
      v-if="isLoading"
      icon="fa-solid fa-spinner"
      class="animate-spin code_loading_icon"
    />
    <font-awesome-icon
      v-if="isShowTick"
      :icon="`fa-solid fa-${isError ? 'xmark' : 'check'}`"
      :class="['code_loading_icon', { 'text-red-500': isError }]"
    />
  </div>
</template>

<style lang="postcss" scoped>
.code_loading {
  @apply
  absolute
  top-2
  right-3
  text-yellow-400;
  &_icon {
    @apply
    absolute
    top-0
    right-0;
  }
}
</style>