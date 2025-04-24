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
  faAngleLeft,
  faAnglesLeft,
  faAngleRight,
  faAnglesRight,
  faTrash,
  faFileCirclePlus,
  faArrowRightFromBracket,
  faShare,
  faCaretDown,
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faGithub, faCentos } from '@fortawesome/free-brands-svg-icons';

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
