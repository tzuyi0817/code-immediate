<script setup lang="ts">
import { ref } from 'vue';
import { LoadingButton, Popup, showToast } from '@/components/common';
import { registerUser } from '@/services/http';
import { STORAGE_TOKEN, useUserStore } from '@/store';

const isShowSignUpPop = defineModel<boolean>({ default: false });
const account = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

async function register() {
  if (password.value !== confirmPassword.value) {
    password.value = confirmPassword.value = '';
    return showToast({ message: 'password and confirmPassword are not the same', type: 'error' });
  }
  const data = {
    account: account.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  };

  isLoading.value = true;
  try {
    const { status, message, resultMap } = await registerUser(data);
    const { token, user } = resultMap;
    const { setUser } = useUserStore();

    setUser(user);
    window.localStorage.setItem(STORAGE_TOKEN, token);
    showToast({ message, type: status });
    closePopup();
  } catch {
    cleanForm();
  } finally {
    isLoading.value = false;
  }
}

function cleanForm() {
  account.value = password.value = confirmPassword.value = '';
  isLoading.value = false;
}

function closePopup() {
  isShowSignUpPop.value = false;
}
</script>

<template>
  <popup
    v-model="isShowSignUpPop"
    :disabled-close="isLoading"
    class="signup-popup"
  >
    <template #header>Sign up!</template>

    <template #content>
      <div class="signup-popup-content text-sm">
        <form
          class="flex flex-col gap-y-3"
          @submit.prevent="register"
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

          <label class="label">
            <p>Confirm Password</p>
            <input
              v-model.trim="confirmPassword"
              type="password"
              class="input"
              required
            />
          </label>

          <loading-button
            class="btn-yellow w-full mt-3"
            :is-loading="isLoading"
          >
            Sign up
          </loading-button>
        </form>
      </div>
    </template>
  </popup>
</template>
