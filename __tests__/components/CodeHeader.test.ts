import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/vue';
import { setActivePinia, createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import registerFaIcons from '@/utils/registerFaIcons';
import CodeHeader from '@/components/CodeHeader.vue';

describe('CodeHeader Component test', () => {
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
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Template')).toBeInTheDocument();
    expect(screen.getByText('New Project')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });
});

