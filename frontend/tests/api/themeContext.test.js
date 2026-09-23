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
            <Text testID="theme">{theme}</Text>
            <Text testID="primary">{colors.primary}</Text>

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
    test("starts with dark theme", () => {
        const { getByTestId } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(getByTestId("theme").props.children).toBe("dark");
    });

    test("provides colors for the current theme", () => {
        const { getByTestId } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(getByTestId("primary").props.children).toBeTruthy();
    });

    test("toggles from dark to light", () => {
        const { getByTestId } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        fireEvent.press(getByTestId("toggle"));

        expect(getByTestId("theme").props.children).toBe("light");
    });

    test("toggles from light back to dark", () => {
        const { getByTestId } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        fireEvent.press(getByTestId("toggle"));
        fireEvent.press(getByTestId("toggle"));

        expect(getByTestId("theme").props.children).toBe("dark");
    });
});