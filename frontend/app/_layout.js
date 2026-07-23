import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import { getPaperTheme } from "../src/constants/paperTheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import MenuDrawer from "../components/menuDrawer/drawer";
import { useEffect, useState } from "react";
import { initI18n } from "../src/i18n";

export default function RootLayout() {
    const scheme = useColorScheme();
    const isDark = scheme === "dark";
    const theme = getPaperTheme(isDark);
    const [ready, setReady] = useState(false);

    useEffect(() => {

        const load = async () => {

            await initI18n();

            setReady(true);

        };

        load();

    }, []);

    if (!ready)
        return null;

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