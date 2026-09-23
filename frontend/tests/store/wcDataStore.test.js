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

    test("sets and clears selected toilet", () => {
        const toilet = {
            _id: "toilet-1",
            name: "Test Toilet",
        };

        useWcDataStore.getState().setSelectedToilet(toilet);

        expect(
            useWcDataStore.getState().selectedToilet
        ).toEqual(toilet);

        useWcDataStore.getState().clearSelectedToilet();

        expect(
            useWcDataStore.getState().selectedToilet
        ).toBeNull();
    });

    test("adds a toilet", () => {
        const toilet = {
            _id: "toilet-1",
            name: "Test Toilet",
        };

        useWcDataStore.getState().addToilet(toilet);

        expect(
            useWcDataStore.getState().toilets
        ).toContainEqual(toilet);
    });

    test("sets toilets directly", () => {
        const toilets = [
            { _id: "1", name: "One" },
            { _id: "2", name: "Two" },
        ];

        useWcDataStore.getState().setToilets(toilets);

        expect(
            useWcDataStore.getState().toilets
        ).toEqual(toilets);
    });

    test("sets and clears toilet route info", () => {
        useWcDataStore
            .getState()
            .setToiletRouteInfo("1.2 km", "15 min");

        expect(
            useWcDataStore.getState().toiletRouteInfo
        ).toEqual({
            distance: "1.2 km",
            duration: "15 min",
        });

        useWcDataStore.getState().clearToiletRouteInfo();

        expect(
            useWcDataStore.getState().toiletRouteInfo
        ).toEqual({
            distance: null,
            duration: null,
        });
    });

    test("sets and clears open toilet info", () => {
        useWcDataStore
            .getState()
            .requestOpenToiletInfo();

        expect(
            useWcDataStore.getState().openToiletInfo
        ).toBe(true);

        useWcDataStore
            .getState()
            .clearOpenToiletInfo();

        expect(
            useWcDataStore.getState().openToiletInfo
        ).toBe(false);
    });

    test("sets picked location", () => {
        useWcDataStore.getState().setPickedLocation({
            latitude: 35.7,
            longitude: 51.4,
            address: "Test Street",
        });

        const state = useWcDataStore.getState();

        expect(state.isPickingLocation).toBe(false);

        expect(state.wcData.location).toEqual({
            type: "Point",
            coordinates: [51.4, 35.7],
        });

        expect(state.wcData.address).toBe("Test Street");
    });

    test("resets toilet data", () => {
        useWcDataStore.getState().setWcData({
            name: "Temporary Toilet",
        });

        useWcDataStore.getState().startPickingLocation();
        useWcDataStore.getState().setPickedCoordinate({
            latitude: 35.7,
            longitude: 51.4,
        });

        useWcDataStore.getState().resetWcData();

        const state = useWcDataStore.getState();

        expect(state.isPickingLocation).toBe(false);
        expect(state.pickedCoordinate).toBeNull();
        expect(state.wcData.name).toBe("");
        expect(state.wcData.description).toBe("");
        expect(state.wcData.photos).toEqual([]);
    });
});