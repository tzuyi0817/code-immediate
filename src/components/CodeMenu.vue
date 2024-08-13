<script setup lang="ts">
interface Props {
  isLogin: boolean;
  codeId: string;
}

defineProps<Props>();
defineEmits(['saveCode', 'toggleSettingsPop', 'toggleProjectsPop', 'createNewProject', 'shareLink']);
</script>

<template>
  <ul class="code-menu animate-popup">
    <li @click="$emit('saveCode')">
      <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
      Save
    </li>
    <li @click="$emit('toggleSettingsPop')">
      <font-awesome-icon icon="fa-solid fa-gear" />
      Settings
    </li>
    <li
      v-if="isLogin"
      @click="$emit('toggleProjectsPop')"
    >
      <font-awesome-icon icon="fa-solid fa-sheet-plastic" />
      Projects
    </li>
    <li @click="$emit('createNewProject')">
      <font-awesome-icon icon="fa-solid fa-file-circle-plus" />
      New Project
    </li>
    <li
      v-if="codeId"
      @click="$emit('shareLink')"
    >
      <font-awesome-icon icon="fa-solid fa-share" />
      Share
    </li>
    <li>
      <a
        href="https://github.com/tzuyi0817/code-immediate"
        target="_blank"
        rel="noopener noreferrer"
      >
        <font-awesome-icon
          icon="fa-brands fa-github"
          title="fa-github"
        />
        Github
      </a>
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
.code-menu {
  @apply absolute top-11 -right-1 rounded bg-white py-2 w-44 z-[16] text-gray-600 lg:hidden;
  li {
    @apply px-3 py-1 select-none whitespace-nowrap hover:bg-gray-200 hover:cursor-pointer;
    svg {
      @apply w-6 mr-1;
    }
  }
}
</style>
