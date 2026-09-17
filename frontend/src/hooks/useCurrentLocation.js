import * as Location from "expo-location";
import { useEffect, useState } from "react";
import useWaitingSystemStore from "../../store/waitingSystemStore";

export default function useCurrentLocation() {

    const setGetCurrentLocationWaiting = useWaitingSystemStore(state => state.setGetCurrentLocationWaiting);
    const setGetCurrentLocationEndWaiting = useWaitingSystemStore(state => state.setGetCurrentLocationEndWaiting);
    const [location, setLocation] = useState(null);


    useEffect(() => {

        (async () => {

            setGetCurrentLocationWaiting();

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") return;

            const current = await Location.getCurrentPositionAsync({});

            setLocation(current);
        })();
    }, []);

    setGetCurrentLocationEndWaiting();
    return location;
}

