import { createContext, useContext, useState } from "react";
import Colors from "../constants/colors";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("dark");

    const value = {
        theme,
        colors: Colors[theme],
        toggleTheme: () =>
            setTheme((t) => (t === "dark" ? "light" : "dark")),
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);