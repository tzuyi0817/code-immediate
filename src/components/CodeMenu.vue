<script setup lang="ts">
interface Props {
  isLogin: boolean;
  codeId: string;
}

defineProps<Props>();
defineEmits(['save-code', 'toggle-settings-pop', 'toggle-projects-pop', 'create-new-project', 'share-link']);
</script>

<template>
  <ul class="code-menu animate-popup">
    <li @click="$emit('save-code')">
      <font-awesome-icon
        icon="fa-solid fa-cloud-arrow-up"
        title="fa-cloud-arrow-up"
      />
      Save
    </li>
    <li @click="$emit('toggle-settings-pop')">
      <font-awesome-icon
        icon="fa-solid fa-gear"
        title="fa-gear"
      />
      Settings
    </li>
    <li
      v-if="isLogin"
      @click="$emit('toggle-projects-pop')"
    >
      <font-awesome-icon
        icon="fa-solid fa-sheet-plastic"
        title="fa-sheet-plastic"
      />
      Projects
    </li>
    <li @click="$emit('create-new-project')">
      <font-awesome-icon
        icon="fa-solid fa-file-circle-plus"
        title="fa-solid fa-file-circle-plus"
      />
      New Project
    </li>
    <li
      v-if="codeId"
      @click="$emit('share-link')"
    >
      <font-awesome-icon
        icon="fa-solid fa-share"
        title="fa-share"
      />
      Share
    </li>
    <li>
      <a
        href="https://github.com/tzuyi0817/code-immediate"
        target="_blank"
        rel="noopener noreferrer"
        title="github-link"
      >
        <font-awesome-icon icon="fa-brands fa-github" />
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
