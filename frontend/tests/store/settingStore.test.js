import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSettingsStore } from "../../src/store/settingsStore";

jest.mock("@react-native-async-storage/async-storage", () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
}));

describe("settingsStore", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useSettingsStore.setState({
            distanceUnit: "Metric",
            theme: "System",
            mapType: "standard",
            showMyLocation: true,
            showCompass: true,
        });
    });

    test("starts with the default settings", () => {
        const state = useSettingsStore.getState();

        expect(state.distanceUnit).toBe("Metric");
        expect(state.theme).toBe("System");
        expect(state.mapType).toBe("standard");
        expect(state.showMyLocation).toBe(true);
        expect(state.showCompass).toBe(true);
    });

    test("setDistanceUnit updates the distance unit", () => {
        useSettingsStore.getState().setDistanceUnit("Imperial");

        expect(useSettingsStore.getState().distanceUnit).toBe("Imperial");
    });

    test("setTheme updates the theme", () => {
        useSettingsStore.getState().setTheme("Dark");

        expect(useSettingsStore.getState().theme).toBe("Dark");
    });

    test("setMapType updates the map type", () => {
        useSettingsStore.getState().setMapType("satellite");

        expect(useSettingsStore.getState().mapType).toBe("satellite");
    });

    test("setShowMyLocation updates location visibility", () => {
        useSettingsStore.getState().setShowMyLocation(false);

        expect(useSettingsStore.getState().showMyLocation).toBe(false);
    });

    test("setShowCompass updates compass visibility", () => {
        useSettingsStore.getState().setShowCompass(false);

        expect(useSettingsStore.getState().showCompass).toBe(false);
    });
});