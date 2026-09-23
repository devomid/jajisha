import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logger from "../utils/logger";

export const useSettingsStore = create(
    persist(
        (set) => ({
            distanceUnit: "Metric",
            theme: "System",
            themePreference: "System",
            mapType: 'standard',
            showMyLocation: true,
            showCompass: true,

            setShowCompass: (showCompass) => set({ showCompass }),

            setShowMyLocation: (showMyLocation) => set({ showMyLocation }),

            setMapType: (mapType) =>
                set((state) => {
                    if (mapType === "satellite") {
                        return {
                            mapType,
                            theme: "Dark",
                        };
                    }

                    return {
                        mapType,
                        theme: state.themePreference,
                    };
                }),

            setDistanceUnit: (distanceUnit) =>
                set({ distanceUnit }),

            setTheme: (theme) =>
                set((state) => ({
                    themePreference: theme,
                    theme: state.mapType === "satellite" ? "Dark" : theme,
                })),
        }),
        {
            name: "jajisha-settings",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                distanceUnit: state.distanceUnit,
                theme: state.theme,
                themePreference: state.themePreference,
                mapType: state.mapType,
                showMyLocation: state.showMyLocation,
                showCompass: state.showCompass,
            }),
            onRehydrateStorage: () => {
                return (state, error) => {
                    if (error) {
                        logger.error("Failed to restore settings", {
                            error: error.message,
                        });
                    }
                };
            },
        }
    )
);