import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LanguageSelect from '@/components/LanguageSelect.vue';
import { useCodeContentStore } from '@/store';
import { registerIcons } from '@/utils/register-icons';
import { sleep } from '@/utils/common';
import { HTML_LANGUAGE_MAP } from '@/config/language';
import { renderComponent } from '@/__tests__/unit/render';

describe('LanguageSelect component', () => {
  const languageMap = HTML_LANGUAGE_MAP;
  const languages = Object.keys(HTML_LANGUAGE_MAP);

  registerIcons();

  vi.mock('@/utils/load-parse', () => {
    return {
      loadParseSource: vi.fn(),
    };
  });

  it('renders the correct content', () => {
    renderComponent(LanguageSelect, {
      props: { languageMap, model: 'HTML' },
    });
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent(languages[0]);
    expect(screen.getByText(languages[0])).toBeInTheDocument();
  });

  it('change language select', async () => {
    const codeContentStore = useCodeContentStore();
    const selectLanguage = languages[1];

    renderComponent(LanguageSelect, {
      props: { languageMap, model: 'HTML' },
    });
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(languages.length);
    await userEvent.click(screen.getByText(selectLanguage));
    expect(screen.getByRole('combobox')).toHaveTextContent(selectLanguage);
    expect(codeContentStore.codeContent.HTML.language).toEqual(selectLanguage);
    await sleep(150);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
