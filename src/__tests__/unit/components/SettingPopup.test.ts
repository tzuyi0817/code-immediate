import { screen, fireEvent } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { registerIcons } from '@/utils/register-icons';
import SettingsPopup from '@/components/SettingsPopup.vue';
import Toast from '@/components/CodeToast.vue';
import { useCodeContentStore } from '@/store';
import { renderComponent } from '@/__tests__/unit/render';

describe('SettingPopup component', () => {
  const TEST_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/customresource';
  const SPINNER = 'fa-spinner';

  registerIcons();

  it('renders the correct content', () => {
    renderComponent(SettingsPopup);
    expect(screen.getByRole('heading', { name: /cdn settings/i })).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');

    expect(listItems.find(listItem => listItem.textContent === 'CSS')).toBeInTheDocument();
    expect(listItems.find(listItem => listItem.textContent === 'JS')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /add external stylesheets/i })).toBeInTheDocument();
    expect(
      screen.getByText(/any url's added here will be added as <link>s in order, and before the css in the editor\./i),
    ).toBeInTheDocument();
    expect(screen.getByTitle('fa-magnifying-glass')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search cdnjs resources/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ custom resource/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('change setting tab', async () => {
    renderComponent(SettingsPopup);
    const listItems = screen.getAllByRole('listitem');
    const cssTab = listItems.find(listItem => listItem.textContent === 'CSS');
    const jsTab = listItems.find(listItem => listItem.textContent === 'JS');

    expect(cssTab).toHaveClass('active');
    if (!jsTab) return;
    await userEvent.click(jsTab);
    expect(jsTab).toHaveClass('active');
    expect(screen.getByRole('heading', { name: /add external scripts/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /any url's added here will be added as <script>s in order, and run before the javascript in the editor\./i,
      ),
    ).toBeInTheDocument();
  });

  it('search cdn resource', async () => {
    renderComponent(SettingsPopup);
    await userEvent.type(screen.getByPlaceholderText(/search cdnjs resources/i), 's');
    expect(await screen.findByTitle(SPINNER)).toBeInTheDocument();
    expect(await screen.findByText(/slider-pro/i)).toBeInTheDocument();
    expect(
      await screen.findByText(
        /responsive jquery slider, featuring modular architecture, css3 animations, touch swipe, animated layers, retina, lazy loading and much more\./i,
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText(/s3colors/i)).toBeInTheDocument();
    expect(
      await screen.findByText(
        /easy to use css colors in your project with simple class you can colorize your text or background with the class of color name\./i,
      ),
    ).toBeInTheDocument();
  });

  it('cdnjs search error', async () => {
    renderComponent(SettingsPopup);
    renderComponent(Toast);
    await userEvent.type(screen.getByPlaceholderText(/search cdnjs resources/i), 'cdnjs');
    expect(await screen.findByTitle(SPINNER)).toBeInTheDocument();
    expect(await screen.findByText('cdnjs search error')).toBeInTheDocument();
    expect(screen.queryByTitle(SPINNER)).not.toBeInTheDocument();
  });

  it('add and delete custom cdn resource', async () => {
    renderComponent(SettingsPopup);
    await userEvent.click(screen.getByRole('button', { name: /\+ custom resource/i }));
    const cdn = 'https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css';
    const mockWindowOpen = vi.fn();

    vi.stubGlobal('open', mockWindowOpen);
    await userEvent.type(screen.getByPlaceholderText(TEST_CDN_URL), cdn);
    await fireEvent.blur(screen.getByPlaceholderText(TEST_CDN_URL));
    await userEvent.click(screen.getByTitle('fa-eye'));
    expect(mockWindowOpen).toBeCalledWith(cdn);

    await userEvent.click(screen.getByTitle('fa-xmark-cdn'));
    expect(screen.queryByText('https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: /\+ custom resource/i }));
    await userEvent.type(screen.getByPlaceholderText(TEST_CDN_URL), cdn);
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(useCodeContentStore().codeContent.CSS.resources).toEqual([cdn]);
  });
});
