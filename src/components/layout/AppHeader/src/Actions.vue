<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { LoadingButton, showToast } from '@/components/common';
import { DEFAULT_TEMPLATE_MAP, TEMPLATE_MAP } from '@/constants/template';
import { logoutUser, postCode, putCode } from '@/services/http';
import { STORAGE_TOKEN, useCodeContentStore, useFlagStore, useUserStore } from '@/store';
import { deepClone } from '@/utils/common';
import AppHeaderMenu from './Menu.vue';

interface Props {
  defaultTitle: string;
}

const { defaultTitle } = defineProps<Props>();
const title = defineModel<string>('title', { required: true });
const { isLogin } = storeToRefs(useUserStore());
const { codeId, codeTemplate } = storeToRefs(useCodeContentStore());
const isSavingCode = ref(false);
const isLoggingOut = ref(false);
const isShowSettingsPop = ref(false);
const isShowTemplatePop = ref(false);
const isShowMenuList = ref(false);
const isShowLoginPop = ref(false);
const isShowSignUpPop = ref(false);
const isShowProjectsPop = ref(false);
const isShowRemindPop = ref(false);
const doFun = ref<(() => void) | null>(null);
const SettingsPopup = defineAsyncComponent(() => import('./SettingsPopup.vue'));
const TemplatePopup = defineAsyncComponent(() => import('./TemplatePopup.vue'));
const LoginPopup = defineAsyncComponent(() => import('./LoginPopup.vue'));
const SignUpPopup = defineAsyncComponent(() => import('./SignUpPopup.vue'));
const ProjectsPopup = defineAsyncComponent(() => import('./ProjectsPopup.vue'));
const RemindPopup = defineAsyncComponent(() => import('./RemindPopup.vue'));

async function logout() {
  isLoggingOut.value = true;

  const { status, message } = await logoutUser().finally(() => {
    isLoggingOut.value = false;
  });
  const { setUser } = useUserStore();

  setUser({});
  createNewProject();
  window.localStorage.removeItem(STORAGE_TOKEN);
  showToast({ message, type: status });
}

async function saveCode() {
  if (isSavingCode.value || isLoggingOut.value) return;

  closeMenuList();

  if (!isLogin.value) return toggleLoginPop();

  const { codeContent, codeTemplate: template, codeId: id, setCodeId } = useCodeContentStore();
  const data = {
    title: title.value,
    ...codeContent,
    codeTemplate: template,
  };
  const api = id ? putCode(id, data) : postCode(data);

  isSavingCode.value = true;

  const { status, message, resultMap } = await api.finally(() => (isSavingCode.value = false));
  const { setChangeCodeFlag } = useFlagStore();

  if (resultMap) {
    setCodeId(resultMap.code._id);
  }
  setChangeCodeFlag(false);
  showToast({ message, type: status });
}

function createNewProject() {
  const { setCreateProjectFlag, setLoading, isChangeCode } = useFlagStore();

  if (isChangeCode) return openRemindPop(createNewProject);

  const { setCodeMap, setCodeTemplate, setCodeId } = useCodeContentStore();
  const defaultTemplate = deepClone(DEFAULT_TEMPLATE_MAP);

  setLoading({ isOpen: true, type: 'Create new project' });
  setCreateProjectFlag(true);
  Object.assign(TEMPLATE_MAP, defaultTemplate);
  setCodeMap(defaultTemplate.ES6);
  setCodeTemplate('ES6');
  setCodeId('');
  title.value = defaultTitle;
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

    textField.textContent = location.href;
    document.body.append(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  } else {
    await navigator.clipboard.writeText(location.href);
  }
  showToast({ message: 'Copied URL to clipboard!', type: 'success' });
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
  <div class="app-header-actions">
    <button
      class="btn btn-base lg:hidden"
      @click.stop="toggleMenuList"
    >
      <font-awesome-icon
        icon="fa-solid fa-bars-staggered"
        aria-label="fa-bars-staggered"
        :aria-hidden="false"
      />
    </button>

    <span
      class="app-header-actions-template app-header-actions-tip"
      data-tip="Select template"
      @click="toggleTemplatePop"
    >
      {{ codeTemplate }}
    </span>

    <span
      class="app-header-actions-tip hidden text-lg lg:flex"
      data-tip="Save code"
      @click="saveCode"
    >
      <font-awesome-icon
        :class="['svg-icon', { 'animate-spin cursor-not-allowed': isSavingCode, disabled: isLoggingOut }]"
        aria-label="fa-cloud-arrow-up"
        :aria-hidden="false"
        :icon="`fa-solid ${isSavingCode ? 'fa-spinner' : 'fa-cloud-arrow-up'}`"
      />
    </span>

    <span
      class="app-header-actions-tip hidden text-lg lg:flex"
      data-tip="Open setting popup"
      @click="toggleSettingsPop"
    >
      <font-awesome-icon
        class="svg-icon"
        aria-label="fa-gear"
        :aria-hidden="false"
        icon="fa-solid fa-gear"
      />
    </span>

    <span
      class="app-header-actions-tip hidden text-lg lg:flex"
      data-tip="Create new project"
      @click="createNewProject"
    >
      <font-awesome-icon
        class="svg-icon"
        aria-label="fa-file-circle-plus"
        :aria-hidden="false"
        icon="fa-solid fa-file-circle-plus"
      />
    </span>

    <span
      v-if="isLogin"
      class="app-header-actions-tip hidden text-xl lg:flex"
      data-tip="Open projects popup"
      @click="toggleProjectsPop"
    >
      <font-awesome-icon
        class="svg-icon"
        aria-label="fa-sheet-plastic"
        :aria-hidden="false"
        icon="fa-solid fa-sheet-plastic"
      />
    </span>

    <span
      v-if="codeId"
      class="app-header-actions-tip hidden text-xl lg:flex"
      data-tip="Share link"
      @click="shareLink"
    >
      <font-awesome-icon
        class="svg-icon"
        aria-label="fa-share"
        :aria-hidden="false"
        icon="fa-solid fa-share"
      />
    </span>

    <a
      href="https://github.com/tzuyi0817/code-immediate"
      target="_blank"
      rel="noopener noreferrer"
      class="app-header-actions-tip hidden items-center lg:flex"
      data-tip="GitHub"
    >
      <font-awesome-icon
        icon="fa-brands fa-github"
        aria-label="fa-github"
        :aria-hidden="false"
        class="svg-icon text-[20px]"
      />
    </a>

    <loading-button
      v-if="isLogin"
      class="btn-red w-auto text-xs"
      :is-loading="isLoggingOut"
      :disabled="isSavingCode"
      @click="logout"
    >
      LOGOUT
    </loading-button>

    <template v-else>
      <div class="flex gap-1 lg:gap-2">
        <button
          class="btn btn-yellow"
          @click="toggleSignUpPop"
        >
          SIGNUP
        </button>
        <button
          class="btn btn-green"
          @click="toggleLoginPop"
        >
          LOGIN
        </button>
      </div>
    </template>

    <app-header-menu
      v-model="isShowMenuList"
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
    v-model="isShowProjectsPop"
    @open-remind-pop="openRemindPop"
  />
  <settings-popup v-model="isShowSettingsPop" />
  <template-popup v-model="isShowTemplatePop" />
  <login-popup v-model="isShowLoginPop" />
  <sign-up-popup v-model="isShowSignUpPop" />
  <remind-popup
    v-model="isShowRemindPop"
    :save-code="saveCode"
    :do-fun="doFun"
  />
</template>

<style lang="css" scoped>
.app-header-actions {
  position: relative;
  display: flex;
  align-items: center;
  min-width: fit-content;
  gap: 4px;
}

.app-header-actions-template {
  font-size: 12px;
  line-height: calc(1 / 0.75);
  color: #fcc800;
  user-select: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 600;
  cursor: pointer;
  transition-property: colors, transform;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #fcc800;
  border-radius: 4px;
  padding: 2px 6px;
}

.app-header-actions-template:hover {
  color: #ffd633;
  border-color: #ffd633;
}

.app-header-actions-template:active {
  transform: scale(0.9);
}

.app-header-actions-tip {
  position: relative;
}

.app-header-actions-tip::after {
  content: attr(data-tip);
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 8px);
  font-size: 12px;
  line-height: calc(1 / 0.75);
  font-weight: 400;
  padding: 4px 8px;
  white-space: nowrap;
  background-color: #666666;
  border: 1px solid #4a5565;
  border-radius: 6px;
  color: #ffffff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  opacity: 0;
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.app-header-actions-tip:hover::after {
  opacity: 1;
}

@media (min-width: 1024px) {
  .app-header-actions {
    gap: 20px;
  }
}
</style>
