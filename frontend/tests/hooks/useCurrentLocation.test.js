import { renderHook } from "@testing-library/react-native";

import { useCurrentLocation } from "../../src/hooks/useCurrentLocation";

const mockStartWaiting = jest.fn();
const mockEndWaiting = jest.fn();

const mockSetCurrentLocation = jest.fn();

const mockToastShow = jest.fn();

const mockRequestForegroundPermissionsAsync = jest.fn();
const mockGetCurrentPositionAsync = jest.fn();

jest.mock("expo-location", () => ({
    Accuracy: {
        High: "high",
    },
    requestForegroundPermissionsAsync:
        mockRequestForegroundPermissionsAsync,
    getCurrentPositionAsync: mockGetCurrentPositionAsync,
}));

jest.mock("../../src/store/wcDataStore", () => ({
    useWcDataStore: (selector) =>
        selector({
            setCurrentLocation: mockSetCurrentLocation,
        }),
}));

jest.mock("../../src/store/waitingSystemStore", () => ({
    __esModule: true,
    default: (selector) =>
        selector({
            startWaiting: mockStartWaiting,
            endWaiting: mockEndWaiting,
        }),
}));

jest.mock("react-native-toast-notifications", () => ({
    useToast: () => ({
        show: mockToastShow,
    }),
}));

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

jest.mock("../../src/utils/logger", () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));

beforeEach(() => {
    jest.clearAllMocks();

    mockStartWaiting.mockReturnValue(123);

    mockRequestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted",
    });

    mockGetCurrentPositionAsync.mockResolvedValue({
        coords: {
            latitude: 35.7001,
            longitude: 51.4001,
        },
    });
});

describe("useCurrentLocation", () => {
    test("gets and stores the current location successfully", async () => {
        const { result } = await renderHook(() => useCurrentLocation());

        const response = await result.current.getCurrentLocation();

        expect(response).toEqual({
            latitude: 35.7001,
            longitude: 51.4001,
        });

        expect(mockSetCurrentLocation).toHaveBeenCalledWith({
            latitude: 35.7001,
            longitude: 51.4001,
        });

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("handles denied location permission", async () => {
        mockRequestForegroundPermissionsAsync.mockResolvedValue({
            status: "denied",
        });

        const { result } = await renderHook(() => useCurrentLocation());

        const response = await result.current.getCurrentLocation();

        expect(response).toBeNull();

        expect(mockGetCurrentPositionAsync).not.toHaveBeenCalled();
        expect(mockSetCurrentLocation).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalled();

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("handles location request errors", async () => {
        mockGetCurrentPositionAsync.mockRejectedValue(
            new Error("Location error")
        );

        const { result } = await renderHook(() => useCurrentLocation());

        const response = await result.current.getCurrentLocation();

        expect(response).toBeNull();

        expect(mockSetCurrentLocation).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalled();

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });
});