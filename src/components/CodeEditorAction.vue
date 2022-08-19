<script setup lang="ts">

</script>

<template>
<div class="code_editor_action">
  <div class="code_editor_action_left">
    <button class="btn_select">HTML</button>
    <button class="btn_select">CSS</button>
    <button class="btn_select">JS</button>
    <button class="btn_select">Result</button>
  </div>

  <div class="code_editor_action_right">
    <button class="btn btn_base w-9">
      <font-awesome-icon icon="fa-solid fa-angle-down" class="text-base" />
    </button>
  </div>
</div>
</template>

<style lang="postcss" scoped>
.code_editor_action {
  @apply 
  h-10
  w-full
  px-1
  flex
  items-center
  justify-between
  border-b-2
  border-gray-700/60
  bg-black/90;
  &_left {
    @apply
    flex
    gap-[2px]
    items-center
    h-full
  }
  &_right {

  }
}
</style>