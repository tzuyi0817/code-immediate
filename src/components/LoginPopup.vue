<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store';
import ajax from '@/utils/ajax';
import toast from '@/utils/toast';
import LoadingButton from '@/components/LoadingButton.vue';

const emit = defineEmits(['update:isShowLoginPop']);
const localAccount = localStorage.getItem('code_account');
const account = ref(localAccount ?? '');
const password = ref('');
const isLoading = ref(false);

async function login() {
  const data = {
    account: account.value,
    password: password.value,
  };

  isLoading.value = true;
  const { status, message, resultMap } = await ajax.post('/login', data).catch(cleanForm);
  const { token, user } = resultMap;
  const { setUser } = useUserStore();

  setUser(user);
  localStorage.setItem('code_token', token);
  localStorage.setItem('code_account', account.value);
  toast.showToast(message, status);
  isLoading.value = false;
  closePopup();
}

function loginGithub() {
  const { innerHeight, innerWidth } = window;
  const { VITE_API_URL } = import.meta.env;
  const windowFeatures = `left=${innerWidth * 0.5 - 250},top=${innerHeight * 0.5 - 250},width=500,height=500`;
  let authWindow = window.open(`${VITE_API_URL}/github`, 'githubAuth', windowFeatures);

  if (!authWindow) return;
  authWindow.focus();
  authWindow.onload = () => {
    const { searchParams } = new URL(authWindow?.location.href ?? '');
    const { setUser } = useUserStore();
    const token = searchParams.get('token') ?? '';
    const account = searchParams.get('account') ?? '';

    setUser({ account });
    localStorage.setItem('code_token', token);
    authWindow?.close();
    authWindow = null;
    toast.showToast('login success', 'success');
    closePopup();
  }
}

function cleanForm() {
  account.value = password.value = '';
  isLoading.value = false;
}

function closePopup() {
  emit('update:isShowLoginPop', false);
}
</script>

<template>
  <div class="login_popup popup" @click.self="closePopup">
    <div class="popup_header">
      <h2>Log in!</h2>
      <font-awesome-icon 
        icon="fa-solid fa-xmark"
        class="cursor-pointer"
        @click="closePopup"
      />
    </div>

    <div class="popup_content">
      <div class="login_popup_content">
        <form @submit.prevent="login">
          <label class="label">
            <p>Account</p>
            <input type="text" v-model.trim="account" class="input" required />
          </label>

          <label class="label">
            <p>Password</p>
            <input type="password" v-model.trim="password" class="input" required />
          </label>

          <loading-button class="btn_yellow mt-6" :isLoading="isLoading">Log in</loading-button>
        </form>

        <loading-button class="btn_blue mt-2" :isLoading="isLoading" @click="loginGithub">
          <font-awesome-icon icon="fa-brands fa-github" class="mr-5 text-xl" /> Log in with GitHub
        </loading-button>
      </div>
    </div>
  </div>
</template>
