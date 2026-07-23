import { useColorScheme, Platform } from "react-native";
import Colors from "../constants/colors"

export default function useThemeColor() {
    const scheme = useColorScheme();

    const forcedWeb = "dark"; // or "light"

    const finalScheme =
        Platform.OS === "web" ? forcedWeb : scheme;

    return finalScheme === "dark"
        ? Colors.dark
        : Colors.light;
}