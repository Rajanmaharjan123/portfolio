"use client";
import { useSyncExternalStore } from "react";

/* Tiny shared store so the 3D scene and the HTML overlay can talk. */
type State = { selected: string | null; hovered: string | null; guide: boolean; catalogue: boolean; entered: boolean; ready: boolean; portrait: boolean };

let state: State = { selected: null, hovered: null, guide: false, catalogue: false, entered: false, ready: false, portrait: false };
const subs = new Set<() => void>();

export const museum = {
  get: () => state,
  set(patch: Partial<State>) {
    state = { ...state, ...patch };
    subs.forEach((f) => f());
  },
  subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; },
};

export function useMuseum<T>(pick: (s: State) => T): T {
  return useSyncExternalStore(museum.subscribe, () => pick(state), () => pick(state));
}
