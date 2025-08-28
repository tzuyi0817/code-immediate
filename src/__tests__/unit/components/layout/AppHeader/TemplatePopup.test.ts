import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { renderComponent } from '@/__tests__/unit/render';
import TemplatePopup from '@/components/layout/AppHeader/src/TemplatePopup.vue';
import { TEMPLATE_LIST, TEMPLATE_MAP } from '@/constants/template';
import { useCodeContentStore } from '@/store';
import { registerIcons } from '@/utils/register-icons';

describe('AppHeader/TemplatePopup component', () => {
  registerIcons();

  it('renders the correct content', () => {
    renderComponent(TemplatePopup, { props: { modelValue: true } });
    expect(screen.getByRole('heading', { name: /templates/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'fa-xmark' })).toBeInTheDocument();

    for (const { name, src, version } of TEMPLATE_LIST) {
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByAltText(name)).toHaveAttribute('src', `file://${src}`);
      expect(screen.getAllByText(version)[0]).toBeInTheDocument();
    }
  });

  it('select VueSFC template', async () => {
    renderComponent(TemplatePopup, { props: { modelValue: true } });
    const codeContentStore = useCodeContentStore();
    await userEvent.click(screen.getByRole('img', { name: /vuesfc/i }));
    expect(codeContentStore.codeTemplate).toEqual('VueSFC');
    expect(codeContentStore.codeContent).toEqual(TEMPLATE_MAP.VueSFC);
  });

  it('select RxJS template', async () => {
    renderComponent(TemplatePopup, { props: { modelValue: true } });
    const codeContentStore = useCodeContentStore();
    await userEvent.click(screen.getByRole('img', { name: /rxjs/i }));
    expect(codeContentStore.codeTemplate).toEqual('RxJS');
    expect(codeContentStore.codeContent).toEqual(TEMPLATE_MAP.RxJS);
  });
});
