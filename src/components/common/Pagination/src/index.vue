<script setup lang="ts">
import { computed } from 'vue';
import Next from './Next.vue';
import Pager from './Pager.vue';
import Prev from './Prev.vue';

interface Props {
  pageSize?: number;
  total?: number;
  pagerCount?: number;
  disabled?: boolean;
}

interface Emits {
  change: [page: number, pageSize: number];
}

defineOptions({ name: 'Pagination' });

const props = withDefaults(defineProps<Props>(), {
  pageSize: 6,
  total: 0,
  pagerCount: 3,
});
const emit = defineEmits<Emits>();
const currentPage = defineModel<number>('page', { default: 1 });

const pageCount = computed(() => {
  return Math.max(1, Math.ceil(props.total / props.pageSize));
});

function handlePrev() {
  if (currentPage.value <= 1) return;

  changePage(currentPage.value - 1);
}

function changePage(page: number) {
  if (page < 1 || page > pageCount.value || page === currentPage.value) return;

  currentPage.value = page;
  emit('change', currentPage.value, props.pageSize);
}

function handleNext() {
  if (currentPage.value >= pageCount.value) return;

  changePage(currentPage.value + 1);
}
</script>

<template>
  <div class="flex gap-x-2 items-center justify-center">
    <prev
      :current-page="currentPage"
      :disabled="disabled"
      @click="handlePrev"
    />

    <pager
      :current-page="currentPage"
      :page-count="pageCount"
      :pager-count="pagerCount"
      :disabled="disabled"
      @change="changePage"
    />

    <next
      :current-page="currentPage"
      :page-count="pageCount"
      :disabled="disabled"
      @click="handleNext"
    />
  </div>
</template>
