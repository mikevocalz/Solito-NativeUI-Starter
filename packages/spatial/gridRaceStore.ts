'use client';

import { create } from 'zustand';

export type GridRacePhase = 'gateway' | 'race';

type GridRaceState = {
  phase: GridRacePhase;
  steer: number;
  throttle: number;
  setStick: (x: number, y: number) => void;
  enterGateway: () => void;
  startRace: () => void;
  resetInput: () => void;
};

const clampStick = (value: number) => Math.max(-1, Math.min(1, value));

export const useGridRaceStore = create<GridRaceState>((set) => ({
  phase: 'gateway',
  steer: 0,
  throttle: 0,
  setStick: (x, y) => set({ steer: clampStick(x), throttle: clampStick(y) }),
  enterGateway: () => set({ phase: 'gateway', steer: 0, throttle: 0 }),
  startRace: () => set({ phase: 'race' }),
  resetInput: () => set({ steer: 0, throttle: 0 }),
}));

export const gridRace = {
  getState: useGridRaceStore.getState,
  enterGateway: () => useGridRaceStore.getState().enterGateway(),
  startRace: () => useGridRaceStore.getState().startRace(),
  setStick: (x: number, y: number) => useGridRaceStore.getState().setStick(x, y),
  resetInput: () => useGridRaceStore.getState().resetInput(),
};
