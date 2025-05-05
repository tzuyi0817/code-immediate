<script setup lang="ts">
import { ref } from 'vue';
import { loginUser } from '@/apis/user';
import { LoadingButton, showToast } from '@/components/common';
import { useUserStore } from '@/store';

const isShowLoginPop = defineModel<boolean>('isShowLoginPop');
const localAccount = localStorage.getItem('code_account');
const account = ref(localAccount ?? '');
const password = ref('');
const isLoggingIn = ref(false);

async function login() {
  const data = {
    account: account.value,
    password: password.value,
  };

  isLoggingIn.value = true;

  try {
    const { status, message, resultMap } = await loginUser(data);
    const { token, user } = resultMap;
    const { setUser } = useUserStore();

    setUser(user);
    window.localStorage.setItem('code_token', token);
    window.localStorage.setItem('code_account', account.value);
    showToast({ message, type: status });
    closePopup(true);
  } catch {
    cleanForm();
  } finally {
    isLoggingIn.value = false;
  }
}

function loginGithub() {
  const { screenX, screenLeft, screen, innerHeight } = window;
  const { VITE_API_URL } = import.meta.env;
  const left = (screenX ?? screenLeft ?? 0) + (screen.width - 500) / 2;
  const windowFeatures = `left=${left},top=${innerHeight * 0.5 - 250},width=500,height=500`;
  let authWindow = window.open(`${VITE_API_URL}/github`, 'githubAuth', windowFeatures);

  if (!authWindow) return;
  let timer: NodeJS.Timeout | null = null;

  authWindow.focus();
  window.addEventListener('message', onMessage);

  timer = setInterval(() => {
    if (authWindow?.closed) {
      closeAuthWindow();
    }
    authWindow?.opener.postMessage(authWindow?.location.search, location.origin);
  }, 300);

  function closeAuthWindow() {
    if (timer) {
      clearInterval(timer);
    }
    authWindow?.close();
    authWindow = null;
    window.removeEventListener('message', onMessage);
  }

  function onMessage(event: MessageEvent<any>) {
    const { data: search } = event;

    if (!search || typeof search !== 'string') return;

    const searchParams = new URLSearchParams(search);
    const { setUser } = useUserStore();
    const token = searchParams.get('token') ?? '';
    const githubAccount = searchParams.get('account') ?? '';

    closeAuthWindow();
    setUser({ account: githubAccount });
    window.localStorage.setItem('code_token', token);
    showToast({ message: 'login success', type: 'success' });
    closePopup();
  }
}

function cleanForm() {
  account.value = password.value = '';
}

function closePopup(force = false) {
  if (isLoggingIn.value && !force) return;
  isShowLoginPop.value = false;
}
</script>

<template>
  <div
    class="login-popup popup"
    @click.self="closePopup()"
  >
    <div class="popup-header">
      <h2>Log in!</h2>
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        title="fa-xmark"
        class="cursor-pointer"
        @click="closePopup()"
      />
    </div>

    <div class="popup-content">
      <div class="login-popup-content">
        <form @submit.prevent="login">
          <label class="label">
            <p>Account</p>
            <input
              v-model.trim="account"
              type="text"
              class="input"
              required
            />
          </label>

          <label class="label">
            <p>Password</p>
            <input
              v-model.trim="password"
              type="password"
              class="input"
              required
            />
          </label>

          <loading-button
            class="btn-yellow w-full mt-6"
            :is-loading="isLoggingIn"
          >
            Log in
          </loading-button>
        </form>

        <loading-button
          class="btn-blue w-full mt-2"
          :disabled="isLoggingIn"
          @click="loginGithub"
        >
          <font-awesome-icon
            icon="fa-brands fa-github"
            class="mr-5 text-xl"
          />
          Log in with GitHub
        </loading-button>
      </div>
    </div>
  </div>
</template>
