<script lang="ts" setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFlagStore } from '@/store';
import { sleep } from '@/utils/common';

const { isLoading } = storeToRefs(useFlagStore());
const isShowTick = ref(false);

async function flashTick() {
  isShowTick.value = true;
  await sleep();
  isShowTick.value = false;
}

watch(isLoading, (isOpen) => !isOpen && flashTick());
</script>

<template>
  <div class="code_loading">
    <font-awesome-icon
      v-if="isLoading"
      icon="fa-solid fa-spinner"
      class="animate-spin code_loading_icon"
    />
    <font-awesome-icon
      v-if="isShowTick"
      icon="fa-solid fa-check"
      class="code_loading_icon"
    />
  </div>
</template>

<style lang="postcss" scoped>
.code_loading {
  @apply
  absolute
  top-1
  right-3
  text-yellow-400;
  &_icon {
    @apply
    absolute
    top-1
    right-3
  }
}
</style>