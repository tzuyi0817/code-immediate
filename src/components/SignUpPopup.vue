<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store';
import ajax from '@/utils/ajax';
import toast from '@/utils/toast';
import LoadingButton from '@/components/LoadingButton.vue';

const emit = defineEmits(['update:isShowSignUpPop']);
const account = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

async function register() {
  if (password.value !== confirmPassword.value) {
    password.value = confirmPassword.value = '';
    return toast.showToast('password and confirmPassword are not the same', 'error');
  }
  const data = {
    account: account.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  };

  isLoading.value = true;
  const { status, message, resultMap } = await ajax.post('/register', data).catch(cleanForm);
  const { token, user } = resultMap;
  const { setUser } = useUserStore();

  setUser(user);
  localStorage.setItem('code_token', token);
  toast.showToast(message, status);
  isLoading.value = false;
  closePopup();
}

function cleanForm() {
  account.value = password.value = confirmPassword.value = '';
  isLoading.value = false;
}

function closePopup() {
  emit('update:isShowSignUpPop', false);
}
</script>

<template>
  <div class="login_popup popup" @click.self="closePopup">
    <div class="popup_header">
      <h2>Sign up!</h2>
      <font-awesome-icon 
        icon="fa-solid fa-xmark"
        class="cursor-pointer"
        @click="closePopup"
      />
    </div>

    <div class="popup_content">
      <div class="login_popup_content">
        <form @submit.prevent="register">
          <label class="label">
            <p>Account</p>
            <input type="text" v-model.trim="account" class="input" required />
          </label>

          <label class="label">
            <p>Password</p>
            <input type="password" v-model.trim="password" class="input" required />
          </label>

          <label class="label">
            <p>Confirm Password</p>
            <input type="password" v-model.trim="confirmPassword" class="input" required />
          </label>

          <loading-button class="btn_yellow mt-6" :isLoading="isLoading">Sign up</loading-button>
        </form>
      </div>
    </div>
  </div>
</template>
