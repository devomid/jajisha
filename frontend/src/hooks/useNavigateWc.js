import { useWcDataStore } from "../../store/wcDataStore";
import * as Location from "expo-location";
import useWaitingSystemStore from "../../store/waitingSystemStore";
import { useToast } from "react-native-toast-notifications";


export const useNavigateToToilet = () => {

    const toast = useToast();

    const setNavigationRoute = useWcDataStore(state => state.setNavigationRoute);
    const setNavigationDistance = useWcDataStore(state => state.setNavigationDistance);
    const setNavigationDuration = useWcDataStore(state => state.setNavigationDuration);
    const setNavigationStatus = useWcDataStore(state => state.setNavigationStatus);
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);

    const navigateToToilet = async (toilet) => {

        const waitingId = startWaiting("Locating...");

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            updateWaiting(
                waitingId,
                "Finding you..."
            )
            if (status !== "granted") {
                // console.log("Location permission denied");
                if (toast?.show) {
                    toast.show("Location Permission must be granted!", {
                        type: "custom",
                        data: {
                            type: "warning",
                            text2: "Please allow location access in Settings.",
                        },
                    })
                };
                return;
            }

            const currentLocation =
                await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

            const origin = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            };

            const destination = {
                latitude: toilet.location.coordinates[1],
                longitude: toilet.location.coordinates[0],
            };

            const coordinates =
                `${origin.longitude},${origin.latitude};` +
                `${destination.longitude},${destination.latitude}`;

            const url =
                `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
                `?overview=full&geometries=geojson&steps=true`;

            const response = await fetch(url);

            const data = await response.json();

            if (data.code !== "Ok") {
                // console.log("OSRM ERROR:", data.code);
                if (toast?.show) {
                    toast.show("Could not get map and location", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
                        },
                    })
                };
                return;
            }

            const selectedRoute = data.routes[0];

            setNavigationRoute(selectedRoute.geometry);
            setNavigationDistance(selectedRoute.distance);
            setNavigationDuration(selectedRoute.duration);

            // Route is ready to preview
            setNavigationStatus("preview");

        } catch (error) {
            // console.error("NAVIGATION ERROR:", error);
            if (toast?.show) {
                toast.show("Something went wrong getting map features!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. Check and try again.",
                    },
                })
            };
            setNavigationStatus("idle");

        } finally {
            endWaiting(waitingId);
        }
    };

    const calculateToiletDistance = async (toilet) => {

        const waitingId = startWaiting("Finding a fast way to there...");

        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                // console.log("Location permission denied");
                toast.show("Location Permission must be granted!", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Please allow location access in Settings.",
                    },
                });
                return;
            }

            const currentLocation =
                await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

            const origin = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            };

            const destination = {
                latitude: toilet.location.coordinates[1],
                longitude: toilet.location.coordinates[0],
            };

            const coordinates =
                `${origin.longitude},${origin.latitude};` +
                `${destination.longitude},${destination.latitude}`;

            const url =
                `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
                `?overview=false`;

            const response = await fetch(url);
            const data = await response.json();

            updateWaiting(waitingId, "Hold it...")

            if (data.code !== "Ok") {
                // console.log("OSRM ERROR:", data.code);
                toast.show("Could not get map and location", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "Try again a few moments later.",
                    },
                });
                return;
            }

            const selectedRoute = data.routes[0];

            useWcDataStore.getState().setToiletRouteInfo(
                selectedRoute.distance,
                selectedRoute.duration
            );

        } catch (error) {
            // console.error("TOILET DISTANCE ERROR:", error);
            if (toast?.show) {
                toast.show("Something went wrong getting map features!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. Check and try again.",
                    },
                })
            };
        } finally {
            endWaiting(waitingId);
        }
    };

    return {
        navigateToToilet,
        calculateToiletDistance
    };
};