<script setup lang="ts">
import InitLoading from '@/components/InitLoading.vue';
import Toast from '@/components/Toast.vue';
</script>

<template>
  <router-view />
  <init-loading />
  <toast />
</template>

<style></style>
