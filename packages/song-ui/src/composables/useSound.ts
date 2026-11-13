import { inject, ref, watch, type InjectionKey, type Ref } from 'vue';
import { SongSoundEngine } from '../core/sound-engine.js';

export interface SongSoundInstance {
  enabled: Ref<boolean>;
  toggle: () => boolean;
  setEnabled: (val: boolean) => void;
  playChime: (freq?: number) => void;
  playPluck: (freq?: number) => void;
  playBell: () => void;
  playSeal: () => void;
  playBrush: () => void;
}

export const SONG_SOUND_KEY: InjectionKey<SongSoundInstance> = Symbol('SongUISound');

export function createSoundController(defaultEnabled = true): SongSoundInstance {
  const enabled = ref(defaultEnabled);
  const engine = new SongSoundEngine(defaultEnabled);

  watch(enabled, (val) => {
    engine.enabled = val;
  });

  function setEnabled(val: boolean) {
    enabled.value = val;
  }

  function toggle(): boolean {
    enabled.value = !enabled.value;
    if (enabled.value) {
      engine.playCeladonChime(784);
    }
    return enabled.value;
  }

  return {
    enabled,
    toggle,
    setEnabled,
    playChime: (freq) => engine.playCeladonChime(freq),
    playPluck: (freq) => engine.playGuqinPluck(freq),
    playBell: () => engine.playBronzeBell(),
    playSeal: () => engine.playSealThud(),
    playBrush: () => engine.playBrushStroke()
  };
}

export function useSound(): SongSoundInstance {
  const sound = inject(SONG_SOUND_KEY, null);
  if (!sound) {
    return createSoundController(true);
  }
  return sound;
}
