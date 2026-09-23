import { renderHook } from "@testing-library/react-native";
import * as ReactNative from "react-native";

import useThemeColor from "../../src/hooks/useThemeColor";
import Colors from "../../src/constants/colors";

describe("useThemeColor", () => {
    const originalOS = ReactNative.Platform.OS;

    afterEach(() => {
        ReactNative.Platform.OS = originalOS;
        jest.restoreAllMocks();
    });

    test("returns dark colors for dark native scheme", async () => {
        ReactNative.Platform.OS = "ios";

        jest
            .spyOn(ReactNative, "useColorScheme")
            .mockReturnValue("dark");

        const { result } = await renderHook(
            () => useThemeColor()
        );

        expect(result.current).toEqual(Colors.dark);
    });

    test("returns light colors for light native scheme", async () => {
        ReactNative.Platform.OS = "ios";

        jest
            .spyOn(ReactNative, "useColorScheme")
            .mockReturnValue("light");

        const { result } = await renderHook(
            () => useThemeColor()
        );

        expect(result.current).toEqual(Colors.light);
    });

    test("returns dark colors on web regardless of system scheme", async () => {
        ReactNative.Platform.OS = "web";

        jest
            .spyOn(ReactNative, "useColorScheme")
            .mockReturnValue("light");

        const { result } = await renderHook(
            () => useThemeColor()
        );

        expect(result.current).toEqual(Colors.dark);
    });
});
