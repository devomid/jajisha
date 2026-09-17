import { useWcDataStore } from "../../store/wcDataStore";
import * as Location from "expo-location";
import useWaitingSystemStore from "../../store/waitingSystemStore";

export const useNavigateToToilet = () => {

    const setNavigationRoute = useWcDataStore(state => state.setNavigationRoute);
    const setNavigationDistance = useWcDataStore(state => state.setNavigationDistance);
    const setNavigationDuration = useWcDataStore(state => state.setNavigationDuration);
    const setNavigationStatus = useWcDataStore(state => state.setNavigationStatus);
    const setGetCurrentLocationWaiting = useWaitingSystemStore(state => state.setGetCurrentLocationWaiting);
    const setGetCurrentLocationEndWaiting = useWaitingSystemStore(state => state.setGetCurrentLocationEndWaiting);
    const setCalculatingDistanceWaiting = useWaitingSystemStore(state => state.setCalculatingDistanceWaiting);
    const setCalculatingDistanceEndWaiting = useWaitingSystemStore(state => state.setCalculatingDistanceEndWaiting);

    const navigateToToilet = async (toilet) => {

        try {
            setGetCurrentLocationWaiting();
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                console.log("Location permission denied");
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
                console.log("OSRM ERROR:", data.code);
                return;
            }

            const selectedRoute = data.routes[0];

            setNavigationRoute(selectedRoute.geometry);
            setNavigationDistance(selectedRoute.distance);
            setNavigationDuration(selectedRoute.duration);

            // Route is ready to preview
            setNavigationStatus("preview");

        } catch (error) {

            console.error("NAVIGATION ERROR:", error);

            setNavigationStatus("idle");
        } finally {
            setGetCurrentLocationEndWaiting();
        }
    };

    const calculateToiletDistance = async (toilet) => {
        try {
            setCalculatingDistanceWaiting();
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                console.log("Location permission denied");
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

            if (data.code !== "Ok") {
                console.log("OSRM ERROR:", data.code);
                return;
            }

            const selectedRoute = data.routes[0];

            useWcDataStore.getState().setToiletRouteInfo(
                selectedRoute.distance,
                selectedRoute.duration
            );

        } catch (error) {
            console.error("TOILET DISTANCE ERROR:", error);
        } finally {
            setCalculatingDistanceEndWaiting();
        }
    };

    return {
        navigateToToilet,
        calculateToiletDistance
    };
};