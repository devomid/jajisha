import React from "react";
import { Text, Pressable } from "react-native";
import {
    render,
    fireEvent,
} from "@testing-library/react-native";

import {
    ThemeProvider,
    useTheme,
} from "../../src/api/ThemeContext";

function TestComponent() {
    const { theme, colors, toggleTheme } = useTheme();

    return (
        <>
            <Text testID="theme">
                {theme}
            </Text>

            <Text testID="primary">
                {colors.primary}
            </Text>

            <Pressable
                testID="toggle"
                onPress={toggleTheme}
            >
                <Text>Toggle</Text>
            </Pressable>
        </>
    );
}

describe("ThemeContext", () => {
    test("starts with dark theme", async () => {
        const rendered = await render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(
            rendered.getByTestId("theme").props.children
        ).toBe("dark");
    });

    test("provides colors for the current theme", async () => {
        const rendered = await render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(
            rendered.getByTestId("primary").props.children
        ).toBeTruthy();
    });

    test("toggles from dark to light", async () => {
        const rendered = await render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        await fireEvent.press(
            rendered.getByTestId("toggle")
        );

        expect(
            rendered.getByTestId("theme").props.children
        ).toBe("light");
    });

    test("toggles from light back to dark", async () => {
        const rendered = await render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        await fireEvent.press(
            rendered.getByTestId("toggle")
        );

        await fireEvent.press(
            rendered.getByTestId("toggle")
        );

        expect(
            rendered.getByTestId("theme").props.children
        ).toBe("dark");
    });
});