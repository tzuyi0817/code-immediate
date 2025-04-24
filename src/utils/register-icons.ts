import { library } from '@fortawesome/fontawesome-svg-core';
import { faCentos, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faArrowRightFromBracket,
  faBarsStaggered,
  faCaretDown,
  faCheck,
  faCloudArrowUp,
  faEllipsis,
  faFileCirclePlus,
  faGear,
  faMagnifyingGlass,
  faPenFancy,
  faShare,
  faSheetPlastic,
  faSpinner,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export function registerIcons() {
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
    faAngleLeft,
    faAnglesLeft,
    faAngleRight,
    faAnglesRight,
    faTrash,
    faEye,
    faGithub,
    faCentos,
    faArrowRightFromBracket,
    faShare,
    faCaretDown,
    faEllipsis,
  );
}
