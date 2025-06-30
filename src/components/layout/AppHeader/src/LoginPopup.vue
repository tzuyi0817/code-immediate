<script setup lang="ts">
import { ref } from 'vue';
import { LoadingButton, Popup, showToast } from '@/components/common';
import { loginUser } from '@/services/http';
import { STORAGE_ACCOUNT, STORAGE_TOKEN, useUserStore } from '@/store';

const isShowLoginPop = defineModel<boolean>({ default: false });
const localAccount = localStorage.getItem(STORAGE_ACCOUNT);
const account = ref(localAccount ?? '');
const password = ref('');
const isLoading = ref(false);

async function login() {
  const data = {
    account: account.value,
    password: password.value,
  };

  isLoading.value = true;

  try {
    const { status, message, resultMap } = await loginUser(data);
    const { token, user } = resultMap;
    const { setUser } = useUserStore();

    setUser(user);
    window.localStorage.setItem(STORAGE_TOKEN, token);
    window.localStorage.setItem(STORAGE_ACCOUNT, account.value);
    showToast({ message, type: status });
    closePopup();
  } catch {
    cleanForm();
  } finally {
    isLoading.value = false;
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
    window.localStorage.setItem(STORAGE_TOKEN, token);
    showToast({ message: 'login success', type: 'success' });
    closePopup();
  }
}

function cleanForm() {
  account.value = '';
  password.value = '';
}

function closePopup() {
  isShowLoginPop.value = false;
}
</script>

<template>
  <popup
    v-model="isShowLoginPop"
    class="login-popup"
    :disabled-close="isLoading"
    @closed="password = ''"
  >
    <template #header>Log in!</template>

    <template #content>
      <div class="login-popup-content text-sm">
        <form
          class="flex flex-col gap-y-3"
          @submit.prevent="login"
        >
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
            v-tick
            class="btn-yellow w-full mt-3 no-scale"
            :is-loading="isLoading"
          >
            Log in
          </loading-button>
        </form>

        <loading-button
          v-tick
          class="btn-blue w-full mt-3 no-scale"
          :disabled="isLoading"
          @click="loginGithub"
        >
          <font-awesome-icon
            icon="fa-brands fa-github"
            class="mr-5 text-xl"
          />
          Log in with GitHub
        </loading-button>
      </div>
    </template>
  </popup>
</template>
