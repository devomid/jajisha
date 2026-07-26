import { create } from "zustand";

const initialWcData = {
    name: "",
    location: null,
    address: "",
    isFree: true,
    price: "",
    description: "",
    amenities: {
        western: false,
        iranian: false,
        wheelchairAccessible: false,
        babyChanging: false,
        soap: false,
        toiletPaper: false,
        warmWater: false,
        handDryer: false,
    },
    ratings: {
        cleanliness: 0,
        odor: 0,
        amenitiesHealth: 0,
        light: 0,
        privacy: 0,
        crowd: 0,
    },
};

export const useWcDataStore = create((set) => ({
    wcData: structuredClone(initialWcData),

    isPickingLocation: false,
    pickedCoordinate: null,
    mapCenter: null,

    setMapCenter: (region) =>
        set({
            mapCenter: {
                latitude: region.latitude,
                longitude: region.longitude,
            },
        }),

    setPickedCoordinate: (coordinate) =>
        set({ pickedCoordinate: coordinate }),

    clearPickedCoordinate: () =>
        set({ pickedCoordinate: null }),

    setWcData: (updater) =>
        set((state) => ({
            wcData:
                typeof updater === "function"
                    ? updater(state.wcData)
                    : updater,
        })),

    startPickingLocation: () =>
        set({ isPickingLocation: true }),

    stopPickingLocation: () =>
        set({ isPickingLocation: false }),

    setPickedLocation: ({ latitude, longitude, address = "" }) =>
        set((state) => ({
            isPickingLocation: false,
            wcData: {
                ...state.wcData,
                location: {
                    latitude,
                    longitude,
                },
                address,
            },
        })),

    resetWcData: () =>
        set({
            isPickingLocation: false,
            wcData: structuredClone(initialWcData),
        }),
}));