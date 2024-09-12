<script setup lang="ts">
import { ref, reactive, inject, Ref, watch, useTemplateRef, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore, useFlagStore } from '@/store';
import CodeDrag from '@/components/CodeDrag.vue';
import { toast } from '@/utils/toast';

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

  iframeRef?.value.contentWindow?.postMessage(
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
    toast.showToast(data.message, type);
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
    class="code_console w-full drag_height preview_width"
  >
    <code-drag
      v-model:drag-b="consoleHeight"
      class="code_console_header"
      direction="y"
      unit="vh"
      :limit="{ min: 8, max: 80 }"
    >
      <p class="text-gray-400 text-sm font-bold">Console</p>

      <div class="flex gap-1">
        <button
          class="btn btn_base h-5"
          @click="clearConsole"
        >
          Clear
        </button>
        <button
          class="btn btn_base h-5"
          @click="isShowConsole = false"
        >
          X
        </button>
      </div>
    </code-drag>

    <div
      ref="codeWrap"
      class="code_console_wrap"
    >
      <template
        v-for="({ type, html }, index) in consoleCode"
        :key="index"
      >
        <pre
          v-if="type === 'echo'"
          class="code_console_message echo"
          >{{ html }}</pre
        >
        <pre
          v-else-if="type === 'log'"
          class="code_console_message log"
          v-html="html"
        ></pre>
        <pre
          v-else-if="type === 'warn'"
          class="code_console_message warn"
          v-html="html"
        ></pre>
        <pre
          v-else-if="type === 'error'"
          class="code_console_message error"
          v-html="html"
        ></pre>
        <pre
          v-else
          class="code_console_message"
          v-html="html"
        ></pre>
      </template>
    </div>

    <div class="code_console_command">
      <font-awesome-icon
        icon="fa-solid fa-angle-down"
        title="fa-angle-down"
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

<style lang="postcss">
.code_console {
  @apply absolute h-[calc(60vh-88px)] right-0 bottom-8;

  &.preview_width {
    @media (min-width: 1024px) {
      width: calc(v-bind('previewWidth') - 18px);
    }
  }
  &.drag_height {
    @media (min-width: 1024px) {
      height: v-bind(consoleHeight);
    }
  }
  &_header {
    @apply h-10
    border-gray-700/60
    bg-black
    flex
    items-center
    justify-between
    px-3;
  }
  &_wrap {
    @apply bg-black/90
    h-[calc(100%-72px)]
    overflow-y-auto;
  }
  &_message {
    @apply border-b-2
    border-gray-700/60
    px-3
    pt-3
    pb-1
    text-sm
    text-white
    whitespace-pre-wrap;
    &.echo {
      @apply bg-white/[0.07];
    }
    &.log {
      .number {
        @apply text-[#b5cea8];
      }
      .string {
        @apply text-[#ce9178];
      }
      .atom {
        @apply text-orange-300/80;
      }
      .key {
        @apply text-[#9cdcfe];
      }
      .var {
        @apply text-[#569cd6];
      }
      .def {
        @apply text-[#dcdcaa];
      }
    }
    &.error {
      @apply bg-red-700/40;
    }
    &.warn {
      @apply bg-yellow-300/20 text-yellow-200;
    }
    .html {
      .symbol {
        @apply text-[#808080];
      }
      .tag {
        @apply text-[#569cd6];
      }
      .string {
        @apply text-[#ce9178];
      }
      .attribute {
        @apply text-[#9cdcfe];
      }
    }
  }
  &_command {
    @apply bg-black/80 flex items-center px-2 h-8 shadow-md;
  }
}
</style>
