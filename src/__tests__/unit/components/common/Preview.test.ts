import { fireEvent, screen, waitFor } from '@testing-library/vue';
import { nextTick, ref } from 'vue';
import { renderComponent } from '@/__tests__/unit/render';
import { Preview } from '@/components/common';
import LoadingStatus from '@/components/layout/AppFooter/src/LoadingStatus.vue';
import { useCodeContentStore } from '@/store';
import { loadedParseMap } from '@/utils/load-parse';
import { registerIcons } from '@/utils/register-icons';

describe('Preview component', () => {
  const previewTitle = 'preview';

  registerIcons();

  it('renders the correct content', async () => {
    renderComponent(Preview, { provide: { iframe: ref(null) } });
    expect(screen.getByTitle(previewTitle)).toBeInTheDocument();
  });

  it('preview the correct content', async () => {
    const codeContentStore = useCodeContentStore();

    renderComponent(LoadingStatus);
    renderComponent(Preview, { provide: { iframe: ref(null) } });
    await nextTick();
    codeContentStore.setCodeContent({ type: 'HTML', code: '<h1>Hello World!<h1>' });
    await fireEvent.load(screen.getByTitle(previewTitle));
    await waitFor(() => {
      expect(screen.getByText('Process code finished')).toBeInTheDocument();
    });
    expect(screen.getByTitle(previewTitle)).toMatchSnapshot();
  });

  it('catch preview compile error', async () => {
    const codeContentStore = useCodeContentStore();

    loadedParseMap.set('markdown', true);
    codeContentStore.setCodeLanguage({ type: 'HTML', language: 'Markdown' });
    renderComponent(LoadingStatus);
    renderComponent(Preview, { provide: { iframe: ref(null) } });
    expect(await screen.findByText('Process code error')).toBeInTheDocument();
    loadedParseMap.delete('markdown');
  });
});
