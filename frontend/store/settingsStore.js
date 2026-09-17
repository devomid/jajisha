import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSettingsStore = create(
    persist(
        (set) => ({
            distanceUnit: "Metric",
            theme: "System",
            mapType: 'standard',
            showMyLocation: true,
            showCompass: true,

            setShowCompass: (showCompass) => set({ showCompass }),

            setShowMyLocation: (showMyLocation) => set({ showMyLocation }),

            setMapType: (mapType) => set({ mapType }),

            setDistanceUnit: (distanceUnit) =>
                set({ distanceUnit }),

            setTheme: (theme) =>
                set({ theme }),
        }),
        {
            name: "jajisha-settings",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);