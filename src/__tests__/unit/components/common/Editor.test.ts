import { screen } from '@testing-library/vue';
import { nextTick } from 'vue';
import { renderComponent } from '@/__tests__/unit/render';
import { Editor } from '@/components/common';
import LoadingStatus from '@/components/layout/AppFooter/src/LoadingStatus.vue';
import { setupTestEnvironmentLanguage } from '@/monaco';
import { useCodeContentStore, useFlagStore } from '@/store';
import { registerIcons } from '@/utils/register-icons';

describe('Editor component', async () => {
  registerIcons();
  setupTestEnvironmentLanguage();

  it('renders the editor', async () => {
    renderComponent(Editor, { props: { model: 'HTML' } });

    expect(screen.getByLabelText(/code-editor/)).toBeInTheDocument();
    expect(screen.getByLabelText(/code-editor/).dataset.modeId).toMatch('html');
  });

  it('change to markdown language', async () => {
    const codeContentStore = useCodeContentStore();

    renderComponent(Editor, { props: { model: 'HTML' } });
    codeContentStore.setCodeLanguage({ type: 'HTML', language: 'Markdown' });
    await nextTick();
    expect(screen.getByLabelText(/code-editor/).dataset.modeId).toMatch('markdown');
    codeContentStore.setCodeTemplate('Vue');
  });

  it('render vue template editor', async () => {
    renderComponent(Editor, { props: { model: 'VUE' } });
    expect(screen.getByLabelText(/code-editor/).dataset.modeId).toMatch('vue');
  });

  it('formatter editor', async () => {
    const flagStore = useFlagStore();

    renderComponent(Editor, { props: { model: 'VUE' } });
    renderComponent(LoadingStatus);
    flagStore.setLoading({ isOpen: true, type: 'Code formatter' });
    await nextTick();
    flagStore.setFormatter({ model: 'VUE', isFormatter: true });
    expect(await screen.findByText('Code formatter finished')).toBeInTheDocument();
  });

  it('create new project', async () => {
    const flagStore = useFlagStore();

    renderComponent(Editor, { props: { model: 'VUE' } });
    renderComponent(LoadingStatus);
    flagStore.setCreateProjectFlag(true);
    flagStore.setLoading({ isOpen: true, type: 'Create new project' });
    await nextTick();
    expect(await screen.findByText('Create new project finished')).toBeInTheDocument();
  });

  it('embed file', async () => {
    const flagStore = useFlagStore();

    renderComponent(Editor, { props: { model: 'VUE' } });
    flagStore.setEmbedFlag({ model: 'VUE', isEmbed: true });
    await nextTick();
    expect(flagStore.EmbedMap.VUE).toBeFalsy();
  });
});
