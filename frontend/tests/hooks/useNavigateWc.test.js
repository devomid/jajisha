import { renderHook } from "@testing-library/react-native";

import { useNavigateToToilet } from "../../src/hooks/useNavigateWc";

const mockRequestForegroundPermissionsAsync = jest.fn();
const mockGetCurrentPositionAsync = jest.fn();

const mockStartWaiting = jest.fn();
const mockEndWaiting = jest.fn();

const mockSetNavigationRoute = jest.fn();
const mockSetNavigationDistance = jest.fn();
const mockSetNavigationDuration = jest.fn();
const mockSetNavigationStatus = jest.fn();
const mockSetToiletRouteInfo = jest.fn();
const mockClearNavigation = jest.fn();

const mockToastShow = jest.fn();

let mockNavigation = {
    target: {
        _id: "toilet-1",
    },
};

let mockSelectedToilet = {
    _id: "toilet-1",
};

const mockWcStoreState = () => ({
    navigation: mockNavigation,
    selectedToilet: mockSelectedToilet,
    setNavigationRoute: mockSetNavigationRoute,
    setNavigationDistance: mockSetNavigationDistance,
    setNavigationDuration: mockSetNavigationDuration,
    setNavigationStatus: mockSetNavigationStatus,
    clearNavigation: mockClearNavigation,
    setToiletRouteInfo: mockSetToiletRouteInfo,
});

jest.mock("expo-location", () => ({
    Accuracy: {
        High: "high",
    },
    requestForegroundPermissionsAsync:
        mockRequestForegroundPermissionsAsync,
    getCurrentPositionAsync: mockGetCurrentPositionAsync,
}));

jest.mock("../../src/store/wcDataStore", () => ({
    useWcDataStore: Object.assign(
        (selector) => selector(mockWcStoreState()),
        {
            getState: () => mockWcStoreState(),
        }
    ),
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

    global.fetch = jest.fn();

    mockNavigation = {
        target: {
            _id: "toilet-1",
        },
    };

    mockSelectedToilet = {
        _id: "toilet-1",
    };

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

const toilet = {
    _id: "toilet-1",
    location: {
        coordinates: [51.401, 35.701],
    },
};

describe("useNavigateToToilet - navigateToToilet", () => {
    test("ignores invalid toilet data", async () => {
        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.navigateToToilet({
            _id: "toilet-1",
        });

        expect(mockStartWaiting).not.toHaveBeenCalled();
        expect(global.fetch).not.toHaveBeenCalled();
    });

    test("clears navigation when location permission is denied", async () => {
        mockRequestForegroundPermissionsAsync.mockResolvedValue({
            status: "denied",
        });

        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.navigateToToilet(toilet);

        expect(mockClearNavigation).toHaveBeenCalled();
        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useNavigateWc.navigateToToilet.locGrant1",
            {
                type: "custom",
                data: {
                    type: "warning",
                    text2: "toast.useNavigateWc.navigateToToilet.locGrant2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("sets navigation route data when routing succeeds", async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                code: "Ok",
                routes: [
                    {
                        distance: 1250,
                        duration: 300,
                        geometry: {
                            type: "LineString",
                            coordinates: [
                                [51.4001, 35.7001],
                                [51.401, 35.701],
                            ],
                        },
                    },
                ],
            }),
        });

        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.navigateToToilet(toilet);

        expect(mockSetNavigationRoute).toHaveBeenCalledWith({
            type: "LineString",
            coordinates: [
                [51.4001, 35.7001],
                [51.401, 35.701],
            ],
        });

        expect(mockSetNavigationDistance).toHaveBeenCalledWith(1250);
        expect(mockSetNavigationDuration).toHaveBeenCalledWith(300);
        expect(mockSetNavigationStatus).toHaveBeenCalledWith("preview");

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("clears navigation when OSRM returns a non-Ok code", async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                code: "NoRoute",
            }),
        });

        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.navigateToToilet(toilet);

        expect(mockClearNavigation).toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useNavigateWc.navigateToToilet.catch1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useNavigateWc.navigateToToilet.catch2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("clears navigation when the route has no geometry", async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                code: "Ok",
                routes: [
                    {
                        distance: 1000,
                        duration: 200,
                    },
                ],
            }),
        });

        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.navigateToToilet(toilet);

        expect(mockClearNavigation).toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useNavigateWc.navigateToToilet.catch3",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useNavigateWc.navigateToToilet.catch4",
                },
            }
        );
    });

    test("handles navigation request errors", async () => {
        global.fetch.mockRejectedValue(new Error("Network error"));

        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.navigateToToilet(toilet);

        expect(mockClearNavigation).toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useNavigateWc.navigateToToilet.catch5",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useNavigateWc.navigateToToilet.catch6",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });
});

describe("useNavigateToToilet - calculateToiletDistance", () => {
    test("ignores invalid toilet coordinates", async () => {
        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.calculateToiletDistance({
            _id: "toilet-1",
        });

        expect(mockRequestForegroundPermissionsAsync).not.toHaveBeenCalled();
        expect(global.fetch).not.toHaveBeenCalled();
    });

    test("returns when location permission is denied", async () => {
        mockRequestForegroundPermissionsAsync.mockResolvedValue({
            status: "denied",
        });

        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.calculateToiletDistance(toilet);

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useNavigateWc.navigateToToilet.locGrant1",
            {
                type: "custom",
                data: {
                    type: "warning",
                    text2: "toast.useNavigateWc.navigateToToilet.locGrant2",
                },
            }
        );

        expect(global.fetch).not.toHaveBeenCalled();
    });

    test("stores distance and duration when calculation succeeds", async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                code: "Ok",
                routes: [
                    {
                        distance: 850,
                        duration: 180,
                    },
                ],
            }),
        });

        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.calculateToiletDistance(toilet);

        expect(mockSetToiletRouteInfo).toHaveBeenCalledWith(
            850,
            180
        );
    });

    test("handles a failed distance route", async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                code: "NoRoute",
            }),
        });

        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.calculateToiletDistance(toilet);

        expect(mockSetToiletRouteInfo).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useNavigateWc.navigateToToilet.catch1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useNavigateWc.navigateToToilet.catch2",
                },
            }
        );
    });

    test("handles missing distance routes", async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                code: "Ok",
                routes: [],
            }),
        });

        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.calculateToiletDistance(toilet);

        expect(mockSetToiletRouteInfo).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useNavigateWc.navigateToToilet.catch3",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useNavigateWc.navigateToToilet.catch4",
                },
            }
        );
    });

    test("handles distance request errors", async () => {
        global.fetch.mockRejectedValue(new Error("Network error"));

        const { result } = await renderHook(() => useNavigateToToilet());

        await result.current.calculateToiletDistance(toilet);

        expect(mockSetToiletRouteInfo).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useNavigateWc.navigateToToilet.catch5",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useNavigateWc.navigateToToilet.catch6",
                },
            }
        );
    });
});