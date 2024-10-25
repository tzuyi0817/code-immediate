import { screen } from '@testing-library/vue';
import { registerIcons } from '@/utils/register-icons';
import CodeLoading from '@/components/CodeLoading.vue';
import { useFlagStore } from '@/store';
import { sleep } from '@/utils/common';
import { renderComponent } from '@/__tests__/unit/render';

describe('CodeLoading Component', () => {
  const flagStore = useFlagStore();

  registerIcons();

  it('render the loading content', async () => {
    const content = 'testing loading';

    renderComponent(CodeLoading);
    flagStore.setLoading({ type: content, isOpen: true });
    expect(await screen.findByText(content)).toBeInTheDocument();
    expect(screen.getByTitle('fa-spinner')).toBeInTheDocument();
  });

  it('renders this tick content and disappear automatically after 1 second', async () => {
    const content = 'testing tick content';

    renderComponent(CodeLoading);
    flagStore.setLoading({ type: content, isOpen: true });
    await sleep();
    flagStore.setLoading({ type: content, isOpen: false });
    expect(await screen.findByText(content)).toBeInTheDocument();
    expect(screen.getByTitle('fa-check')).toBeInTheDocument();
    await sleep(1000);
    expect(screen.queryByTitle('fa-check')).toBeNull();
  });

  it('renders the error content', async () => {
    const content = 'testing error';

    renderComponent(CodeLoading);
    flagStore.setLoading({ type: content, isOpen: true });
    await sleep();
    flagStore.setLoading({ type: content, isOpen: false });
    expect(await screen.findByText(content)).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();
  });
});
