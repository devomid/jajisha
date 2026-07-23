import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import { getPaperTheme } from "../src/constants/paperTheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import MenuDrawer from "../components/menuDrawer/drawer";

export default function RootLayout() {
    const scheme = useColorScheme();
    const isDark = scheme === "dark";
    const theme = getPaperTheme(isDark);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <PaperProvider
                    settings={{ rippleEffectEnabled: false }}
                    theme={theme}
                >
                    <MenuDrawer/>
                </PaperProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}