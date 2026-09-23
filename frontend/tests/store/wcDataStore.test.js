import { useWcDataStore } from "../../src/store/wcDataStore";

describe("wcDataStore navigation", () => {
    beforeEach(() => {
        useWcDataStore.getState().clearNavigation();
    });

    test("sets a navigation target and enters routing state", () => {
        const toilet = {
            _id: "toilet-1",
            name: "Test Toilet",
        };

        useWcDataStore.getState().setNavigationTarget(toilet);

        const { navigation } = useWcDataStore.getState();

        expect(navigation.target).toEqual(toilet);
        expect(navigation.route).toBeNull();
        expect(navigation.distance).toBeNull();
        expect(navigation.duration).toBeNull();
        expect(navigation.status).toBe("routing");
    });

    test("stores route, distance, and duration", () => {
        const store = useWcDataStore.getState();

        store.setNavigationRoute({ coordinates: [] });
        store.setNavigationDistance(850);
        store.setNavigationDuration(420);

        const { navigation } = useWcDataStore.getState();

        expect(navigation.route).toEqual({ coordinates: [] });
        expect(navigation.distance).toBe(850);
        expect(navigation.duration).toBe(420);
    });

    test("starts navigation", () => {
        useWcDataStore.getState().setNavigationTarget({
            _id: "toilet-1",
        });

        useWcDataStore.getState().startNavigation();

        expect(useWcDataStore.getState().navigation.status).toBe(
            "navigating"
        );
    });

    test("clears the complete navigation state", () => {
        const store = useWcDataStore.getState();

        store.setNavigationTarget({ _id: "toilet-1" });
        store.setNavigationRoute({ coordinates: [] });
        store.setNavigationDistance(850);
        store.setNavigationDuration(420);
        store.startNavigation();

        store.clearNavigation();

        expect(useWcDataStore.getState().navigation).toEqual({
            target: null,
            route: null,
            distance: null,
            duration: null,
            status: "idle",
        });
    });
});