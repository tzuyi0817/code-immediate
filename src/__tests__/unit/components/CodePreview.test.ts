import { fireEvent, screen, waitFor } from '@testing-library/vue';
import { nextTick, ref } from 'vue';
import { renderComponent } from '@/__tests__/unit/render';
import CodeLoading from '@/components/CodeLoading.vue';
import CodePreview from '@/components/CodePreview.vue';
import { useCodeContentStore } from '@/store';
import { loadedParseMap } from '@/utils/load-parse';
import { registerIcons } from '@/utils/register-icons';

describe('CodePreview component', () => {
  const codePreviewText = 'code preview';

  registerIcons();

  it('renders the correct content', async () => {
    renderComponent(CodePreview, { provide: { iframe: ref(null) } });
    expect(screen.getByTitle(codePreviewText)).toBeInTheDocument();
  });

  it('preview the correct content', async () => {
    const codeContentStore = useCodeContentStore();

    renderComponent(CodeLoading);
    renderComponent(CodePreview, { provide: { iframe: ref(null) } });
    await nextTick();
    codeContentStore.setCodeContent({ type: 'HTML', code: '<h1>Hello World!<h1>' });
    await fireEvent.load(screen.getByTitle(codePreviewText));
    await waitFor(() => {
      expect(screen.getByText('Process code finished')).toBeInTheDocument();
    });
    expect(screen.getByTitle(codePreviewText)).toMatchSnapshot();
  });

  it('catch preview compile error', async () => {
    const codeContentStore = useCodeContentStore();

    loadedParseMap.set('markdown', true);
    codeContentStore.setCodeLanguage({ type: 'HTML', language: 'Markdown' });
    renderComponent(CodeLoading);
    renderComponent(CodePreview, { provide: { iframe: ref(null) } });
    expect(await screen.findByText('Process code error')).toBeInTheDocument();
    loadedParseMap.delete('markdown');
  });
});
