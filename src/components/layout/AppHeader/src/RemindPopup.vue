<script setup lang="ts">
import { ref } from 'vue';
import { LoadingButton, Popup } from '@/components/common';
import { useFlagStore } from '@/store';

interface Props {
  saveCode: () => Promise<void>;
  doFun: (() => void) | null;
}

const isLoading = ref(false);
const { saveCode, doFun } = defineProps<Props>();
const isShowRemindPop = defineModel<boolean>({ default: false });

async function confirm() {
  isLoading.value = true;
  await saveCode();
  isLoading.value = false;
  closePopup();
  doFun?.();
}

function cancel() {
  const { setChangeCodeFlag } = useFlagStore();

  closePopup();
  setChangeCodeFlag(false);
  doFun?.();
}

function closePopup() {
  isShowRemindPop.value = false;
}
</script>

<template>
  <popup
    v-model="isShowRemindPop"
    class="remind-popup text-center"
    :disabled-close="isLoading"
  >
    <template #header>Remind</template>

    <template #content>
      <div class="py-16">
        <p>The current code will be cleared.</p>
        <p>Do you need the system to help you save the project?</p>
      </div>

      <div class="flex justify-end gap-2">
        <button
          class="btn btn-gray text-sm"
          :disabled="isLoading"
          @click="cancel"
        >
          cancel
        </button>
        <loading-button
          class="btn btn-yellow w-auto"
          :is-loading="isLoading"
          @click="confirm"
        >
          confirm
        </loading-button>
      </div>
    </template>
  </popup>
</template>
