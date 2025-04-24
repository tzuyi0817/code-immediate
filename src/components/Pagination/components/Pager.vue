<script setup lang="ts">
import { ref, computed, type DirectiveBinding } from 'vue';

interface Props {
  currentPage: number;
  pageCount: number;
  pagerCount: number;
  disabled?: boolean;
}

interface Emits {
  change: [page: number];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const quickPrevHover = ref(false);
const quickNextHover = ref(false);

const vQuickPage = {
  unmounted(_: Element, binding: DirectiveBinding<() => void>) {
    binding.value?.();
  },
};

const showPrevMore = computed(() => {
  const { currentPage, pageCount, pagerCount } = props;

  if (pageCount <= pagerCount) return false;
  const halfPagerCount = (pagerCount - 1) / 2;

  return currentPage > pagerCount - halfPagerCount + 1;
});

const showNextMore = computed(() => {
  const { currentPage, pageCount, pagerCount } = props;

  if (pageCount <= pagerCount) return false;
  const halfPagerCount = (pagerCount - 1) / 2;

  return currentPage < pageCount - halfPagerCount - 1;
});

const pagers = computed(() => {
  const { currentPage, pageCount, pagerCount } = props;
  const halfPagerCount = (pagerCount - 1) / 2;
  let startPage = 2;
  let endPage = pageCount - 2;

  if (showPrevMore.value && !showNextMore.value) {
    startPage = Math.min(pageCount - pagerCount, currentPage - halfPagerCount);
    endPage = Math.min(pageCount - 1, currentPage + halfPagerCount);
  } else if (!showPrevMore.value && showNextMore.value) {
    startPage = Math.max(2, currentPage - halfPagerCount);
    endPage = startPage + pagerCount - 1;
  } else if (showPrevMore.value && showNextMore.value) {
    startPage = currentPage - halfPagerCount;
    endPage = currentPage + halfPagerCount;
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
});

function handlePageChange(event: Event) {
  if (props.disabled) return;
  const target = event.target as HTMLElement;
  const { page } = target.dataset;

  if (!page) return;
  const { currentPage, pagerCount } = props;
  let nextPage = 0;

  if (page === 'quickPrev') {
    nextPage = currentPage - pagerCount;
  } else if (page === 'quickNext') {
    nextPage = currentPage + pagerCount;
  } else {
    nextPage = Number(page);
  }

  emit('change', nextPage);
}
</script>

<template>
  <ul
    class="flex items-center justify-center"
    @click="handlePageChange"
  >
    <li
      v-if="pageCount > 0"
      class="btn page"
      :class="{ active: currentPage === 1, disabled }"
      :aria-current="currentPage === 1"
      aria-label="page 1"
      data-page="1"
    >
      1
    </li>

    <li
      v-if="showPrevMore"
      v-quick-page="() => (quickPrevHover = false)"
      class="btn page"
      :class="{ disabled }"
      aria-label="prev pages"
      data-page="quickPrev"
      @mouseenter="quickPrevHover = true"
      @mouseleave="quickPrevHover = false"
    >
      <font-awesome-icon
        :icon="`fa-solid fa-${quickPrevHover ? 'angles-left' : 'ellipsis'}`"
        class="pointer-events-none"
      />
    </li>

    <li
      v-for="pager of pagers"
      :key="pager"
      class="btn page"
      :class="{ active: currentPage === pager, disabled }"
      :aria-current="currentPage === pager"
      :aria-label="`page ${pager}`"
      :data-page="pager"
    >
      {{ pager }}
    </li>

    <li
      v-if="showNextMore"
      v-quick-page="() => (showNextMore = false)"
      class="btn page"
      :class="{ disabled }"
      aria-label="next pages"
      data-page="quickNext"
      @mouseenter="quickNextHover = true"
      @mouseleave="quickNextHover = false"
    >
      <font-awesome-icon
        :icon="`fa-solid fa-${quickNextHover ? 'angles-right' : 'ellipsis'}`"
        class="pointer-events-none"
      />
    </li>

    <li
      v-if="pageCount > 1"
      class="btn page"
      :class="{ active: currentPage === pageCount, disabled }"
      :aria-current="currentPage === pageCount"
      :aria-label="`page ${pageCount}`"
      :data-page="pageCount"
    >
      {{ pageCount }}
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
.page {
  @apply w-8 h-8 text-sm duration-0 select-none hover:text-yellow-400;
}

.page.active {
  @apply text-yellow-400 font-bold;
}

.page.disabled {
  @apply text-gray-400 cursor-not-allowed;
}
</style>
