import * as Location from "expo-location";
import { useEffect, useState } from "react";
import useWaitingSystemStore from "../../store/waitingSystemStore";
import { useToast } from "react-native-toast-notifications";


export default function useCurrentLocation() {

    const toast = useToast();

    const setGetCurrentLocationWaiting = useWaitingSystemStore(state => state.setGetCurrentLocationWaiting);
    const setGetCurrentLocationEndWaiting = useWaitingSystemStore(state => state.setGetCurrentLocationEndWaiting);
    const [location, setLocation] = useState(null);


    useEffect(() => {

        (async () => {

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {

                toast.show("Location Permission must be granted!", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Please allow location access in Settings.",
                    },
                });

                return;
            }

            const current = await Location.getCurrentPositionAsync({});

            setLocation(current);
        })();
    }, []);

    return location;
}

