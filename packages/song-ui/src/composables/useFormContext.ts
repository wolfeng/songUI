import type { InjectionKey } from 'vue';

export interface SongFormFieldHandle {
  validate: () => boolean;
  resetValidation: () => void;
}

export interface SongFormContext {
  register: (field: SongFormFieldHandle) => void;
  unregister: (field: SongFormFieldHandle) => void;
}

export const SONG_FORM_KEY: InjectionKey<SongFormContext> = Symbol('SongFormContext');
