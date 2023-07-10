<script setup lang="ts">
import { ref, nextTick, watch, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore, useCodeContentStore, useFlagStore } from '@/store';
import LoadingButton from '@/components/LoadingButton.vue';
import { logoutUser } from '@/apis/user';
import { postCode, putCode } from '@/apis/code';
import toast from '@/utils/toast';
import { deepClone } from '@/utils/common';
import { DEFAULT_TEMPLATE_MAP, TEMPLATE_MAP } from '@/config/template';

const DEFAULT_TITLE = 'Untitled';
const title = ref(DEFAULT_TITLE);
const titleInput = ref<HTMLInputElement | null>(null);
const isLoading = ref(false);
const isShowEditTitle = ref(false);
const isShowSettingsPop = ref(false);
const isShowTemplatePop = ref(false);
const isShowMenuList = ref(false);
const isShowLoginPop = ref(false);
const isShowSignUpPop = ref(false);
const isShowProjectsPop = ref(false);
const isShowRemindPop = ref(false);
const doFun = ref<Function | null>(null);
const SettingsPopup = defineAsyncComponent(() => import('@/components/SettingsPopup.vue'));
const TemplatePopup = defineAsyncComponent(() => import('@/components/TemplatePopup.vue'));
const LoginPopup = defineAsyncComponent(() => import('@/components/LoginPopup.vue'));
const SignUpPopup = defineAsyncComponent(() => import('@/components/SignUpPopup.vue'));
const ProjectsPopup = defineAsyncComponent(() => import('@/components/ProjectsPopup.vue'));
const RemindPopup = defineAsyncComponent(() => import('@/components/RemindPopup.vue'));
const { user, isLogin } = storeToRefs(useUserStore());
const { codeTitle } = storeToRefs(useCodeContentStore());

async function logout() {
  isLoading.value = true;
  const { status, message } = await logoutUser().catch(() => isLoading.value = false);
  const { setUser } = useUserStore();

  setUser({});
  newProject();
  localStorage.removeItem('code_token');
  toast.showToast(message, status);
  isLoading.value = false;
}

function blurTitle() {
  isShowEditTitle.value = false;
  if (title.value === '')
    title.value = DEFAULT_TITLE;
}

async function openTitle() {
  isShowEditTitle.value = true;
  if (title.value === DEFAULT_TITLE) title.value = '';
  await nextTick();
  titleInput.value?.focus();
}

async function saveCode() {
  closeMenuList();
  if (!isLogin.value) return toggleLoginPop();
  const { codeContent, codeTemplate, codeId, setCodeId } = useCodeContentStore();
  const data = {
    title: title.value,
    ...codeContent,
    codeTemplate,
  };
  const api = codeId ? putCode(codeId, data) : postCode(data);
  
  isLoading.value = true;
  const { status, message, resultMap } = await api.catch(() => isLoading.value = false);
  const { setChangeCodeFlag } = useFlagStore();

  resultMap && setCodeId(resultMap.code._id);
  setChangeCodeFlag(false);
  toast.showToast(message, status);
  isLoading.value = false;
}

function newProject() {
  const { setCreateProjectFlag, setLoading, isChangeCode } = useFlagStore();
  if (isChangeCode) return openRemindPop(newProject);
  const { setCodeMap, setCodeTemplate, setCodeTitle, setCodeId } = useCodeContentStore();
  const defaultTemplate = deepClone(DEFAULT_TEMPLATE_MAP);

  closeMenuList();
  setLoading({ isOpen: true, type: 'Create new project' });
  setCreateProjectFlag(true);
  Object.assign(TEMPLATE_MAP, defaultTemplate);
  setCodeMap(defaultTemplate.ES6);
  setCodeTemplate('ES6');
  setCodeTitle(DEFAULT_TITLE);
  setCodeId('');
  title.value = DEFAULT_TITLE;
}

function openRemindPop(fun: Function) {
  doFun.value = fun;
  isShowRemindPop.value = true;
}

function toggleSignUpPop() {
  closeMenuList();
  isShowSignUpPop.value = !isShowSignUpPop.value;
}

function toggleLoginPop() {
  closeMenuList();
  isShowLoginPop.value = !isShowLoginPop.value;
}

function toggleSettingsPop() {
  closeMenuList();
  isShowSettingsPop.value = !isShowSettingsPop.value;
}

function toggleTemplatePop() {
  closeMenuList();
  isShowTemplatePop.value = !isShowTemplatePop.value;
}

function toggleProjectsPop() {
  closeMenuList();
  isShowProjectsPop.value = !isShowProjectsPop.value;
}

function toggleMenuList() {
  isShowMenuList.value = !isShowMenuList.value;
}

function closeMenuList() {
  isShowMenuList.value = false;
}

watch(codeTitle, (projectTitle) => title.value = projectTitle);
</script>

<template>
  <header class="code_header">
    <div class="code_header_left">
      <img src="/icon.jpg" class="w-7 h-7 invert basis-7 shrink-0" alt="" />
      <div class="w-[calc(100%-36px)]">
        <div class="font-bold flex items-center gap-1 w-full">
          <input
            v-if="isShowEditTitle"
            type="text"
            ref="titleInput"
            class="w-full bg-black text-white focus:outline-none"
            v-model="title"
            @blur="blurTitle"
          />
          <template v-else>
            <p class="max-w-[calc(100%-16px)] text_ellipsis">{{ title }}</p>
            <font-awesome-icon
              icon="fa-solid fa-pen-fancy"
              title="fa-pen-fancy"
              class="cursor-pointer"
              @click="openTitle"
            />
          </template>
        </div>
        <p class="text-xs text-gray-300 text_ellipsis">
          {{ isLogin ? user.account : 'Captain Anonymous' }}
        </p>
      </div>
    </div>

    <div class="code_header_right">
      <button class="btn btn_base lg:hidden">
        <font-awesome-icon icon="fa-solid fa-bars-staggered" title="fa-bars-staggered" @click="toggleMenuList" />
      </button>

      <loading-button
        class="btn_base w-auto text-xs hidden lg:block"
        @click="saveCode"
        :isLoading="isLoading"
      >
        <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" title="fa-cloud-arrow-up"  class="mr-1" /> Save
      </loading-button>
      <button class="btn btn_base hidden lg:block" @click="toggleSettingsPop">
        <font-awesome-icon icon="fa-solid fa-gear" title="fa-gear" class="mr-1" /> Settings
      </button>
      <button class="btn btn_base hidden lg:block" @click="toggleTemplatePop">
        <font-awesome-icon icon="fa-brands fa-centos" title="fa-centos" class="mr-1" /> Template
      </button>
      <button class="btn btn_indigo hidden lg:block" @click="newProject">
        <font-awesome-icon
          icon="fa-solid fa-file-circle-plus"
          title="fa-file-circle-plus"
          class="mr-1"
        /> New Project
      </button>

      <template v-if="isLogin">
        <button class="btn btn_blue" @click="toggleProjectsPop">
          <font-awesome-icon
            icon="fa-solid fa-sheet-plastic"
            title="fa-sheet-plastic"
            class="mr-1"
          /> Projects
        </button>
        <loading-button
          class="btn_red w-auto text-xs" 
          @click="logout"
          :isLoading="isLoading"
        >
          <font-awesome-icon
            icon="fa-solid fa-arrow-right-from-bracket"
            title="fa-arrow-right-from-bracket"
            class="mr-1"
          /> Log out
        </loading-button>
      </template>

      <template v-else>
        <button class="btn btn_blue" @click="toggleSignUpPop">Sign up</button>
        <button class="btn btn_green" @click="toggleLoginPop">Log in</button>
      </template>

      <ul v-if="isShowMenuList" class="code_header_menu animate-popup">
        <li @click="saveCode">
          <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" title="fa-cloud-arrow-up" /> Save
        </li>
        <li @click="toggleSettingsPop">
          <font-awesome-icon icon="fa-solid fa-gear" title="fa-gear" /> Settings
        </li>
        <li @click="toggleTemplatePop">
          <font-awesome-icon icon="fa-brands fa-centos" title="fa-centos" /> Template
        </li>
        <li @click="newProject">
          <font-awesome-icon
            icon="fa-solid fa-file-circle-plus"
            title="fa-solid fa-file-circle-plus"
          /> New Project
        </li>
      </ul>
    </div>

    <projects-popup
      v-if="isShowProjectsPop"
      v-model:isShowProjectsPop="isShowProjectsPop"
      @openRemindPop="openRemindPop"
    />
    <settings-popup
      v-if="isShowSettingsPop"
      v-model:isShowSettingsPop="isShowSettingsPop"
    />
    <template-popup 
      v-if="isShowTemplatePop"
      v-model:isShowTemplatePop="isShowTemplatePop"
    />
    <login-popup
      v-if="isShowLoginPop"
      v-model:isShowLoginPop="isShowLoginPop"
    />
    <sign-up-popup
      v-if="isShowSignUpPop"
      v-model:isShowSignUpPop="isShowSignUpPop"
    />
    <remind-popup
      v-if="isShowRemindPop"
      v-model:isShowRemindPop="isShowRemindPop"
      :saveCode="saveCode"
      :doFun="doFun"
    />
  </header>
</template>

<style lang="postcss" scoped>
.code_header {
  @apply
  h-14
  p-2
  flex
  gap-2
  items-center
  justify-between
  text-sm
  border-b-2
  border-gray-700/60
  bg-black;
  &_left {
    @apply
    text-white
    flex
    items-center
    w-full
    max-w-[calc(100%-200px)]
    lg:max-w-[calc(100%-590px)]
    gap-2;
    svg {
      @apply text-xs;
    }
  }
  &_right {
    @apply
    relative
    flex
    items-center
    min-w-fit
    gap-1
    lg:gap-2;
  }
  &_menu {
    @apply
    absolute
    top-11
    -right-1
    rounded
    bg-white
    py-2
    w-44
    z-[3]
    text-gray-600
    lg:hidden;
    li {
      @apply
      px-2
      py-1
      select-none
      whitespace-nowrap
      hover:bg-gray-200
      hover:cursor-pointer;
      svg {
        @apply w-5;
      }
    }
  }
}
</style>
