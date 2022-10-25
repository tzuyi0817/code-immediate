<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useFlagStore } from '@/store';

const { isInitLoading } = storeToRefs(useFlagStore());
const title = document.title.split('').map(alphabet => alphabet.toUpperCase());
</script>

<template>
  <div v-if="isInitLoading" class="init_loading">
    <div class="init_loading_alphabet">
      <p
        v-for="(alphabet, index) in title"
        :key="index"
        :style="{ '--i': index }"
      >{{ alphabet }}</p>
    </div>

    <p class="init_loading_wait">Please Wait..</p>
  </div>
</template>

<style lang="postcss" scoped>
.init_loading {
  @apply
  fixed
  w-full
  h-full
  flex
  flex-col
  justify-center
  items-center;
  &_alphabet {
    @apply flex gap-2;
    p {
      @apply
      text-lg
      font-bold
      rounded-full
      text-red-600
      animate-[beat_0.5s_calc(var(--i)*0.16s)_alternate_infinite]
    }
  }
  &_wait {
    @apply
    uppercase
    text-lg
    tracking-widest
  }
}

@keyframes beat {
  from { transform: scale(1.25); }
  to { transform: translateY(-5rem) scaleX(1) }
}
</style>