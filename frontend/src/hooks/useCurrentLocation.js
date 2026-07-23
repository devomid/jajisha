import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function useCurrentLocation() {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") return;

            const current =
                await Location.getCurrentPositionAsync({});

            setLocation(current);
        })();
    }, []);

    return location;
}

