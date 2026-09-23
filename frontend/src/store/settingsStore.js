import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logger from "../utils/logger";

export const useSettingsStore = create(
    persist(
        (set) => ({
            distanceUnit: "Metric",
            theme: "System",
            mapType: 'standard',
            showMyLocation: true,
            showCompass: true,
            themeBeforeSatellite: null,

            setShowCompass: (showCompass) => set({ showCompass }),

            setShowMyLocation: (showMyLocation) => set({ showMyLocation }),

            setMapType: (mapType) =>
                set((state) => {
                    if (mapType === "satellite" && state.mapType !== "satellite") {
                        return {
                            mapType,
                            themeBeforeSatellite: state.theme,
                            theme: "Dark",
                        };
                    }

                    if (mapType !== "satellite" && state.mapType === "satellite") {
                        return {
                            mapType,
                            theme: state.themeBeforeSatellite ?? state.theme,
                            themeBeforeSatellite: null,
                        };
                    }

                    return { mapType };
                }),

            setDistanceUnit: (distanceUnit) =>
                set({ distanceUnit }),

            setTheme: (theme) =>
                set((state) => ({
                    theme: state.mapType === "satellite" ? "Dark" : theme,
                })),
        }),
        {
            name: "jajisha-settings",
            storage: createJSONStorage(() => AsyncStorage),
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