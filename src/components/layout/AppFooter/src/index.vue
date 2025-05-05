<script setup lang="ts">
import { ref } from 'vue';
import Console from './Console.vue';
import LoadingStatus from './LoadingStatus.vue';

interface Props {
  previewWidth: string;
}

defineProps<Props>();

const isShowConsole = ref(false);

function toggleConsole() {
  isShowConsole.value = !isShowConsole.value;
}
</script>

<template>
  <div class="app-footer">
    <section class="app-footer-section">
      <button
        class="btn-small btn-base"
        @click="toggleConsole"
      >
        Console
      </button>
    </section>

    <section class="app-footer-section">
      <loading-status />
    </section>

    <console
      v-model:is-show-console="isShowConsole"
      :preview-width="previewWidth"
    />
  </div>
</template>

<style lang="css" scoped>
.app-footer {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #000000;
  width: 100%;
  height: 32px;
  padding: 0 8px;
  bottom: 0;
  z-index: 3;
}

.app-footer-section {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
