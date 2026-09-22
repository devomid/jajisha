import { create } from "zustand";

const useWaitingSystemStore = create((set) => ({
    waiting: false,
    waitingText: "",
    waitingId: null,
    waitingVisible: false,

    startWaiting: (text = "") => {
        const id = Date.now() + Math.random();

        set({
            waiting: true,
            waitingText: text,
            waitingId: id,
            waitingVisible: true,
        });

        return id;
    },

    hideWaiting: (id) =>
        set((state) => {
            if (state.waitingId !== id) {
                return state;
            }

            return {
                waitingVisible: false,
            };
        }),

    showWaiting: (id) =>
        set((state) => {
            if (state.waitingId !== id) {
                return state;
            }

            return {
                waitingVisible: true,
            };
        }),

    updateWaiting: (id, text = "") =>
        set((state) => {
            if (state.waitingId !== id) {
                return state;
            }

            return {
                waitingText: text,
            };
        }),

    endWaiting: (id) =>
        set((state) => {
            if (state.waitingId !== id) {
                return state;
            }

            return {
                waiting: false,
                waitingText: "",
                waitingId: null,
                waitingVisible: false,
            };
        }),
}));

export default useWaitingSystemStore;

