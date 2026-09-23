import useWaitingSystemStore from "../../src/store/waitingSystemStore";

describe("waitingSystemStore", () => {
    beforeEach(() => {
        useWaitingSystemStore.setState({
            waiting: false,
            waitingText: "",
            waitingId: null,
            waitingVisible: false,
        });
    });

    test("ignores stale waiting id updates and ends", () => {
        const firstId = useWaitingSystemStore.getState().startWaiting("First");
        const secondId = useWaitingSystemStore.getState().startWaiting("Second");

        useWaitingSystemStore.getState().updateWaiting(firstId, "Stale");
        expect(useWaitingSystemStore.getState().waitingText).toBe("Second");

        useWaitingSystemStore.getState().hideWaiting(firstId);
        expect(useWaitingSystemStore.getState().waitingVisible).toBe(true);

        useWaitingSystemStore.getState().endWaiting(firstId);
        expect(useWaitingSystemStore.getState().waiting).toBe(true);
        expect(useWaitingSystemStore.getState().waitingId).toBe(secondId);

        useWaitingSystemStore.getState().updateWaiting(secondId, "Current");
        expect(useWaitingSystemStore.getState().waitingText).toBe("Current");

        useWaitingSystemStore.getState().hideWaiting(secondId);
        expect(useWaitingSystemStore.getState().waitingVisible).toBe(false);

        useWaitingSystemStore.getState().showWaiting(secondId);
        expect(useWaitingSystemStore.getState().waitingVisible).toBe(true);

        useWaitingSystemStore.getState().endWaiting(secondId);

        expect(useWaitingSystemStore.getState()).toMatchObject({
            waiting: false,
            waitingText: "",
            waitingId: null,
            waitingVisible: false,
        });
    });
});