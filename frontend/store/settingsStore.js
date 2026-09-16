import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSettingsStore = create(
    persist(
        (set) => ({
            distanceUnit: "Metric",

            setDistanceUnit: (distanceUnit) =>
                set({ distanceUnit }),
        }),
        {
            name: "jajisha-settings",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);