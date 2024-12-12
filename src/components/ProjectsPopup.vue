<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingButton from '@/components/LoadingButton.vue';
import { useCodeContentStore, useFlagStore } from '@/store';
import { getCodes, deleteCode } from '@/apis/code';
import { toast } from '@/utils/toast';
import { loadParseSources } from '@/utils/load-parse';
import { setupTemplate } from '@/config/template';
import type { CodeProject } from '@/types/code-content';

const emit = defineEmits(['openRemindPop']);
const isShowProjectsPop = defineModel<boolean>('isShowProjectsPop');
const projects = ref<CodeProject[]>([]);
const page = ref(1);
const totalPage = ref(0);
const isLoading = ref(false);
const isDeleting = ref(false);
const deleteId = ref('');
const route = useRoute();
const router = useRouter();
const LazyIframe = defineAsyncComponent(() => import('@/components/LazyIframe.vue'));

async function getProjects() {
  isLoading.value = true;
  const { resultMap } = await getCodes(page.value).finally(() => {
    isLoading.value = false;
  });
  const { codeList, totalPage: total } = resultMap;

  projects.value = codeList;
  totalPage.value = total;
}

async function selectProject(project: CodeProject) {
  const { setCodeLoading, isChangeCode } = useFlagStore();

  if (isChangeCode) return emit('openRemindPop', () => selectProject(project));

  const { setCodeId, setCodeMap, setCodeTemplate, setCodeTitle } = useCodeContentStore();
  const { id, title, HTML, CSS, JS, VUE, codeTemplate } = project;

  setCodeLoading(true);
  await loadParseSources({ HTML, CSS, JS });
  setCodeId(id);
  setCodeTitle(title);
  setCodeMap({ HTML, CSS, JS, VUE });
  setCodeTemplate(codeTemplate);
  setupTemplate();
  closePopup();
  setCodeLoading(false);
}

async function deleteProject(id: string) {
  if (isDeleting.value) return;
  deleteId.value = id;
  isDeleting.value = true;

  const { status, message } = await deleteCode(id).finally(() => {
    isDeleting.value = false;
  });

  toast.showToast(message, status);

  if (projects.value.length > 1) {
    getProjects();
  } else {
    goPage(-1);
  }

  if (id !== route.params.id) return;
  router.replace({ params: { id: '' } });
}

function goPage(offset: number) {
  if (page.value + offset < 1) return;
  page.value += offset;
  projects.value = [];
  getProjects();
}

function closePopup() {
  isShowProjectsPop.value = false;
}

onMounted(getProjects);
</script>

<template>
  <div
    class="projects_popup popup"
    @click.self="closePopup"
  >
    <div class="popup_header max-w-5xl">
      <h3>Projects</h3>
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        title="fa-xmark"
        class="cursor-pointer"
        @click="closePopup"
      />
    </div>

    <div class="popup_content max-w-5xl max-h-[65vh]">
      <ul
        v-if="isLoading"
        class="projects_popup_list animate-pulse"
      >
        <li
          v-for="num in 6"
          :key="num"
          class="projects_popup_card bg-gray-300"
        >
          <div class="h-[150px] bg-slate-200"></div>
          <p class="rounded mt-2 p-3 bg-slate-200"></p>
        </li>
      </ul>

      <ul
        v-else
        class="projects_popup_list"
      >
        <li
          v-for="project in projects"
          :key="project.id"
          :data-testid="project.id"
          class="projects_popup_card bg-black/5"
          @click="selectProject(project)"
        >
          <div class="projects_popup_card_content">
            <Suspense>
              <lazy-iframe :project="project" />
              <template #fallback>
                <font-awesome-icon
                  icon="fa-solid fa-spinner"
                  class="animate-spin text-yellow-400 text-2xl block"
                />
              </template>
            </Suspense>
          </div>

          <div class="rounded pt-3 px-3 flex justify-between">
            <p>{{ project.title }}</p>
            <font-awesome-icon
              v-if="isDeleting && deleteId === project.id"
              icon="fa-solid fa-spinner"
              title="fa-spinner"
              class="animate-spin text-blue-600"
            />
            <font-awesome-icon
              v-else
              icon="fa-solid fa-trash"
              title="fa-trash"
              :class="['hover:text-red-600', { 'hover:cursor-not-allowed': isDeleting }]"
              @click.stop="deleteProject(project.id)"
            />
          </div>
        </li>
        <img
          v-if="!projects.length"
          src="/templateIcon/images.jfif"
          alt="Empty Projects"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </ul>

      <div class="flex justify-center gap-2 mt-3 h-9">
        <loading-button
          class="btn btn_yellow w-auto"
          :is-loading="isLoading"
          :disabled="page === 1"
          @click="goPage(-1)"
        >
          <font-awesome-icon
            icon="fa-solid fa-arrow-left"
            class="mr-2"
          />
          Prev
        </loading-button>
        <loading-button
          class="btn btn_yellow w-auto"
          :disabled="page >= totalPage"
          :is-loading="isLoading"
          @click="goPage(1)"
        >
          Next
          <font-awesome-icon
            icon="fa-solid fa-arrow-right"
            class="ml-2"
          />
        </loading-button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.projects_popup {
  &_list {
    @apply grid
    grid-cols-1
    lg:grid-cols-3
    overflow-y-auto
    relative
    select-none
    h-[calc(60vh-70px)]
    max-h-[450px]
    gap-3
    mt-5
    pb-5
    px-2;
  }
  &_card {
    @apply rounded
    border-[1px]
    border-transparent
    text-center
    text-gray-400
    cursor-pointer
    p-3
    h-52
    transition-all
    duration-500
    font-bold
    overflow-visible
    flex
    flex-col
    hover:bg-yellow-300
    hover:drop-shadow-xl
    hover:border-gray-300
    hover:shadow-lg
    hover:text-black/70
    hover:scale-[103%];
    &_content {
      @apply w-full
      pointer-events-none
      rounded
      overflow-hidden
      bg-white
      border-gray-300
      border
      drop-shadow
      flex-1
      flex
      justify-center
      items-center;
    }
  }
}
</style>
