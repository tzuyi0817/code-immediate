<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useTemplateRef, watch, type HtmlHTMLAttributes } from 'vue';
import { POPUP_ANIMATION_KEYFRAME, POPUP_ANIMATION_OPTIONS } from './constants';

interface Props {
  disabledClose?: boolean;
  contentAttrs?: HtmlHTMLAttributes;
}

interface Emits {
  open: [];
  close: [];
  closed: [];
}

defineOptions({ name: 'Popup', inheritAttrs: false });

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const isShowPopup = defineModel<boolean>({ default: false });
const containerRef = useTemplateRef('containerRef');
const isDisplayPopup = ref(false);
let animation: Animation | undefined;

async function openPopup() {
  isDisplayPopup.value = true;

  await nextTick();
  if (!containerRef.value) return;

  animation = containerRef.value.animate(POPUP_ANIMATION_KEYFRAME, POPUP_ANIMATION_OPTIONS);
  animation?.play();
  emits('open');
}

function closePopup() {
  if (!animation) return;

  emits('close');
  animation.onfinish = () => {
    destroyAnimation();
    isDisplayPopup.value = false;
    emits('closed');
  };
  animation.reverse();
}

function destroyAnimation() {
  if (!animation) return;

  animation.cancel();
  animation = undefined;
}

watch(
  () => isShowPopup.value,
  isShow => {
    animation?.pause();

    if (isShow) {
      openPopup();
    } else {
      closePopup();
    }
  },
  { immediate: true },
);

function manualClosePopup() {
  if (props.disabledClose) return;

  isShowPopup.value = false;
}

onBeforeUnmount(() => {
  destroyAnimation();
});
</script>

<template>
  <teleport to="body">
    <div
      class="popup"
      role="dialog"
    >
      <template v-if="isDisplayPopup">
        <div
          class="popup-overlay"
          role="presentation"
          @click="manualClosePopup"
        ></div>

        <div
          ref="containerRef"
          class="popup-container"
          v-bind="$attrs"
        >
          <div class="popup-header">
            <h3><slot name="header"></slot></h3>

            <font-awesome-icon
              icon="fa-solid fa-xmark"
              class="popup-close"
              :class="{ disabled: disabledClose }"
              title="fa-xmark"
              @click.stop="manualClosePopup"
            />
          </div>

          <div
            class="popup-content"
            v-bind="contentAttrs"
          >
            <slot name="content"></slot>
          </div>
        </div>
      </template>
    </div>
  </teleport>
</template>

<style scoped lang="css">
.popup {
  position: fixed;
  user-select: none;
  z-index: 20;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.popup-container {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 90%;
  max-width: 576px;
  border-radius: 6px;
  overflow: hidden;
  filter: drop-shadow(0 4px 4px rgb(0 0 0 / 0.15));
  transform: translate(-50%, -50%);
}

.popup-header {
  width: 100%;
  text-align: center;
  background-color: #fcc800;
  padding: 12px;
  position: relative;

  .popup-close {
    position: absolute;
    cursor: pointer;
    top: 50%;
    right: 12px;
    font-size: 16px;
    line-height: 1.5;
    transform: translateY(-50%);
    transition-property: color transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }

  .popup-close.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .popup-close:not(.disabled):hover {
    color: #4a5565;
  }

  .popup-close:not(.disabled):active {
    transform: translateY(-50%) scale(0.8);
  }
}

.popup-content {
  padding: 16px;
  width: 100%;
  max-height: 60dvh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}
</style>
