import { onBeforeUnmount, onMounted } from 'vue';

/**
 * 註冊「點擊視窗任一處」與「視窗失焦」時要收起浮層的全域事件，並在元件卸載時一併移除。
 * blur 的處理器預設與 click 相同，需要額外判斷時（例如僅在焦點落到 iframe 才收起）再另外傳入。
 */
export function useWindowClose(onClick: () => void, onBlur: () => void = onClick) {
  onMounted(() => {
    addEventListener('click', onClick);
    window.addEventListener('blur', onBlur);
  });

  onBeforeUnmount(() => {
    removeEventListener('click', onClick);
    window.removeEventListener('blur', onBlur);
  });
}
