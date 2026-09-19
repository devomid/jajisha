import "react-native-gesture-handler";

import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";

import { useSettingsStore } from "../store/settingsStore";
import { getPaperTheme } from "../src/constants/paperTheme";
import { initI18n } from "../src/i18n";
import WaitingOverlay from "../components/waiting/waitingOverlay";

import { ToastProvider } from "react-native-toast-notifications";
import AppToast from "../components/toast/appToast";

export default function RootLayout() {
    const scheme = useColorScheme();
    const themeSetting = useSettingsStore(state => state.theme);

    const isDark =
        themeSetting === "System"
            ? scheme === "dark"
            : themeSetting === "Dark";

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
                    <ToastProvider
                        placement="top"
                        duration={4500}
                        animationType="zoom-in"
                        animationDuration={290}
                        swipeEnabled={true}
                        renderType={{
                            custom: (toast) => (
                                <AppToast {...toast} />
                            ),
                        }}
                    >
                        <Slot />
                    </ToastProvider>
                    <WaitingOverlay />
                </PaperProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}