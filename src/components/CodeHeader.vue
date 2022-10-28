<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store';
import SettingsPopup from '@/components/SettingsPopup.vue';
import TemplatePopup from '@/components/TemplatePopup.vue';
import LoginPopup from '@/components/LoginPopup.vue';
import SignUpPopup from '@/components/SignUpPopup.vue';
import ajax from '@/utils/ajax';
import toast from '@/utils/toast';

const isShowSettingsPop = ref(false);
const isShowTemplatePop = ref(false);
const isShowMenuList = ref(false);
const isShowLoginPop = ref(false);
const isShowSignUpPop = ref(false);
const { user, isLogin } = storeToRefs(useUserStore());

async function logout() {
  const { status, message } = await ajax.post('/logout');
  const { setUser } = useUserStore();

  setUser({});
  localStorage.removeItem('code_token');
  toast.showToast(message, status);
}

function toggleSignUpPop() {
  closeAllPop();
  isShowSignUpPop.value = !isShowSignUpPop.value;
}

function toggleLoginPop() {
  closeAllPop();
  isShowLoginPop.value = !isShowLoginPop.value;
}

function toggleSettingsPop() {
  closeAllPop();
  isShowSettingsPop.value = !isShowSettingsPop.value;
}

function toggleTemplatePop() {
  closeAllPop();
  isShowTemplatePop.value = !isShowTemplatePop.value;
}

function toggleMenuList() {
  isShowMenuList.value = !isShowMenuList.value;
}

function closeAllPop() {
  isShowMenuList.value = false;
  isShowLoginPop.value = false;
  isShowSignUpPop.value = false;
}
</script>

<template>
  <header class="code_header">
    <div class="code_header_left">
      <p class="font-bold">
        untitled <font-awesome-icon icon="fa-solid fa-pen-fancy" />
      </p>
      <p class="text-xs text-gray-300">{{ isLogin ? user.account : 'Captain Anonymous' }}</p>
    </div>

    <div class="code_header_right">
      <button class="btn btn_base lg:hidden">
        <font-awesome-icon icon="fa-solid fa-bars-staggered" @click="toggleMenuList" />
      </button>

      <button class="btn btn_base hidden lg:block" @click="toggleSettingsPop">
        <font-awesome-icon icon="fa-solid fa-gear" class="mr-1" /> Settings
      </button>
      <button class="btn btn_base hidden lg:block" @click="toggleTemplatePop">
        <font-awesome-icon icon="fa-solid fa-fire-flame-simple" class="mr-1" /> Template
      </button>

      <template v-if="isLogin">
        <button class="btn btn_yellow" @click="">Projects</button>
        <button class="btn btn_red" @click="logout">Log out</button>
      </template>

      <template v-else>
        <button class="btn btn_yellow" @click="toggleSignUpPop">Sign up</button>
        <button class="btn btn_green" @click="toggleLoginPop">Log in</button>
      </template>

      <ul v-if="isShowMenuList" class="code_header_menu animate-popup">
        <li @click="toggleSettingsPop">
          <font-awesome-icon icon="fa-solid fa-gear" class="mr-1" /> Settings
        </li>
        <li @click="toggleTemplatePop">
          <font-awesome-icon icon="fa-solid fa-fire-flame-simple" class="mr-1" /> Template
        </li>
      </ul>
    </div>

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
  </header>
</template>

<style lang="postcss" scoped>
.code_header {
  @apply
  h-14
  p-2
  flex
  items-center
  justify-between
  text-sm
  border-b-2
  border-gray-700/60
  bg-black;
  &_left {
    @apply text-white;
    svg {
      @apply text-xs;
    }
  }
  &_right {
    @apply
    relative
    flex
    gap-1;
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
    z-[2]
    lg:hidden;
    li {
      @apply
      px-3
      py-1
      select-none
      whitespace-nowrap
      hover:bg-gray-200
      hover:cursor-pointer;
    }
  }
}
</style>