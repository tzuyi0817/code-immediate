import { waitFor, screen, within } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { registerIcons } from '@/utils/register-icons';
import ProjectsPopup from '@/components/ProjectsPopup.vue';
import Toast from '@/components/CodeToast.vue';
import { useCodeContentStore, useFlagStore } from '@/store';
import { CODES_RESPONSE_RESULT_MAP } from '@/mocks/config';
import { renderComponent, router } from '@/__tests__/unit/render';

describe('ProjectsPopup Component', { timeout: 10000 }, () => {
  const page = '1';
  const { id, title, HTML, CSS, JS, codeTemplate } = CODES_RESPONSE_RESULT_MAP[page].codeList[0];

  registerIcons();

  it('renders the correct content', async () => {
    renderComponent(ProjectsPopup);
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-xmark/i })).toBeInTheDocument();
    expect(await screen.findByText(/gsap example/i)).toBeInTheDocument();
    expect(screen.getByText(/gsap timeline/i)).toBeInTheDocument();
    expect(screen.getByText('Gsap ScrollTrigger')).toBeInTheDocument();
    expect(screen.getByText(/gsap scrolltrigger multiple/i)).toBeInTheDocument();
    expect(screen.getByText(/vanilla tilt/i)).toBeInTheDocument();
    expect(screen.getByText(/pdf sign/i)).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: /fa-trash/i })).toHaveLength(6);
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  describe('select project', () => {
    it('not change code', async () => {
      const codeContentStore = useCodeContentStore();
      let iframe: HTMLElement | null = null;

      renderComponent(ProjectsPopup);
      await waitFor(() => {
        iframe = screen.getByText(title);
      });
      if (!iframe) return;
      await userEvent.click(iframe);
      expect(codeContentStore.codeId).toEqual(id);
      expect(codeContentStore.codeTitle).toEqual(title);
      expect(codeContentStore.codeContent.HTML).toEqual(HTML);
      expect(codeContentStore.codeContent.CSS).toEqual(CSS);
      expect(codeContentStore.codeContent.JS).toEqual(JS);
      expect(codeContentStore.codeTemplate).toEqual(codeTemplate);
    });

    it('changed code', async () => {
      useFlagStore().setChangeCodeFlag(true);
      const { emitted } = renderComponent(ProjectsPopup);
      const iframe = await screen.findByText('gsap example');

      await userEvent.click(iframe);
      await waitFor(() => {
        expect(emitted('openRemindPop')).toBeTruthy();
      });
    });
  });

  it('delete project', async () => {
    renderComponent(ProjectsPopup);
    renderComponent(Toast);

    const li = await screen.findByTestId(id);

    if (!li) return;
    const trashSvg = within(li).getByRole('img', { name: /fa-trash/i });

    expect(trashSvg).toBeInTheDocument();
    router.push({ name: 'Home', params: { id } });
    await router.isReady();
    await userEvent.click(trashSvg);
    expect(screen.getByText('successfully deleted')).toBeInTheDocument();
    expect(router.currentRoute.value.params.id).toEqual('');
  });

  it('go project page', async () => {
    renderComponent(ProjectsPopup);
    /* go next page **/
    await userEvent.click(await screen.findByRole('button', { name: /next/i }));
    expect(await screen.findByText(/glitch effect/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-trash/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toHaveAttribute('disabled');
    /* go previous page **/
    await userEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(await screen.findByText(/gsap example/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /prev/i })).toHaveAttribute('disabled');
  });
});
