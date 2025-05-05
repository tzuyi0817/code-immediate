<script setup lang="ts">
import { computed, nextTick, onMounted, onScopeDispose, ref, useTemplateRef, watch } from 'vue';
import { DURATION, SPACE_Y, Z_INDEX } from './constants';
import { getPreviousToast } from './toast';
import type { ToastType } from './types';

interface Props {
  message?: string;
  duration?: number;
  id: string;
  zIndex?: number;
  type?: ToastType;
}

interface Emits {
  close: [];
  closed: [];
  mounted: [height: number];
}

defineOptions({ name: 'Toast' });

const props = withDefaults(defineProps<Props>(), {
  message: '',
  duration: DURATION,
  zIndex: Z_INDEX,
  type: 'success',
});
const emits = defineEmits<Emits>();
const isShow = ref(false);
const height = ref(0);
const isClose = ref(false);
const toastRef = useTemplateRef('toastRef');
let observer: ResizeObserver | null = new ResizeObserver(updateHeight);
let timer: NodeJS.Timeout | null = null;

const offsetY = computed(() => {
  const previousToast = getPreviousToast(props.id);

  if (!previousToast) return 0;
  const { component } = previousToast;

  return (component.exposed?.offsetBottom?.value ?? 0) + SPACE_Y;
});

const offsetBottom = computed(() => offsetY.value + height.value);

const translateY = computed(() => `${offsetY.value}px`);

const transitionName = computed(() => {
  if (isClose.value) return 'fade-leave-to';

  return isShow.value ? 'fade-enter-to' : 'fade-enter-from';
});

function startTiming() {
  if (props.duration === 0) return;

  timer = setTimeout(() => {
    close();
  }, props.duration);
}

function close() {
  isClose.value = true;
  emits('close');

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function onTransitionEnd() {
  console.log('onTransitionEnd', isClose.value);
  if (!isClose.value) return;

  emits('closed');
}

function updateHeight() {
  if (!toastRef.value) return;

  height.value = toastRef.value.offsetHeight;
}

watch(toastRef, (element, oldElement) => {
  if (oldElement) {
    observer?.unobserve(oldElement);
  }

  if (element) {
    observer?.observe(element);
  }
});

onMounted(async () => {
  if (!toastRef.value) return;
  await nextTick();
  emits('mounted', toastRef.value.getBoundingClientRect().height);

  await nextTick();
  startTiming();
  isShow.value = true;
});

onScopeDispose(() => {
  if (!observer) return;

  observer.disconnect();
  observer = null;
});

defineExpose({ close, offsetBottom });
</script>

<template>
  <div
    ref="toastRef"
    :class="['toast', type, transitionName]"
    :data-id="id"
    role="alert"
    @transitionend="onTransitionEnd"
  >
    <pre>{{ message }}</pre>
  </div>
</template>

<style lang="css" scoped>
.toast {
  z-index: v-bind(zIndex);
  position: fixed;
  right: 0;
  top: 20px;
  transform: translate(100%, v-bind(translateY));
  transition-property: opacity, transform;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  padding: 12px 20px;
  border: 2px solid;
  background-color: rgba(41 34 24 / 0.9);
  white-space: pre-wrap;
  border-radius: 6px;
  font-size: 14px;
  line-height: calc(1.25 / 0.875);
  font-weight: 600;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
  pointer-events: none;
}

.toast.success {
  border-color: #00a63e;
  color: #05df72;
}

.toast.error {
  border-color: #e7000b;
  color: #ff6467;
}

.toast.warn {
  border-color: #d08700;
  color: #fcc800;
}

.fade-enter-to {
  transform: translate(-12px, v-bind(translateY));
}

.fade-leave-to {
  opacity: 0;
}
</style>
