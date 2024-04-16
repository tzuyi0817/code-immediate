<script setup lang="ts">
import InitLoading from '@/components/InitLoading.vue';
import CodeToast from '@/components/CodeToast.vue';
</script>

<template>
  <router-view />
  <init-loading />
  <code-toast />
</template>

<style></style>
