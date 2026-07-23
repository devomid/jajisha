import { create } from "zustand";

export const useDrawerStore = create((set) => ({
    shouldOpenDrawer: false,

    openDrawerOnReturn: () =>
        set({ shouldOpenDrawer: true }),

    reset: () =>
        set({ shouldOpenDrawer: false }),
}));