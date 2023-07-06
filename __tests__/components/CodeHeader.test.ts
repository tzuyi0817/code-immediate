import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/vue';
import { setActivePinia, createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPenFancy,
  faAngleDown,
  faSpinner,
  faCheck,
  faXmark,
  faGear,
  faMagnifyingGlass,
  faBarsStaggered,
  faCloudArrowUp,
  faSheetPlastic,
  faArrowLeft,
  faArrowRight,
  faTrash,
  faFileCirclePlus,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faGithub, faCentos } from '@fortawesome/free-brands-svg-icons';
import CodeHeader from '@/components/CodeHeader.vue';

describe('CodeHeader Component test', () => {
  const pinia = createPinia();

  setActivePinia(pinia);
  library.add(
    faPenFancy,
    faAngleDown,
    faSpinner,
    faCheck,
    faXmark,
    faGear,
    faMagnifyingGlass,
    faBarsStaggered,
    faCloudArrowUp,
    faSheetPlastic,
    faFileCirclePlus,
    faArrowLeft,
    faArrowRight,
    faTrash,
    faEye,
    faGithub,
    faCentos,
    faArrowRightFromBracket,
  );

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
  });
});

