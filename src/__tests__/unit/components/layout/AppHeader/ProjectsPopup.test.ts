import userEvent from '@testing-library/user-event';
import { screen, waitFor, within } from '@testing-library/vue';
import { renderComponent, router } from '@/__tests__/unit/render';
import ProjectsPopup from '@/components/layout/AppHeader/src/ProjectsPopup.vue';
import { CODES_RESPONSE_RESULT_MAP } from '@/mocks/config';
import { useCodeContentStore, useFlagStore } from '@/store';
import { registerIcons } from '@/utils/register-icons';

describe('AppHeader/ProjectsPopup Component', { timeout: 10000 }, () => {
  const page = '1';
  const { id, title, HTML, CSS, JS, codeTemplate } = CODES_RESPONSE_RESULT_MAP[page].codeList[0];

  registerIcons();

  it('renders the correct content', async () => {
    renderComponent(ProjectsPopup, { props: { modelValue: true } });
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-xmark/i })).toBeInTheDocument();
    expect(await screen.findByText(/gsap example/i)).toBeInTheDocument();
    expect(screen.getByText(/gsap timeline/i)).toBeInTheDocument();
    expect(screen.getByText('Gsap ScrollTrigger')).toBeInTheDocument();
    expect(screen.getByText(/gsap scrolltrigger multiple/i)).toBeInTheDocument();
    expect(screen.getByText(/vanilla tilt/i)).toBeInTheDocument();
    expect(screen.getByText(/pdf sign/i)).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: /fa-trash/i })).toHaveLength(6);
    expect(screen.getByRole('button', { name: /pagination next/i })).toBeInTheDocument();
  });

  describe('select project', () => {
    it('not change code', async () => {
      const codeContentStore = useCodeContentStore();
      let iframe: HTMLElement | null = null;

      renderComponent(ProjectsPopup, { props: { modelValue: true } });
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
      const { emitted } = renderComponent(ProjectsPopup, { props: { modelValue: true } });
      const iframe = await screen.findByText('gsap example');

      await userEvent.click(iframe);
      await waitFor(() => {
        expect(emitted('openRemindPop')).toBeTruthy();
      });
    });
  });

  it('delete project', async () => {
    const { id: page2Id } = CODES_RESPONSE_RESULT_MAP[2].codeList[0];

    renderComponent(ProjectsPopup, { props: { modelValue: true } });
    await userEvent.click(await screen.findByRole('button', { name: /pagination next/i }));

    const page2Element = await screen.findByTestId(page2Id);
    const page2TrashSvg = within(page2Element).getByRole('img', { name: /fa-trash/i });

    router.push({ name: 'Home', params: { id: page2Id } });
    await router.isReady();
    await userEvent.click(page2TrashSvg);
    expect(screen.getByText('successfully deleted')).toBeInTheDocument();
    expect(router.currentRoute.value.params.id).toEqual('');

    expect(screen.getByText(title)).toBeInTheDocument();
    const element = await screen.findByTestId(id);
    const trashSvg = within(element).getByRole('img', { name: /fa-trash/i });

    await userEvent.click(trashSvg);
    await waitFor(() => {
      expect(screen.queryByText(title)).not.toBeInTheDocument();
    });
  });

  it('go project page', async () => {
    renderComponent(ProjectsPopup, { props: { modelValue: true } });

    await userEvent.click(await screen.findByRole('button', { name: /pagination next/i }));
    expect(await screen.findByText(/glitch effect/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /pagination prev/i }));
    expect(await screen.findByText(/gsap example/i)).toBeInTheDocument();
  });
});
