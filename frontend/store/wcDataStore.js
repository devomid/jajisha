import { create } from "zustand";

const initialWcData = {
    name: "",
    description: "",

    location: {
        type: "Point",
        coordinates: null, // [longitude, latitude]
    },

    address: "",

    isFree: true,
    price: 0,

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

    // Initial rating given by the creator
    ratings: {
        cleanliness: 0,
        odor: 0,
        amenitiesHealth: 0,
        light: 0,
        privacy: 0,
        crowd: 0,
    },

    photos: [],
};

export const useWcDataStore = create((set) => ({
    wcData: structuredClone(initialWcData),

    pickedCoordinate: null,
    mapCenter: null,
    toilets: [],
    selectedToilet: null,
    navigation: {
        target: null,
        route: null,
        distance: null,
        duration: null,
        status: "idle",
    },

    setNavigationTarget: (toilet) =>
        set(state => ({
            navigation: {
                ...state.navigation,
                target: toilet,
                route: null,
                distance: null,
                duration: null,
                status: "routing",
            },
        })),

    setNavigationRoute: (route) =>
        set(state => ({
            navigation: {
                ...state.navigation,
                route,
            },
        })),

    setNavigationDistance: (distance) =>
        set(state => ({
            navigation: {
                ...state.navigation,
                distance,
            },
        })),

    setNavigationDuration: (duration) =>
        set(state => ({
            navigation: {
                ...state.navigation,
                duration,
            },
        })),

    setNavigationStatus: (status) =>
        set(state => ({
            navigation: {
                ...state.navigation,
                status,
            },
        })),

    startNavigation: () =>
        set(state => ({
            navigation: {
                ...state.navigation,
                status: "navigating",
            },
        })),

    clearNavigation: () =>
        set({
            navigation: {
                target: null,
                route: null,
                distance: null,
                duration: null,
                status: "idle",
            },
        }),
    setSelectedToilet: (toilet) =>
        set({ selectedToilet: toilet }),

    clearSelectedToilet: () =>
        set({ selectedToilet: null }),

    addToilet: (toilet) =>
        set(state => ({
            toilets: [...state.toilets, toilet],
        })),

    setToilets: (toilets) =>
        set({ toilets }),

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