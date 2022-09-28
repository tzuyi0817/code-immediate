<script setup lang="ts">
import { inject, Ref, onMounted } from 'vue';

interface Props {
  isShowConsole: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:isShowConsole']);
const iframe: Ref = inject('iframe')!;

function implementJs(event: Event) {
  const { value } = event.target as HTMLTextAreaElement;

  iframe.value.contentWindow.postMessage('command', value.trim());
}

function receiveMessage(event: MessageEvent) {
  console.log(event);
}

onMounted(() => {
  self.addEventListener('message', receiveMessage);
});
</script>

<template>
  <div class="code_console" v-show="isShowConsole">
    <div class="code_console_header">
      <p class="text-gray-400 text-sm font-bold">Console</p>

      <div class="flex gap-1">
        <button class="btn btn_base h-5">Clear</button>
        <button 
          class="btn btn_base h-5"
          @click="emit('update:isShowConsole', false)"
        >X</button>
      </div>
    </div>

    <div class="code_console_wrap"></div>
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

<style lang="postcss" scoped>
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