<script setup lang="ts">
interface Props {
  isLogin: boolean;
  codeId: string;
}

interface Emits {
  saveCode: [];
  toggleSettingsPop: [];
  toggleProjectsPop: [];
  createNewProject: [];
  shareLink: [];
}

defineProps<Props>();
defineEmits<Emits>();

const isShowMenuList = defineModel<boolean>({ default: false });
</script>

<template>
  <transition name="fade">
    <ul
      v-if="isShowMenuList"
      class="app-header-menu"
    >
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
  </transition>
</template>

<style lang="css" scoped>
.app-header-menu {
  position: absolute;
  top: 34px;
  right: -4px;
  border-radius: 4px;
  background-color: #ffffff;
  padding: 8px 0;
  width: 176px;
  z-index: 16;
  color: #4a5565;

  li {
    padding: 4px 12px;
    user-select: none;
    white-space: nowrap;

    svg {
      width: 24px;
      margin-right: 4px;
    }
  }

  li:hover {
    background-color: #e5e7eb;
  }
}

@media (min-width: 1024px) {
  .app-header-menu {
    display: none;
  }
}
</style>
