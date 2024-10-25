<script setup lang="ts">
import { computed } from 'vue';
import { useDrag } from '@/hooks/use-drag';
import type { DragOffset } from '@/types/drag';

interface Props {
  direction: 'x' | 'y';
  dragA?: string;
  dragB?: string;
  dragC?: string;
  unit?: '%' | 'vh' | 'vw';
  typeC?: 'next' | 'previous';
  limit?: Record<'min' | 'max', number>;
}

interface DragTarget {
  offset: number;
  drag?: string;
  type: 'A' | 'B';
}

const { direction, dragA, dragB, dragC, unit = '%', typeC, limit = { min: 0, max: 100 } } = defineProps<Props>();
const emit = defineEmits(['update:dragA', 'update:dragB', 'update:dragC']);
const cursor = computed(() => (direction === 'x' ? 'cursor-col-resize' : 'cursor-row-resize'));
const layout = computed(() => (direction === 'x' ? 'w-[18px]' : 'min-h-[18px]'));

const { startDrag } = useDrag(dragCallback);

function dragCallback(offset: DragOffset) {
  const offsetA = dragA ? calculateOffset(dragA, offset[direction]) : 50;
  const offsetB = dragB ? calculateOffset(dragB, -offset[direction]) : 50;

  if (offsetA <= 0 && typeC === 'previous') {
    multiDrag(offset[direction], { offset: offsetB, drag: dragB, type: 'B' });
    return;
  }
  if (offsetB <= 0 && typeC === 'next') {
    multiDrag(-offset[direction], { offset: offsetA, drag: dragA, type: 'A' });
  }
  if (offsetA <= limit.min || offsetB <= limit.min) return;
  if (offsetA >= limit.max || offsetB >= limit.max) return;
  if (dragA) updateDrag('A', `${offsetA}${unit}`);
  if (dragB) updateDrag('B', `${offsetB}${unit}`);
}

function multiDrag(offset: number, target: DragTarget) {
  const offsetC = dragC ? calculateOffset(dragC, offset) : 0;

  if (offsetC <= 0) return;
  if (target.drag) updateDrag(target.type, `${target.offset}${unit}`);
  if (dragC) updateDrag('C', `${offsetC}${unit}`);
}

function updateDrag(type: 'A' | 'B' | 'C', value: string) {
  emit(`update:drag${type}`, value);
}

function calculateOffset(drag: string, offset: number) {
  const result = (+drag.slice(0, -unit.length) / 100 + offset) * 100;

  return Number.isNaN(result) ? 0 : result;
}
</script>

<template>
  <div
    :class="['code_drag', cursor, layout]"
    title="drag"
    @mousedown="startDrag"
  >
    <slot></slot>
  </div>
</template>

<style lang="postcss" scoped>
.code_drag {
  @apply select-none
  z-[1]
  border-[1px]
  border-gray-700/60
  bg-black;
}
</style>
