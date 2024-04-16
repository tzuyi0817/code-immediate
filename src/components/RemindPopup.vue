<script setup lang="ts">
import { ref } from 'vue';
import { useFlagStore } from '@/store';
import LoadingButton from '@/components/LoadingButton.vue';

interface Props {
  saveCode: () => void;
  doFun: (() => void) | null;
}

const isLoading = ref(false);
const props = defineProps<Props>();
const emit = defineEmits(['update:isShowRemindPop']);

async function confirm() {
  const { saveCode, doFun } = props;
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
  props.doFun?.();
}

function closePopup() {
  emit('update:isShowRemindPop', false);
}
</script>

<template>
  <div
    class="remind_popup popup"
    @click.self="closePopup"
  >
    <div class="popup_header">
      <h3>Remind</h3>
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        title="fa-xmark"
        class="cursor-pointer"
        @click="closePopup"
      />
    </div>

    <div class="popup_content text-center">
      <div class="py-16">
        <p>The current code will be cleared.</p>
        <p>Do you need the system to help you save the project?</p>
      </div>

      <div class="flex gap-2 justify-end">
        <button
          class="btn btn_red text-sm"
          @click="cancel"
        >
          cancel
        </button>
        <loading-button
          class="btn btn_yellow w-auto"
          :isLoading="isLoading"
          @click="confirm"
        >
          confirm
        </loading-button>
      </div>
    </div>
  </div>
</template>
