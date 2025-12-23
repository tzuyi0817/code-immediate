<script setup lang="ts">
import { keepPreviousData, useMutation, useQuery } from '@tanstack/vue-query';
import { computed, defineAsyncComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Pagination, Popup, showToast } from '@/components/common';
import { CODES_QUERY } from '@/queries';
import { deleteCode, getCodes } from '@/services/http';
import { useCodeContentStore, useFlagStore } from '@/store';
import { loadParseSources } from '@/utils/load-parse';
import type { CodeProject } from '@/types/code-content';

const emit = defineEmits(['openRemindPop']);
const isShowProjectsPop = defineModel<boolean>({ default: false });
const currentPage = ref(1);
const deleteId = ref('');
const route = useRoute();
const router = useRouter();
const LazyPreview = defineAsyncComponent(() => import('@/components/common/Preview/src/LazyPreview.vue'));

const {
  data,
  isPending,
  isPlaceholderData,
  refetch: getProjects,
} = useQuery({
  queryKey: [...CODES_QUERY, currentPage],
  queryFn: () => getCodes(currentPage.value).then(res => res.resultMap),
  placeholderData: keepPreviousData,
  enabled: false,
});

const { mutate, isPending: isDeleting } = useMutation({
  mutationFn: deleteCode,
  onSuccess: async ({ status, message }, id) => {
    if (data.value?.codeList && data.value.codeList.length > 1) {
      await getProjects();
    } else {
      currentPage.value -= 1;
    }

    showToast({ message, type: status });

    if (id === route.params.id) {
      router.replace({ params: { id: '' } });
    }
  },
});

const isLoading = computed(() => isPending.value || isPlaceholderData.value);

async function selectProject(project: CodeProject) {
  const { setCodeLoading, isChangeCode } = useFlagStore();

  if (isChangeCode) {
    emit('openRemindPop', () => selectProject(project));
    return;
  }

  const { setCodeId, setCodeMap, setCodeTemplate, setCodeTitle, setTemplateMap } = useCodeContentStore();
  const { id, title, HTML, CSS, JS, VUE, codeTemplate } = project;

  setCodeLoading(true);
  await loadParseSources({ HTML, CSS, JS });
  setCodeId(id);
  setCodeTitle(title);
  setCodeMap({ HTML, CSS, JS, VUE });
  setCodeTemplate(codeTemplate);
  setTemplateMap();
  closePopup();
  setCodeLoading(false);
}

function deleteProject(id: string) {
  if (isDeleting.value) return;

  deleteId.value = id;
  mutate(id);
}

function closePopup() {
  isShowProjectsPop.value = false;
}
</script>

<template>
  <popup
    v-model="isShowProjectsPop"
    class="projects-popup"
    :style="{ maxWidth: '64rem' }"
    :content-attrs="{ style: { maxHeight: '65dvh' } }"
    @open="getProjects"
  >
    <template #header>Projects</template>

    <template #content>
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
          <p class="mt-2 rounded bg-slate-200 p-3"></p>
        </li>
      </ul>

      <ul
        v-else
        class="projects-popup-list"
      >
        <li
          v-for="project in data?.codeList"
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
                  class="block animate-spin text-2xl text-yellow-400"
                />
              </template>
            </suspense>
          </div>

          <div class="flex justify-between rounded px-3 pt-3">
            <p>{{ project.title }}</p>
            <font-awesome-icon
              v-if="isDeleting && deleteId === project.id"
              icon="fa-solid fa-spinner"
              aria-label="fa-spinner"
              :aria-hidden="false"
              class="animate-spin text-blue-600"
            />
            <font-awesome-icon
              v-else
              icon="fa-solid fa-trash"
              aria-label="fa-trash"
              :aria-hidden="false"
              :class="['hover:text-red-600', { 'hover:cursor-not-allowed': isDeleting }]"
              @click.stop="deleteProject(project.id)"
            />
          </div>
        </li>
        <img
          v-if="!data?.codeList.length"
          src="/templateIcon/images.jfif"
          alt="Empty Projects"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </ul>

      <pagination
        v-model:page="currentPage"
        class="pt-4"
        :total="data?.totalSize"
        :disabled="isLoading"
        @change="() => getProjects()"
      />
    </template>
  </popup>
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
  padding: 12px 8px;
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
    0 6px 6px -3px rgb(0 0 0 / 0.1),
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
