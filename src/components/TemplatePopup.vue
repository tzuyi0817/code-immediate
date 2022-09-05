<script setup lang="ts">

const emit = defineEmits(['update:isShowTemplatePop']);

const templateList = [
  { name: 'ES6', src: getImageSrc('../assets/templateIcon/es6.png') },
  { name: 'React', src: getImageSrc('../assets/templateIcon/react.svg') },
  { name: 'Vue2', src: getImageSrc('../assets/templateIcon/vue.svg') },
  { name: 'Vue3', src: getImageSrc('../assets/templateIcon/vue.svg') },
];

function selectTemplate(name: string) {
  console.log({ name });
}

function getImageSrc(path: string) {
  return new URL(path, import.meta.url).toString();
}

function closePopup() {
  emit('update:isShowTemplatePop', false);
}
</script>

<template>
  <div class="template_popup" @click.self="closePopup">
    <div class="template_popup_content">
      <p class="font-bold text-gray-600">Common Templates</p>
      <ul>
        <li 
          v-for="template in templateList" 
          :key="template.name" 
          @click="selectTemplate(template.name)"
        >
          <img :src="template.src" alt="" class="template_popup_content_icon">
          <p>{{ template.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="postcss">
.template_popup {
  @apply
  fixed
  top-0
  left-0
  bg-black/30
  flex
  items-center
  justify-center
  z-10
  w-full
  h-full;
  &_content {
    @apply
    px-4
    pt-4
    pb-12
    max-w-[80%]
    rounded-md
    bg-white;
    &_icon {
      @apply
      mx-3
      w-14
      h-14;
    }
    ul {
      @apply
      flex
      flex-wrap
      gap-2;
      li {
        @apply
        flex
        items-center
        justify-start
        w-[145px]
        border-b-2
        border-gray-400
        p-2
        mt-5
      }
    }
  }
}
</style>