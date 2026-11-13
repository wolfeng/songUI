import { inject, ref, type InjectionKey, type Ref } from 'vue';

export interface SongToastInstance {
  visible: Ref<boolean>;
  message: Ref<string>;
  show: (msg: string, durationMs?: number) => void;
  hide: () => void;
}

export const SONG_TOAST_KEY: InjectionKey<SongToastInstance> = Symbol('SongUIToast');

export function createToastController(): SongToastInstance {
  const visible = ref(false);
  const message = ref('');
  let timer: ReturnType<typeof setTimeout> | null = null;

  function hide() {
    visible.value = false;
  }

  function show(msg: string, durationMs = 2400) {
    message.value = msg;
    visible.value = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      visible.value = false;
    }, durationMs);
  }

  return { visible, message, show, hide };
}

export function useToast(): SongToastInstance {
  const toast = inject(SONG_TOAST_KEY, null);
  if (!toast) {
    return createToastController();
  }
  return toast;
}
