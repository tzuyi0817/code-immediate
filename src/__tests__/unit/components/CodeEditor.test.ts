import { nextTick } from 'vue';
import { screen } from '@testing-library/vue';
import { registerIcons } from '@/utils/register-icons';
import CodeEditor from '@/components/CodeEditor.vue';
import CodeLoading from '@/components/CodeLoading.vue';
import { useCodeContentStore, useFlagStore } from '@/store';
import { setupTestEnvironmentLanguage } from '@/monaco';
import { renderComponent } from '@/__tests__/unit/render';

describe('CodeEditor Component', async () => {
  registerIcons();
  setupTestEnvironmentLanguage();

  it('renders the editor', async () => {
    renderComponent(CodeEditor, { props: { model: 'HTML' } });

    expect(screen.getByLabelText(/code-editor/)).toBeInTheDocument();
    expect(screen.getByLabelText(/code-editor/).dataset.modeId).toMatch('html');
  });

  it('change to markdown language', async () => {
    const codeContentStore = useCodeContentStore();

    renderComponent(CodeEditor, { props: { model: 'HTML' } });
    codeContentStore.setCodeLanguage({ type: 'HTML', language: 'Markdown' });
    await nextTick();
    expect(screen.getByLabelText(/code-editor/).dataset.modeId).toMatch('markdown');
    codeContentStore.setCodeTemplate('Vue');
  });

  it('render vue template editor', async () => {
    renderComponent(CodeEditor, { props: { model: 'VUE' } });
    expect(screen.getByLabelText(/code-editor/).dataset.modeId).toMatch('vue');
  });

  it('formatter editor', async () => {
    const flagStore = useFlagStore();

    renderComponent(CodeEditor, { props: { model: 'VUE' } });
    renderComponent(CodeLoading);
    flagStore.setLoading({ isOpen: true, type: 'Code formatter' });
    await nextTick();
    flagStore.setFormatter({ model: 'VUE', isFormatter: true });
    expect(await screen.findByText('Code formatter finished')).toBeInTheDocument();
  });

  it('create new project', async () => {
    const flagStore = useFlagStore();

    renderComponent(CodeEditor, { props: { model: 'VUE' } });
    renderComponent(CodeLoading);
    flagStore.setCreateProjectFlag(true);
    flagStore.setLoading({ isOpen: true, type: 'Create new project' });
    await nextTick();
    expect(await screen.findByText('Create new project finished')).toBeInTheDocument();
  });

  it('embed file', async () => {
    const flagStore = useFlagStore();

    renderComponent(CodeEditor, { props: { model: 'VUE' } });
    flagStore.setEmbedFlag({ model: 'VUE', isEmbed: true });
    await nextTick();
    expect(flagStore.EmbedMap.VUE).toBeFalsy();
  });
});
