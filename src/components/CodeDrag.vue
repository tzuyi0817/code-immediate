<script setup lang="ts">
import { computed } from 'vue';
import useDrag from '@/hooks/useDrag';
import type { DragOffset } from '@/types/drag';

interface Props {
  direction: 'x' | 'y';
  dragA?: string;
  dragB?: string;
  dragC?: string;
  unit?: '%' | 'vh' | 'vw';
  typeC?: 'next' | 'previous';
}

const props = withDefaults(defineProps<Props>(), {
  unit: '%',
});
const emit = defineEmits(['update:dragA', 'update:dragB', 'update:dragC']);
const cursor = computed(() => props.direction === 'x' ? 'cursor-col-resize' : 'cursor-row-resize');
const layout = computed(() => props.direction === 'x' ? 'w-[18px]' : 'h-[18px]');

const {
  startDrag,
} = useDrag(dragCallback);

function dragCallback(offset: DragOffset) {
  const { dragA, dragB, dragC, direction, unit, typeC } = props;
  const offsetA = dragA ? calculateOffset(dragA, offset[direction]) : 50;
  const offsetB = dragB ? calculateOffset(dragB, -offset[direction]) : 50;

  if (offsetA <= 0) {
    if (typeC !== 'previous') return;
    const offsetC = dragC ? calculateOffset(dragC, offset[direction]) : 0;
    if (offsetC <= 0) return;
    dragB && emit('update:dragB', `${offsetB}${unit}`);
    return dragC && emit('update:dragC', `${offsetC}${unit}`);
  }
  if (offsetB <= 0) {
    if (typeC !== 'next') return;
    const offsetC = dragC ? calculateOffset(dragC, -offset[direction]) : 0;
    if (offsetC <= 0) return;
    dragA && emit('update:dragA', `${offsetA}${unit}`);
    return dragC && emit('update:dragC', `${offsetC}${unit}`);
  }
  if (
    direction === 'y' &&
    (offsetA >= 80 || offsetB >= 80 || offsetA <= 8 || offsetB <= 8)
  ) return;

  dragA && emit('update:dragA', `${offsetA}${unit}`);
  dragB && emit('update:dragB', `${offsetB}${unit}`);
}

function calculateOffset(drag: string, offset: number) {
  const { unit } = props;
  return (+drag.slice(0, -unit.length) / 100 + offset) * 100;
}
</script>

<template>
  <div
    :class="['code_drag', cursor, layout]"
    @mousedown="startDrag"
  >
    <slot></slot>
  </div>
</template>

<style lang="postcss" scoped>
.code_drag {
  @apply 
  select-none
  z-[1]
  border-[1px]
  border-gray-700/60
  bg-black;
}
</style>