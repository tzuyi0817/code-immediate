import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LanguageSelect from '@/components/LanguageSelect.vue';
import { useCodeContentStore } from '@/store';
import { HTML_LANGUAGE_MAP } from '@/config/language';
import { renderComponent } from '@/__tests__/unit/render';

describe('LanguageSelect component', () => {
  const languageMap = HTML_LANGUAGE_MAP;
  const languages = Object.keys(HTML_LANGUAGE_MAP);

  vi.mock('@/utils/loadParse', () => {
    return {
      loadParseSource: vi.fn(),
    };
  });

  it('renders the correct content', () => {
    renderComponent(LanguageSelect, {
      props: { languageMap, model: 'HTML' },
    });
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect((<HTMLSelectElement>screen.getByRole('combobox')).value).toEqual(languages[0]);
    expect(screen.getByText(languages[0])).toBeInTheDocument();
  });

  it('change language select', async () => {
    const codeContentStore = useCodeContentStore();
    const selectLanguage = languages[1];

    renderComponent(LanguageSelect, {
      props: { languageMap, model: 'HTML' },
    });
    await userEvent.selectOptions(screen.getByRole('combobox'), selectLanguage);
    expect((<HTMLSelectElement>screen.getByRole('combobox')).value).toEqual(selectLanguage);
    expect(codeContentStore.codeContent.HTML.language).toEqual(selectLanguage);
    expect(screen.getByText(selectLanguage)).toBeInTheDocument();
  });
});
