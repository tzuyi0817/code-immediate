<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFlagStore } from '@/store';
import { sleep } from '@/utils/common';

const { isLoading, loadingType } = storeToRefs(useFlagStore());
const isShowTick = ref(false);
const isError = computed(() => loadingType.value.endsWith('error'));
const statusIcon = computed(() => `fa-${isError.value ? 'xmark' : 'check'}`);

async function flashTick() {
  isShowTick.value = true;
  await sleep(1000);
  isShowTick.value = false;
}

watch(isLoading, isOpen => !isOpen && flashTick());
</script>

<template>
  <div class="code_loading">
    <p
      v-if="isLoading || isShowTick"
      :class="['text-xs', { 'text-red-500': isError }]"
    >
      {{ loadingType }}
    </p>

    <font-awesome-icon
      v-if="isLoading"
      icon="fa-solid fa-spinner"
      title="fa-spinner"
      class="animate-spin code_loading_icon"
    />
    <font-awesome-icon
      v-if="isShowTick"
      :icon="`fa-solid ${statusIcon}`"
      :title="statusIcon"
      :class="['code_loading_icon', { 'text-red-500': isError }]"
    />
  </div>
</template>

<style lang="postcss" scoped>
.code_loading {
  @apply flex text-yellow-400 gap-2 font-mono;
}
</style>
