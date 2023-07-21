import { screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import registerFaIcons from '@/utils/registerFaIcons';
import TemplatePopup from '@/components/TemplatePopup.vue';
import { useCodeContentStore } from '@/store';
import { TEMPLATE_LIST, TEMPLATE_MAP } from '@/config/template';
import { renderComponent } from '@/__tests__/unit/render';
import type { CodeTemplate } from '@/types/codeContent';

describe('TemplatePopup component', () => {
  registerFaIcons();

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

  it('select template', () => {
    renderComponent(TemplatePopup);
    const listItems = screen.getAllByRole('listitem');
    const codeContentStore = useCodeContentStore();

    listItems.forEach(async (listItem) => {
      const p = listItem.querySelector('p') as HTMLParagraphElement;
      const codeMap = TEMPLATE_MAP[p.textContent as CodeTemplate];

      await waitFor(async () => {
        await userEvent.click(listItem);
        expect(codeContentStore.codeTemplate).toEqual(p.textContent);
        expect(codeContentStore.codeContent).toEqual(codeMap);
      });
    });
  });
});
