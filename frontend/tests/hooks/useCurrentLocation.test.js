import { renderHook, waitFor } from "@testing-library/react-native";
import * as Location from "expo-location";

import useCurrentLocation from "../../src/hooks/useCurrentLocation";

const mockToastShow = jest.fn();

jest.mock("expo-location", () => ({
    __esModule: true,
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn(),
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

    Location.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted",
    });

    Location.getCurrentPositionAsync.mockResolvedValue({
        coords: {
            latitude: 35.7001,
            longitude: 51.4001,
        },
    });
});

describe("useCurrentLocation", () => {
    test("gets and stores the current location successfully", async () => {
        const { result } = await renderHook(() => useCurrentLocation());

        await waitFor(() => {
            expect(
                Location.requestForegroundPermissionsAsync
            ).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(result.current).not.toBeNull();
        });

        expect(result.current).toEqual({
            coords: {
                latitude: 35.7001,
                longitude: 51.4001,
            },
        });

        expect(
            Location.getCurrentPositionAsync
        ).toHaveBeenCalledWith({});

        expect(mockToastShow).not.toHaveBeenCalled();
    });

    test("does not set location when permission is denied", async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValue({
            status: "denied",
        });

        const { result } = await renderHook(() => useCurrentLocation());

        await waitFor(() => {
            expect(
                Location.requestForegroundPermissionsAsync
            ).toHaveBeenCalled();
        });

        expect(result.current).toBeNull();

        expect(
            Location.getCurrentPositionAsync
        ).not.toHaveBeenCalled();

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
        Location.getCurrentPositionAsync.mockRejectedValue(
            new Error("Location error")
        );

        const { result } = await renderHook(() => useCurrentLocation());

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
