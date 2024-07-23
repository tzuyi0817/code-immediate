<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore, useCodeContentStore, useFlagStore } from '@/store';
import LoadingButton from '@/components/LoadingButton.vue';
import CodeMenu from '@/components/CodeMenu.vue';
import { logoutUser } from '@/apis/user';
import { postCode, putCode } from '@/apis/code';
import toast from '@/utils/toast';
import { deepClone } from '@/utils/common';
import { DEFAULT_TEMPLATE_MAP, TEMPLATE_MAP } from '@/config/template';

interface Props {
  defaultTitle: string;
}

const props = defineProps<Props>();
const title = defineModel<string>('title', { required: true });
const { isLogin } = storeToRefs(useUserStore());
const { codeId, codeTemplate } = storeToRefs(useCodeContentStore());
const isLoading = ref(false);
const isShowSettingsPop = ref(false);
const isShowTemplatePop = ref(false);
const isShowMenuList = ref(false);
const isShowLoginPop = ref(false);
const isShowSignUpPop = ref(false);
const isShowProjectsPop = ref(false);
const isShowRemindPop = ref(false);
const doFun = ref<(() => void) | null>(null);
const SettingsPopup = defineAsyncComponent(() => import('@/components/SettingsPopup.vue'));
const TemplatePopup = defineAsyncComponent(() => import('@/components/TemplatePopup.vue'));
const LoginPopup = defineAsyncComponent(() => import('@/components/LoginPopup.vue'));
const SignUpPopup = defineAsyncComponent(() => import('@/components/SignUpPopup.vue'));
const ProjectsPopup = defineAsyncComponent(() => import('@/components/ProjectsPopup.vue'));
const RemindPopup = defineAsyncComponent(() => import('@/components/RemindPopup.vue'));

async function logout() {
  isLoading.value = true;
  const { status, message } = await logoutUser().finally(() => {
    isLoading.value = false;
  });
  const { setUser } = useUserStore();

  setUser({});
  createNewProject();
  window.localStorage.removeItem('code_token');
  toast.showToast(message, status);
}

async function saveCode() {
  if (isLoading.value) return;
  closeMenuList();
  if (!isLogin.value) return toggleLoginPop();

  const { codeContent, codeTemplate: template, codeId: id, setCodeId } = useCodeContentStore();
  const data = {
    title: title.value,
    ...codeContent,
    codeTemplate: template,
  };
  const api = id ? putCode(id, data) : postCode(data);

  isLoading.value = true;
  const { status, message, resultMap } = await api.finally(() => (isLoading.value = false));
  const { setChangeCodeFlag } = useFlagStore();

  resultMap && setCodeId(resultMap.code._id);
  setChangeCodeFlag(false);
  toast.showToast(message, status);
}

function createNewProject() {
  const { setCreateProjectFlag, setLoading, isChangeCode } = useFlagStore();

  if (isChangeCode) return openRemindPop(createNewProject);

  const { setCodeMap, setCodeTemplate, setCodeTitle, setCodeId } = useCodeContentStore();
  const defaultTemplate = deepClone(DEFAULT_TEMPLATE_MAP);

  setLoading({ isOpen: true, type: 'Create new project' });
  setCreateProjectFlag(true);
  Object.assign(TEMPLATE_MAP, defaultTemplate);
  setCodeMap(defaultTemplate.ES6);
  setCodeTemplate('ES6');
  setCodeTitle(props.defaultTitle);
  setCodeId('');
  title.value = props.defaultTitle;
}

function openRemindPop(fun: () => void) {
  doFun.value = fun;
  isShowRemindPop.value = true;
}

function toggleSignUpPop() {
  isShowSignUpPop.value = !isShowSignUpPop.value;
}

function toggleLoginPop() {
  isShowLoginPop.value = !isShowLoginPop.value;
}

function toggleSettingsPop() {
  isShowSettingsPop.value = !isShowSettingsPop.value;
}

function toggleTemplatePop() {
  isShowTemplatePop.value = !isShowTemplatePop.value;
}

function toggleProjectsPop() {
  isShowProjectsPop.value = !isShowProjectsPop.value;
}

function toggleMenuList() {
  isShowMenuList.value = !isShowMenuList.value;
}

function closeMenuList() {
  isShowMenuList.value = false;
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

function onWindow() {
  window.addEventListener('click', closeMenuList);
  window.addEventListener('blur', closeMenuList);
}

function unWindow() {
  window.removeEventListener('click', closeMenuList);
  window.removeEventListener('blur', closeMenuList);
}

onMounted(onWindow);
onBeforeUnmount(unWindow);
</script>

<template>
  <div class="code-feature">
    <button
      class="btn btn_base lg:hidden"
      @click.stop="toggleMenuList"
    >
      <font-awesome-icon
        icon="fa-solid fa-bars-staggered"
        title="fa-bars-staggered"
      />
    </button>

    <span
      class="code-feature-template"
      @click="toggleTemplatePop"
    >
      {{ codeTemplate }}
    </span>

    <font-awesome-icon
      :icon="`fa-solid ${isLoading ? 'fa-spinner' : 'fa-cloud-arrow-up'}`"
      title="fa-cloud-arrow-up"
      :class="['svg-icon text-lg hidden lg:block', { 'animate-spin cursor-not-allowed': isLoading }]"
      @click="saveCode"
    />

    <font-awesome-icon
      icon="fa-solid fa-gear"
      title="fa-gear"
      class="svg-icon text-lg hidden lg:block"
      @click="toggleSettingsPop"
    />

    <font-awesome-icon
      icon="fa-solid fa-file-circle-plus"
      title="fa-file-circle-plus"
      class="svg-icon text-lg hidden lg:block"
      @click="createNewProject"
    />

    <font-awesome-icon
      v-if="isLogin"
      icon="fa-solid fa-sheet-plastic"
      title="fa-sheet-plastic"
      class="svg-icon text-xl hidden lg:block"
      @click="toggleProjectsPop"
    />

    <font-awesome-icon
      v-if="codeId"
      icon="fa-solid fa-share"
      class="svg-icon text-xl hidden lg:block"
      title="fa-share"
      @click="shareLink"
    />

    <a
      href="https://github.com/tzuyi0817/code-immediate"
      target="_blank"
      rel="noopener noreferrer"
      class="hidden items-center lg:flex"
      title="github-link"
    >
      <font-awesome-icon
        icon="fa-brands fa-github"
        class="svg-icon text-[20px]"
      />
    </a>

    <loading-button
      v-if="isLogin"
      class="btn_red w-auto text-xs"
      @click="logout"
      :isLoading="isLoading"
    >
      LOGOUT
    </loading-button>

    <template v-else>
      <div class="flex gap-1 lg:gap-2">
        <button
          class="btn btn_yellow"
          @click="toggleSignUpPop"
        >
          SIGNUP
        </button>
        <button
          class="btn btn_green"
          @click="toggleLoginPop"
        >
          LOGIN
        </button>
      </div>
    </template>

    <code-menu
      v-if="isShowMenuList"
      :is-login="isLogin"
      :code-id="codeId"
      @save-code="saveCode"
      @toggle-settings-pop="toggleSettingsPop"
      @toggle-projects-pop="toggleProjectsPop"
      @create-new-project="createNewProject"
      @share-link="shareLink"
    />
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
</template>

<style lang="postcss" scoped>
.code-feature {
  @apply relative flex items-center min-w-fit gap-1 lg:gap-5;
  &-template {
    @apply text-xs
    text-yellow-400
    select-none
    font-mono
    font-semibold
    cursor-pointer
    transition-[colors_transform]
    border
    border-yellow-400
    rounded
    py-0.5
    px-1.5
    hover:brightness-110
    active:scale-90;
  }
}
</style>
