import * as Location from "expo-location";
import { useEffect, useState } from "react";
import useWaitingSystemStore from "../../store/waitingSystemStore";
import { useToast } from "react-native-toast-notifications";
import logger from "../utils/logger";

export default function useCurrentLocation() {

    const toast = useToast();

    const setGetCurrentLocationWaiting = useWaitingSystemStore(state => state.setGetCurrentLocationWaiting);
    const setGetCurrentLocationEndWaiting = useWaitingSystemStore(state => state.setGetCurrentLocationEndWaiting);
    const [location, setLocation] = useState(null);


    useEffect(() => {
        (async () => {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();

                if (status !== "granted") {
                    logger.warn("Location permission denied");
                    if (toast?.show) {
                        toast.show("Location Permission must be granted!", {
                            type: "custom",
                            data: {
                                type: "warning",
                                text2: "Please allow location access in Settings.",
                            },
                        });
                    }

                    return;
                }

                const current =
                    await Location.getCurrentPositionAsync({});

                const { latitude, longitude } = current.coords;

                if (
                    !Number.isFinite(latitude) ||
                    !Number.isFinite(longitude)
                ) {
                    return;
                }
                logger.debug("Current location obtained");
                setLocation(current);

            } catch (error) {
                logger.error("Failed to get current location", {
                    error: error.message,
                });
                if (toast?.show) {
                    toast.show("Could not get your location", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Please check your location services and try again.",
                        },
                    });
                }
            }
        })();
    }, []);

    return location;
}

