import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { registerIcons } from '@/utils/register-icons';
import TemplatePopup from '@/components/TemplatePopup.vue';
import { useCodeContentStore } from '@/store';
import { TEMPLATE_LIST, TEMPLATE_MAP } from '@/config/template';
import { renderComponent } from '@/__tests__/unit/render';

describe('TemplatePopup component', () => {
  registerIcons();

  it('renders the correct content', () => {
    renderComponent(TemplatePopup);
    expect(screen.getByRole('heading', { name: /templates/i })).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();

    for (const { name, src, version } of TEMPLATE_LIST) {
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByAltText(name)).toHaveAttribute('src', `file://${src}`);
      expect(screen.getAllByText(version)[0]).toBeInTheDocument();
    }
  });

  it('select VueSFC template', async () => {
    renderComponent(TemplatePopup);
    const codeContentStore = useCodeContentStore();
    await userEvent.click(screen.getByRole('img', { name: /vuesfc/i }));
    expect(codeContentStore.codeTemplate).toEqual('VueSFC');
    expect(codeContentStore.codeContent).toEqual(TEMPLATE_MAP.VueSFC);
  });

  it('select RxJS template', async () => {
    renderComponent(TemplatePopup);
    const codeContentStore = useCodeContentStore();
    await userEvent.click(screen.getByRole('img', { name: /rxjs/i }));
    expect(codeContentStore.codeTemplate).toEqual('RxJS');
    expect(codeContentStore.codeContent).toEqual(TEMPLATE_MAP.RxJS);
  });
});
