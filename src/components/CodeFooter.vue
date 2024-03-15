<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCodeContentStore } from '@/store';
import CodeConsole from '@/components/CodeConsole.vue';
import CodeLoading from '@/components/CodeLoading.vue';
import toast from '@/utils/toast';

interface Props {
  previewWidth: string;
}

defineProps<Props>();
const { codeId } = storeToRefs(useCodeContentStore());
const isShowConsole = ref(false);

function toggleConsole() {
  isShowConsole.value = !isShowConsole.value;
}

async function shareLink() {
  if (document.execCommand) {
    const textField = document.createElement('textarea');

    textField.innerText = location.href;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  } else {
    await navigator.clipboard.writeText(location.href);
  }
  toast.showToast('Copied URL to clipboard!', 'success');
}
</script>

<template>
  <div class="code_footer">
    <section class="code_footer_section">
      <button
        class="btn_small btn_base"
        @click="toggleConsole"
      >
        Console
      </button>

      <!-- <select class="select select_base">
        <option value="1">1.0x</option>
        <option value="0.5">0.5x</option>
        <option value="0.25">0.25x</option>
      </select> -->
    </section>

    <section class="code_footer_section">
      <code-loading />
      <a
        href="https://github.com/tzuyi0817/code-immediate"
        class="flex items-center"
        title="github-link"
      >
        <font-awesome-icon
          icon="fa-brands fa-github"
          class="code_footer_icon text-2xl"
        />
      </a>
      <font-awesome-icon
        v-if="codeId"
        icon="fa-solid fa-share"
        class="code_footer_icon text-xl"
        title="fa-share"
        @click="shareLink"
      />
    </section>

    <code-console
      v-model:isShowConsole="isShowConsole"
      :previewWidth="previewWidth"
    />
  </div>
</template>

<style lang="postcss" scoped>
.code_footer {
  @apply fixed
  flex
  justify-between
  items-center
  bg-black
  w-full
  h-8
  px-2
  bottom-0
  z-[3];
  &_section {
    @apply flex items-center gap-3;
  }
  &_icon {
    @apply text-[#666] transition-colors hover:text-white;
  }
}
</style>
