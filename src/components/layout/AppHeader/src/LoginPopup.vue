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
let githubPopup: Window | null = null;

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

function openCenteredPopup(url: string, name: string) {
  const { screenX, screenY, outerWidth, outerHeight, innerWidth } = window;
  const width = Math.min(500, innerWidth);
  const left = screenX + (outerWidth - width) / 2;
  const top = screenY + (outerHeight - width) / 2;
  const windowFeatures = `width=${width},height=${width},left=${left},top=${top}`;

  return window.open(url, name, windowFeatures);
}

async function loginGithub() {
  const { VITE_API_URL } = import.meta.env;
  const popup = openCenteredPopup(`${VITE_API_URL}/github`, 'github-oauth');

  if (githubPopup) return;

  githubPopup = popup;

  if (!githubPopup) return;

  githubPopup.focus();
  window.addEventListener('message', onMessage);

  const timer = setInterval(() => {
    if (githubPopup?.closed) {
      cleanup();
    }
    if (githubPopup?.location.href === 'about:blank') return;
    const search = githubPopup?.location.search;

    githubPopup?.opener.postMessage({ type: 'oauth-success', search }, location.origin);
  }, 300);

  function cleanup() {
    if (timer) {
      clearInterval(timer);
    }
    githubPopup?.close();
    githubPopup = null;
    window.removeEventListener('message', onMessage);
  }

  function onMessage(event: MessageEvent) {
    const { type, search } = event.data;

    if (type !== 'oauth-success') return;
    const searchParams = new URLSearchParams(search);
    const token = searchParams.get('token') ?? '';
    const githubAccount = searchParams.get('account') ?? '';

    if (token && githubAccount) {
      const { setUser } = useUserStore();

      setUser({ account: githubAccount });
      window.localStorage.setItem(STORAGE_TOKEN, token);
      showToast({ message: 'login success', type: 'success' });
      closePopup();
    } else {
      showToast({ message: 'login failed', type: 'error' });
    }

    cleanup();
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
            class="btn-yellow no-scale mt-3 w-full"
            :is-loading="isLoading"
          >
            Log in
          </loading-button>
        </form>

        <loading-button
          v-tick
          class="btn-blue no-scale mt-3 w-full"
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
