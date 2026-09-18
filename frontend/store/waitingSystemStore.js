import { create } from "zustand";

const useWaitingSystemStore = create((set) => ({
    waiting: false,
    waitingText: "",
    waitingId: null,

    startWaiting: (text = "") => {
        const id = Date.now() + Math.random();

        set({
            waiting: true,
            waitingText: text,
            waitingId: id,
        });

        return id;
    },

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
            };
        }),
}));

export default useWaitingSystemStore;