import { renderHook, waitFor } from "@testing-library/react-native";

import useCurrentLocation from "../../src/hooks/useCurrentLocation";

const mockToastShow = jest.fn();

const mockRequestForegroundPermissionsAsync = jest.fn();
const mockGetCurrentPositionAsync = jest.fn();

jest.mock("expo-location", () => ({
    requestForegroundPermissionsAsync:
        mockRequestForegroundPermissionsAsync,
    getCurrentPositionAsync:
        mockGetCurrentPositionAsync,
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
        const { result } = renderHook(() => useCurrentLocation());

        await waitFor(() => {
            expect(result.current).not.toBeNull();
        });

        expect(result.current).toEqual({
            coords: {
                latitude: 35.7001,
                longitude: 51.4001,
            },
        });

        expect(mockRequestForegroundPermissionsAsync).toHaveBeenCalled();
        expect(mockGetCurrentPositionAsync).toHaveBeenCalledWith({});
        expect(mockToastShow).not.toHaveBeenCalled();
    });

    test("does not set location when permission is denied", async () => {
        mockRequestForegroundPermissionsAsync.mockResolvedValue({
            status: "denied",
        });

        const { result } = renderHook(() => useCurrentLocation());

        await waitFor(() => {
            expect(mockRequestForegroundPermissionsAsync).toHaveBeenCalled();
        });

        expect(result.current).toBeNull();

        expect(mockGetCurrentPositionAsync).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useCurrentLocation.locGrant",
            {
                type: "custom",
                data: {
                    type: "warning",
                    text2: "toast.useCurrentLocation.locGrant2",
                },
            }
        );
    });

    test("handles location request errors", async () => {
        mockGetCurrentPositionAsync.mockRejectedValue(
            new Error("Location error")
        );

        const { result } = renderHook(() => useCurrentLocation());

        await waitFor(() => {
            expect(mockToastShow).toHaveBeenCalled();
        });

        expect(result.current).toBeNull();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useCurrentLocation.catch1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useCurrentLocation.catch2",
                },
            }
        );
    });
});