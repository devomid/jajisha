import { useWcDataStore } from "../../store/wcDataStore";
import * as Location from "expo-location";

export const useNavigateToToilet = () => {

    const setNavigationRoute = useWcDataStore(state => state.setNavigationRoute);
    const setNavigationDistance = useWcDataStore(state => state.setNavigationDistance);
    const setNavigationDuration = useWcDataStore(state => state.setNavigationDuration);
    const setNavigationStatus = useWcDataStore(state => state.setNavigationStatus);

    const navigateToToilet = async (toilet) => {
        try {
            // 1. Ask for permission
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                console.log("Location permission denied");
                return;
            }

            // 2. Get current GPS position
            const currentLocation =
                await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

            const origin = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            };

            // 3. Toilet location
            const destination = {
                latitude: toilet.location.coordinates[1],
                longitude: toilet.location.coordinates[0],
            };

            // console.log("ORIGIN:", origin);
            // console.log("DESTINATION:", destination);

            // 4. Convert to OSRM coordinate format:
            // longitude,latitude
            const coordinates =
                `${origin.longitude},${origin.latitude};` +
                `${destination.longitude},${destination.latitude}`;

            // 5. Build OSRM URL
            const url =
                `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
                `?overview=full&geometries=geojson&steps=true`;

            // console.log("OSRM URL:", url);

            // 6. Ask OSRM for the route
            const response = await fetch(url);

            const data = await response.json();

            // console.log("OSRM RESPONSE:", data);

            if (data.code !== "Ok") {
                // console.log("OSRM ERROR:", data.code);
                return;
            }

            // 7. Take the first/best route
            const selectedRoute = data.routes[0];

            // 8. Save route information
            setNavigationRoute(selectedRoute.geometry);
            setNavigationDistance(selectedRoute.distance);
            setNavigationDuration(selectedRoute.duration);
            setNavigationStatus("preview");
        } catch (error) {
            console.error("NAVIGATION ERROR:", error);
            setNavigationStatus("idle");
        }
    }
    return { navigateToToilet };
};