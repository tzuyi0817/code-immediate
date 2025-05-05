<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { deleteCode, getCodes } from '@/apis/code';
import { Pagination } from '@/components/common/Pagination';
import { setupTemplate } from '@/config/template';
import { useCodeContentStore, useFlagStore } from '@/store';
import { loadParseSources } from '@/utils/load-parse';
import { toast } from '@/utils/toast';
import type { CodeProject } from '@/types/code-content';

const emit = defineEmits(['openRemindPop']);
const isShowProjectsPop = defineModel<boolean>('isShowProjectsPop');
const projects = ref<CodeProject[]>([]);
const currentPage = ref(1);
const total = ref(0);
const isLoading = ref(false);
const isDeleting = ref(false);
const deleteId = ref('');
const route = useRoute();
const router = useRouter();
const LazyPreview = defineAsyncComponent(() => import('@/components/common/Preview/src/LazyPreview.vue'));

async function getProjects() {
  isLoading.value = true;
  const { resultMap } = await getCodes(currentPage.value).finally(() => {
    isLoading.value = false;
  });
  const { codeList, totalSize } = resultMap;

  projects.value = codeList;
  total.value = totalSize;
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
    goPage(currentPage.value - 1);
  }

  if (id !== route.params.id) return;
  router.replace({ params: { id: '' } });
}

function goPage(page: number) {
  if (page < 1) return;

  currentPage.value = page;
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
    class="projects-popup popup"
    @click.self="closePopup"
  >
    <div class="popup-header max-w-5xl">
      <h3>Projects</h3>
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        title="fa-xmark"
        class="cursor-pointer"
        @click="closePopup"
      />
    </div>

    <div class="popup-content max-w-5xl max-h-[65vh]">
      <ul
        v-if="isLoading"
        class="projects-popup-list animate-pulse"
      >
        <li
          v-for="num in 6"
          :key="num"
          class="projects-popup-card bg-gray-300"
        >
          <div class="h-[150px] bg-slate-200"></div>
          <p class="rounded mt-2 p-3 bg-slate-200"></p>
        </li>
      </ul>

      <ul
        v-else
        class="projects-popup-list"
      >
        <li
          v-for="project in projects"
          :key="project.id"
          :data-testid="project.id"
          class="projects-popup-card bg-black/5"
          @click="selectProject(project)"
        >
          <div class="projects-popup-card-content">
            <suspense>
              <lazy-preview :project="project" />

              <template #fallback>
                <font-awesome-icon
                  icon="fa-solid fa-spinner"
                  class="animate-spin text-yellow-400 text-2xl block"
                />
              </template>
            </suspense>
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

      <pagination
        :total="total"
        :disabled="isLoading"
        @change="goPage"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
.projects-popup-list {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  overflow-y: auto;
  position: relative;
  user-select: none;
  height: calc(60dvh - 70px);
  max-height: 450px;
  gap: 12px;
  margin-top: 20px;
  padding: 0 8px 20px;
}

.projects-popup-card {
  border: 1px solid transparent;
  border-radius: 4px;
  text-align: center;
  color: #99a1af;
  cursor: pointer;
  padding: 12px;
  height: 200px;
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  overflow: visible;
  display: flex;
  flex-direction: column;
}

.projects-popup-card:hover {
  background-color: #ffdf20;
  filter: drop-shadow(0 9px 7px rgb(0 0 0 / 0.1));
  border-color: #d1d5dc;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  color: rgb(0 0 0 / 0.7);
  transform: scale(1.03);
}

.projects-popup-card-content {
  width: 100%;
  pointer-events: none;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #d1d5dc;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 0%;
}

@media (min-width: 1024px) {
  .projects-popup-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
