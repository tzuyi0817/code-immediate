<script setup lang="ts">

</script>

<template>
  <header class="code_header">
    <div class="code_header_left">
      {{ 'untitled' }}
    </div>

    <div class="code_header_right">
      <button></button>
      <button>Sign Up</button>
      <button>Log In</button>
    </div>
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
  bg-black/[0.8];
  &_left {
    @apply
    text-white;
  }
  &_right {

  }
}
</style>