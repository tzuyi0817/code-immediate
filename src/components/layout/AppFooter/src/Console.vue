<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { inject, nextTick, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef, watch, type Ref } from 'vue';
import { Drag, showToast } from '@/components/common';
import { useCodeContentStore, useFlagStore } from '@/store';

interface Props {
  previewWidth: string;
}
type ReceiveData = { type: string; html: string; message: string }[];

const { previewWidth } = defineProps<Props>();
const isShowConsole = defineModel<boolean>('isShowConsole', { required: true });
const consoleCode = reactive<ReceiveData>([]);
const codeWrapRef = useTemplateRef<HTMLDivElement>('codeWrap');
const consoleHeight = ref('30vh');
const iframeRef: Ref<HTMLIFrameElement> | undefined = inject('iframeRef');
const { codeId } = storeToRefs(useCodeContentStore());
const { isCreateProject } = storeToRefs(useFlagStore());

function implementJs(event: Event) {
  const target = event.target as HTMLTextAreaElement;

  iframeRef?.value?.contentWindow?.postMessage(
    {
      type: 'command',
      value: target.value.trim(),
    },
    '*',
  );
  target.value = '';
}

function receiveMessage(event: MessageEvent) {
  const { data } = event;
  const { type } = data;

  if (type === undefined) return;
  if (type === 'error' || type === 'warn') {
    showToast({ message: data.message, type });
  }
  consoleCode.push(data);
  wrapScrollToBottom();
}

function clearConsole() {
  consoleCode.length = 0;
}

async function wrapScrollToBottom() {
  await nextTick();
  const scroller = codeWrapRef.value;

  if (!scroller) return;
  scroller.scrollTop = scroller.scrollHeight;
}

watch([isCreateProject, codeId], clearConsole);
watch(isShowConsole, wrapScrollToBottom);
onMounted(() => window.addEventListener('message', receiveMessage));
onBeforeUnmount(() => window.removeEventListener('message', receiveMessage));
</script>

<template>
  <div
    v-show="isShowConsole"
    class="console w-full drag-height preview-width"
  >
    <drag
      v-model:drag-b="consoleHeight"
      class="console-header"
      direction="y"
      unit="vh"
      :limit="{ min: 8, max: 80 }"
    >
      <p class="text-gray-400 text-sm font-bold">Console</p>

      <div class="flex gap-1">
        <button
          class="btn btn-base h-5"
          @click="clearConsole"
        >
          Clear
        </button>
        <button
          class="btn btn-base h-5"
          @click="isShowConsole = false"
        >
          X
        </button>
      </div>
    </drag>

    <div
      ref="codeWrap"
      class="console-wrap"
    >
      <template
        v-for="({ type, html }, index) in consoleCode"
        :key="index"
      >
        <pre
          v-if="type === 'echo'"
          class="console-message echo"
          >{{ html }}</pre
        >
        <pre
          v-else-if="type === 'log'"
          class="console-message log"
          v-html="html"
        ></pre>
        <pre
          v-else-if="type === 'warn'"
          class="console-message warn"
          v-html="html"
        ></pre>
        <pre
          v-else-if="type === 'error'"
          class="console-message error"
          v-html="html"
        ></pre>
        <pre
          v-else
          class="console-message"
          v-html="html"
        ></pre>
      </template>
    </div>

    <div class="console-command">
      <font-awesome-icon
        icon="fa-solid fa-angle-down"
        aria-label="fa-angle-down"
        :aria-hidden="false"
        class="text-xs rotate-[270deg] text-gray-300 px-2"
      />
      <textarea
        class="flex-1 bg-transparent text-gray-300 focus:outline-none text-sm font-mono"
        rows="1"
        @keydown.enter.prevent="implementJs"
      ></textarea>
    </div>
  </div>
</template>

<style lang="css">
.console {
  position: absolute;
  height: calc(60dvh - 88px);
  right: 0;
  bottom: 32px;
}

.console-header {
  height: 40px;
  border: 1px solid rgb(54 65 83 / 0.6);
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
}

.console-wrap {
  background-color: rgb(0 0 0 / 0.9);
  height: calc(100% - 72px);
  overflow-y: auto;
}

.console-message {
  border-bottom: 2px solid rgb(54 65 83 / 0.6);
  padding: 12px 12px 4px;
  font-size: 14px;
  line-height: calc(1.25 / 0.875);
  color: #ffffff;
  white-space: pre-wrap;

  .html {
    .symbol {
      color: #808080;
    }
    .tag {
      color: #569cd6;
    }
    .string {
      color: #ce9178;
    }
    .attribute {
      color: #9cdcfe;
    }
  }
}

.console-message.echo {
  background-color: rgb(255 255 255 / 0.07);
}

.console-message.log {
  .number {
    color: #b5cea8;
  }
  .string {
    color: #ce9178;
  }
  .atom {
    color: rgb(255 184 106 / 0.8);
  }
  .key {
    color: #9cdcfe;
  }
  .var {
    color: #569cd6;
  }
  .def {
    color: #dcdcaa;
  }
}

.console-message.error {
  background-color: rgb(193 0 7 / 0.4);
}

.console-message.warn {
  background-color: rgb(255 223 32 / 0.2);
  color: #fff085;
}

.console-command {
  background-color: rgb(0 0 0 / 0.8);
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 32px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}

@media (min-width: 1024px) {
  .console.preview-width {
    width: calc(v-bind(previewWidth) - 18px);
  }

  .console.drag-height {
    height: v-bind(consoleHeight);
  }
}
</style>
