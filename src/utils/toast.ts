import { ref } from 'vue';
import { sleep } from '@/utils/common';

export const toast = {
  msg: ref(''),
  status: ref('success'),
  isShowToast: ref(false),
  timer: null as NodeJS.Timeout | null,
  duration: 300,
  showToast(msg: string, status: 'success' | 'error' | 'warn', time = 1800) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.msg.value = msg;
    this.status.value = status;
    this.isShowToast.value = true;
    this.timer = setTimeout(() => {
      this.timer = null;
      this.closeToast();
    }, time);
  },
  async closeToast() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = null;
    this.isShowToast.value = false;
    await sleep(this.duration);
    this.msg.value = '';
  },
};
