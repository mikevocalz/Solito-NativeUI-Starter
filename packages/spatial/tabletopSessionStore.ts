'use client';

import { create } from 'zustand';
import { normalizePlayerName } from './lightcycle/tabletopCore';

export type TabletopSessionMode = 'idle' | 'host' | 'guest' | 'solo';

type TabletopSessionState = {
  mode: TabletopSessionMode;
  playerName: string;
  joinCode: string;
  hostFrameRef: string | null;
  localized: boolean;
  ready: boolean;
  roomDisplayCode: string | null;
  error: string | null;
  setPlayerName: (name: string) => void;
  setJoinCode: (code: string) => void;
  beginHost: () => boolean;
  beginGuest: () => boolean;
  beginSolo: () => boolean;
  setLocalized: (localized: boolean) => void;
  setReady: (ready: boolean) => void;
  setRoomDisplayCode: (code: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

function createUuid() {
  const cryptoObject = globalThis.crypto as
    | { randomUUID?: () => string; getRandomValues?: (array: Uint8Array) => Uint8Array }
    | undefined;

  if (cryptoObject?.randomUUID) return cryptoObject.randomUUID();

  const bytes = new Uint8Array(16);
  if (cryptoObject?.getRandomValues) {
    cryptoObject.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
}

function normalizedCode(value: string) {
  return value.replace(/[\s-]+/g, '').toUpperCase().slice(0, 8);
}

export const useTabletopSessionStore = create<TabletopSessionState>((set, get) => ({
  mode: 'idle',
  playerName: '',
  joinCode: '',
  hostFrameRef: null,
  localized: false,
  ready: false,
  roomDisplayCode: null,
  error: null,

  setPlayerName: (name) =>
    set({
      playerName: Array.from(name.replace(/[\u0000-\u001F\u007F]/g, '')).slice(0, 16).join(''),
      error: null,
    }),

  setJoinCode: (code) => set({ joinCode: normalizedCode(code), error: null }),

  beginHost: () => {
    const playerName = normalizePlayerName(get().playerName);
    if (!playerName) {
      set({ error: 'Enter your player name first.' });
      return false;
    }
    set({
      mode: 'host',
      playerName,
      joinCode: '',
      hostFrameRef: createUuid(),
      localized: false,
      ready: false,
      roomDisplayCode: null,
      error: null,
    });
    return true;
  },

  beginGuest: () => {
    const state = get();
    const playerName = normalizePlayerName(state.playerName);
    const joinCode = normalizedCode(state.joinCode);
    if (!playerName) {
      set({ error: 'Enter your player name first.' });
      return false;
    }
    if (joinCode.length < 6) {
      set({ error: 'Enter the six-character table code.' });
      return false;
    }
    set({
      mode: 'guest',
      playerName,
      joinCode,
      hostFrameRef: null,
      localized: false,
      ready: false,
      roomDisplayCode: null,
      error: null,
    });
    return true;
  },

  beginSolo: () => {
    const playerName = normalizePlayerName(get().playerName);
    if (!playerName) {
      set({ error: 'Enter your player name first.' });
      return false;
    }
    set({
      mode: 'solo',
      playerName,
      joinCode: '',
      hostFrameRef: null,
      localized: true,
      ready: true,
      roomDisplayCode: null,
      error: null,
    });
    return true;
  },

  setLocalized: (localized) => set({ localized }),
  setReady: (ready) => set({ ready }),
  setRoomDisplayCode: (roomDisplayCode) => set({ roomDisplayCode }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      mode: 'idle',
      joinCode: '',
      hostFrameRef: null,
      localized: false,
      ready: false,
      roomDisplayCode: null,
      error: null,
    }),
}));

export const tabletopSession = {
  getState: useTabletopSessionStore.getState,
  setState: useTabletopSessionStore.setState,
};
