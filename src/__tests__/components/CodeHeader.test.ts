import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/vue';
import { setActivePinia, createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import registerFaIcons from '@/utils/registerFaIcons';
import CodeHeader from '@/components/CodeHeader.vue';

describe('CodeHeader Component', () => {
  const pinia = createPinia();

  setActivePinia(pinia);
  registerFaIcons();

  beforeEach(() => {
    render(CodeHeader, {
      global: {
        stubs: { FontAwesomeIcon },
        plugins: [pinia],
      },
    });
  });

  it('renders the correct content', () => {
    expect(screen.getByText('Untitled')).toBeInTheDocument();
    expect(screen.getByText('Captain Anonymous')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Template')).toBeInTheDocument();
    expect(screen.getByText('New Project')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByTitle('fa-pen-fancy')).toBeInTheDocument();
    expect(screen.getByTitle('fa-cloud-arrow-up')).toBeInTheDocument();
    expect(screen.getByTitle('fa-gear')).toBeInTheDocument();
    expect(screen.getByTitle('fa-centos')).toBeInTheDocument();
    expect(screen.getByTitle('fa-file-circle-plus')).toBeInTheDocument();
  });

  describe('project title', () => {
    it('edit project title', async () => {
      const pen = screen.getByTitle('fa-pen-fancy');
      await fireEvent.click(pen);
      const titleInput = screen.getByRole('textbox');
      const value = 'test title';
  
      fireEvent.update(titleInput, value);
      await fireEvent.blur(titleInput);
      expect(screen.getByText(value)).toBeInTheDocument();
    });

    it ('edit empty value to display default title', async () => {
      const pen = screen.getByTitle('fa-pen-fancy');
      await fireEvent.click(pen);
      const titleInput = screen.getByRole('textbox');
      const DEFAULT_TITLE = 'Untitled';

      fireEvent.update(titleInput, '');
      await fireEvent.blur(titleInput);
      expect(screen.getByText(DEFAULT_TITLE)).toBeInTheDocument();
    });
  });

  describe('correct show popup', () => {
    it ('settings popup', async () => {
      fireEvent.click(screen.getByRole('button', { name: /fa\-gear settings/i }));
      expect(await screen.findByText('CDN Settings')).toBeInTheDocument();
    });

    it ('templates popup', async () => {
      fireEvent.click(screen.getByRole('button', { name: /fa\-centos template/i }));
      expect(await screen.findByText('Templates')).toBeInTheDocument();
    });

    it ('sign up popup', async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      expect(await screen.findByText('Sign up!')).toBeInTheDocument();
    });

    it ('login popup', async () => {
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
      expect(await screen.findByText('Log in!')).toBeInTheDocument();
    });
  });
});
