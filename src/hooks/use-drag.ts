import { useFlagStore } from '@/store';
import type { DragOffset } from '@/types/drag';

export function useDrag(dragCallback: (offset: DragOffset) => void) {
  const flagStore = useFlagStore();
  const drag = {
    screenWidth: 0,
    screenHeight: 0,
  };

  function startDrag() {
    flagStore.setDragFlag(true);
    drag.screenWidth = self.screen.width;
    drag.screenHeight = self.screen.height;
    document.addEventListener('mousemove', dragging, false);
    document.addEventListener('mouseup', endDrag, false);
  }

  function dragging(event: MouseEvent) {
    if (!flagStore.isStartDrag) return;
    const { movementX, movementY } = event;
    const { screenWidth, screenHeight } = drag;

    dragCallback({
      x: movementX / screenWidth,
      y: movementY / screenHeight,
    });
  }

  function endDrag() {
    flagStore.setDragFlag(false);
    document.removeEventListener('mousemove', dragging, false);
    document.removeEventListener('mouseup', endDrag, false);
  }

  return {
    startDrag,
    dragging,
    endDrag,
  };
}
