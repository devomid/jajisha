import { renderHook } from "@testing-library/react-native";
import { Platform, useColorScheme } from "react-native";

import useThemeColor from "../../src/hooks/useThemeColor";
import Colors from "../../src/constants/colors";

jest.mock("react-native", () => {
    const actual = jest.requireActual("react-native");

    return {
        ...actual,
        useColorScheme: jest.fn(),
    };
});

describe("useThemeColor", () => {
    const originalOS = Platform.OS;

    afterEach(() => {
        Platform.OS = originalOS;
        jest.clearAllMocks();
    });

    test("returns dark colors for dark native scheme", () => {
        Platform.OS = "ios";
        useColorScheme.mockReturnValue("dark");

        const { result } = renderHook(() => useThemeColor());

        expect(result.current).toEqual(Colors.dark);
    });

    test("returns light colors for light native scheme", () => {
        Platform.OS = "ios";
        useColorScheme.mockReturnValue("light");

        const { result } = renderHook(() => useThemeColor());

        expect(result.current).toEqual(Colors.light);
    });

    test("returns dark colors on web regardless of system scheme", () => {
        Platform.OS = "web";
        useColorScheme.mockReturnValue("light");

        const { result } = renderHook(() => useThemeColor());

        expect(result.current).toEqual(Colors.dark);
    });
});