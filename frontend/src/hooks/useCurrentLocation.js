import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";
import { useToast } from "react-native-toast-notifications";

import logger from "../utils/logger";


export default function useCurrentLocation() {

    const { t } = useTranslation();
    const toast = useToast();

    const [location, setLocation] = useState(null);


    useEffect(() => {
        (async () => {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();

                if (status !== "granted") {
                    logger.warn("Location permission denied");
                    if (toast?.show) {
                        toast.show(t("toast.useCurrentLocation.locGrant"), {
                            type: "custom",
                            data: {
                                type: "warning",
                                text2: t("toast.useCurrentLocation.locGrant2")
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
                    toast.show(t("toast.useCurrentLocation.catch1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useCurrentLocation.catch2")
                        },
                    });
                }
            }
        })();
    }, []);

    return location;
}

