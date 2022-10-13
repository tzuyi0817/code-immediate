<script setup lang="ts">
import {
  ref,
  reactive,
  inject,
  Ref,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from 'vue';

interface Props {
  isShowConsole: boolean;
}
type ReceiveData = { type: string, data: string }[];

const props = defineProps<Props>();
const emit = defineEmits(['update:isShowConsole']);
const consoleCode = reactive<ReceiveData>([]);
const codeWrap = ref();
const iframe: Ref<HTMLIFrameElement> | undefined = inject('iframe');

function implementJs(event: Event) {
  const { value } = event.target as HTMLTextAreaElement;

  iframe?.value.contentWindow?.postMessage({
    type: 'command',
    value: value.trim(),
  });
  (event.target as HTMLTextAreaElement).value = '';
}

function receiveMessage(event: MessageEvent) {
  const { data } = event
  if (data.type === void 0) return;
  consoleCode.push(data);
  // console.log(data)
  wrapScrollToBottom();
}

function clearConsole() {
  consoleCode.length = 0;
}

async function wrapScrollToBottom() {
  await nextTick();
  const scroller = codeWrap.value;
  if (!scroller) return;
  scroller.scrollTop = scroller.scrollHeight;
}

watch(() => props.isShowConsole, (isShow) => isShow && wrapScrollToBottom());
onMounted(() => self.addEventListener('message', receiveMessage));
onBeforeUnmount(() => self.removeEventListener('message', receiveMessage));
</script>

<template>
  <div class="code_console" v-show="isShowConsole">
    <div class="code_console_header">
      <p class="text-gray-400 text-sm font-bold">Console</p>

      <div class="flex gap-1">
        <button class="btn btn_base h-5" @click="clearConsole">Clear</button>
        <button 
          class="btn btn_base h-5"
          @click="emit('update:isShowConsole', false)"
        >X</button>
      </div>
    </div>

    <div class="code_console_wrap" ref="codeWrap">
      <template v-for="({ type, data }, index) in consoleCode" :key="index">
        <pre v-if="type === 'echo'" class="code_console_message echo">{{ data }}</pre>
        <pre v-else-if="type === 'log'" class="code_console_message log" v-html="data"></pre>
        <pre v-else-if="type === 'error'" class="code_console_message error" v-html="data"></pre>
      </template>
    </div>
  
    <div class="code_console_command">
      <font-awesome-icon 
        icon="fa-solid fa-angle-down" 
        class="text-xs rotate-[270deg] text-gray-300 px-2"
      />
      <textarea
        class="flex-1 bg-transparent text-gray-300 focus:outline-none text-sm"
        rows="1"
        @keydown.enter.prevent="implementJs"
      ></textarea>
    </div>
  </div>
</template>

<style lang="postcss">
.code_console {
  @apply
  absolute
  w-full
  h-[calc(60vh-88px)]
  bottom-8;
  &_header {
    @apply
    h-10
    border-gray-700/60
    bg-black
    flex
    items-center
    justify-between
    px-3
  }
  &_wrap {
    @apply
    bg-black/90
    h-[calc(100%-72px)]
    overflow-y-scroll
  }
  &_message {
    @apply
    border-b-2
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
        @apply text-orange-500;
      }
      .string {
        @apply text-gray-400;
      }
      .atom {
        @apply text-orange-300/80;
      }
      .key {
        @apply text-yellow-400;
      }
    }
    &.error {
      @apply 
      bg-red-700/40;
    }
  }
  &_command {
    @apply
    bg-black/80
    flex
    items-center
    px-2
    h-8;
  }
}
</style>