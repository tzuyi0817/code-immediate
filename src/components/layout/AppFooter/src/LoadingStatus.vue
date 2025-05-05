<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
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
  <div class="loading-status">
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
      class="animate-spin loading-status-icon"
    />
    <font-awesome-icon
      v-if="isShowTick"
      :icon="`fa-solid ${statusIcon}`"
      :title="statusIcon"
      :class="['loading-status-icon', { 'text-red-500': isError }]"
    />
  </div>
</template>

<style lang="css" scoped>
.loading-status {
  display: flex;
  color: #fcc800;
  gap: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
</style>
