import { create } from 'zustand'

const useRoomStore = create((set) => ({
  // ── existing state ──────────────────────────────────────────────────────────
  sceneMode: 'loading',
  focusTarget: null,
  activeSection: null,
  musicPlaying: false,
  easterEggsFound: [],
  ledColor: '#ff2d88',
  performanceTier: 'high',

  // ── new state ───────────────────────────────────────────────────────────────
  cameraState: 'room',          // 'room' | 'desk' | 'monitor'
  hasClickedAnywhere: false,
  monitorWorldPos: null,        // { x, y, z } — set after GLB loads
  monitorScreenBounds: null,    // { left, top, width, height } px — projected screen bounds

  // ── existing actions ────────────────────────────────────────────────────────
  setSceneMode: (mode) => set({ sceneMode: mode }),
  setFocusTarget: (target) => set({ focusTarget: target }),
  setActiveSection: (section) => set({ activeSection: section }),
  toggleMusic: () => set((state) => ({ musicPlaying: !state.musicPlaying })),
  addEasterEgg: (egg) =>
    set((state) => ({
      easterEggsFound: state.easterEggsFound.includes(egg)
        ? state.easterEggsFound
        : [...state.easterEggsFound, egg],
    })),
  setLedColor: (color) => set({ ledColor: color }),
  setPerformanceTier: (tier) => set({ performanceTier: tier }),

  // ── new actions ─────────────────────────────────────────────────────────────
  setCameraState: (state) => set({ cameraState: state }),
  setHasClickedAnywhere: (bool) => set({ hasClickedAnywhere: bool }),
  setMonitorWorldPos: (pos) => set({ monitorWorldPos: pos }),
  setMonitorScreenBounds: (bounds) => set({ monitorScreenBounds: bounds }),
}))

export default useRoomStore
