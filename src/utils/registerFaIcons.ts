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
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faGithub, faCentos } from '@fortawesome/free-brands-svg-icons';

export default function registerIcons() {
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
    faShare,
  );
}
