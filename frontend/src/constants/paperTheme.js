import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import Colors from "../constants/colors";

export function getPaperTheme(isDark) {
    const c = isDark ? Colors.dark : Colors.light;

    const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;

    return {
        ...baseTheme,

        colors: {
            ...baseTheme.colors,

            primary: c.primary,
            secondary: c.secondary,
            background: c.background,
            surface: c.surface,
            onSurface: c.text,
            onSurfaceVariant: c.textSecondary,
            outline: c.border,
            error: c.error,

            // 👇 your custom tokens
            primaryDark: c.primaryDark,
            primaryDarker: c.primaryDarker,
            primaryLight: c.primaryLight,
            primaryLighter: c.primaryLighter,

            secondaryDark: c.secondaryDark,
            secondaryDarker: c.secondaryDarker,
            secondaryLight: c.secondaryLight,
            secondaryLighter: c.secondaryLighter,

            focused: c.focused,
            unfocused: c.unfocused,

            success: c.success,
            warning: c.warning,

            white: c.white,
            black: c.black,

            text: c.text,
            textSecondary: c.textSecondary,

            border: c.border,

            nav: c.nav
        },
    };
}
