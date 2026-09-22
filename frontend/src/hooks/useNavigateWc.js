import { useRef } from "react";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";

import { useToast } from "react-native-toast-notifications";
import { useWcDataStore } from "../../store/wcDataStore";

import useWaitingSystemStore from "../../store/waitingSystemStore";
import logger from "../utils/logger";


export const useNavigateToToilet = () => {

    const { t } = useTranslation();

    const toast = useToast();
    const distanceRequestRef = useRef(0);
    const navigationRequestRef = useRef(0);

    const setNavigationRoute = useWcDataStore(state => state.setNavigationRoute);
    const setNavigationDistance = useWcDataStore(state => state.setNavigationDistance);
    const setNavigationDuration = useWcDataStore(state => state.setNavigationDuration);
    const setNavigationStatus = useWcDataStore(state => state.setNavigationStatus);
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);
    const clearNavigation = useWcDataStore(state => state.clearNavigation);

    const navigateToToilet = async (toilet) => {
        const waitingId = startWaiting(t("waitingSystem.locating"));
        const requestId = ++navigationRequestRef.current;

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (requestId !== navigationRequestRef.current) {
                return;
            };


            if (status !== "granted") {
                logger.warn("Navigation location permission denied");
                if (toast?.show) {
                    toast.show(t("toast.useNavigateWc.navigateToToilet.locGrant1"), {
                        type: "custom",
                        data: {
                            type: "warning",
                            text2: t("toast.useNavigateWc.navigateToToilet.locGrant2")
                        },
                    })
                };
                clearNavigation();
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            if (requestId !== navigationRequestRef.current) {
                return;
            }

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

            logger.debug("Requesting navigation route");
            const response = await fetch(url);
            if (requestId !== navigationRequestRef.current) {
                return;
            }
            const data = await response.json();
            if (requestId !== navigationRequestRef.current) {
                return;
            }

            if (data.code !== "Ok") {
                logger.warn("Navigation route request failed", {
                    code: data.code,
                });
                if (requestId !== navigationRequestRef.current) {
                    return;
                };

                if (toast?.show) {
                    toast.show(t("toast.useNavigateWc.navigateToToilet.catch1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useNavigateWc.navigateToToilet.catch2")
                        },
                    })
                };
                clearNavigation();
                return;
            };
            if (!data.routes?.length || !data.routes[0]?.geometry) {
                if (toast?.show) {
                    toast.show(t("toast.useNavigateWc.navigateToToilet.catch3"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useNavigateWc.navigateToToilet.catch4")
                        },
                    });
                }
                logger.info("Navigation route calculated");

                clearNavigation();
                return;
            };

            const selectedRoute = data.routes[0];
            const currentNavigationTarget = useWcDataStore.getState().navigation.target;

            if (currentNavigationTarget?._id !== toilet._id) {
                return;
            };

            setNavigationRoute(selectedRoute.geometry);
            setNavigationDistance(selectedRoute.distance);
            setNavigationDuration(selectedRoute.duration);

            // Route is ready to preview
            setNavigationStatus("preview");

        } catch (error) {
            logger.error("Navigation route error", {
                error: error.message,
            });
            if (requestId !== navigationRequestRef.current) {
                return;
            }
            if (toast?.show) {
                toast.show(t("toast.useNavigateWc.navigateToToilet.catch5"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useNavigateWc.navigateToToilet.catch6")
                    },
                })
            };
            clearNavigation();

        } finally {
            endWaiting(waitingId);
        }
    };

    const calculateToiletDistance = async (toilet) => {

        if (
            !toilet?.location?.coordinates ||
            toilet.location.coordinates.length < 2
        ) {
            return;
        }

        const requestId = ++distanceRequestRef.current;

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (requestId !== distanceRequestRef.current) {
                return;
            }
            if (status !== "granted") {
                logger.warn("Distance calculation location permission denied");
                if (toast?.show) {
                    toast.show(t("toast.useNavigateWc.navigateToToilet.locGrant1"), {
                        type: "custom",
                        data: {
                            type: "warning",
                            text2: t("toast.useNavigateWc.navigateToToilet.locGrant2")
                        },
                    })
                };
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            if (requestId !== distanceRequestRef.current) {
                return;
            }

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
            logger.debug("Requesting toilet distance");
            const response = await fetch(url);
            if (requestId !== distanceRequestRef.current) {
                return;
            }
            const data = await response.json();
            if (requestId !== distanceRequestRef.current) {
                return;
            }


            if (data.code !== "Ok") {
                logger.warn("Distance calculation route request failed", {
                    code: data.code,
                });

                if (toast?.show) {
                    toast.show(t("toast.useNavigateWc.navigateToToilet.catch1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useNavigateWc.navigateToToilet.catch2")
                        },
                    })
                };

                return;
            }
            if (!data.routes?.length) {
                if (toast?.show) {
                    toast.show(t("toast.useNavigateWc.navigateToToilet.catch3"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useNavigateWc.navigateToToilet.catch4")
                        },
                    });
                }

                return;
            }

            const selectedRoute = data.routes[0];

            const currentSelectedToilet =
                useWcDataStore.getState().selectedToilet;

            if (currentSelectedToilet?._id !== toilet._id) {
                return;
            }
            logger.debug("Toilet distance calculated");
            useWcDataStore.getState().setToiletRouteInfo(
                selectedRoute.distance,
                selectedRoute.duration
            );

        } catch (error) {
            logger.error("Toilet distance calculation error", {
                error: error.message,
            }); if (requestId !== distanceRequestRef.current) {
                return;
            }
            if (toast?.show) {
                toast.show(t("toast.useNavigateWc.navigateToToilet.catch5"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useNavigateWc.navigateToToilet.catch6")
                    },
                })
            };
        }
    };

    return {
        navigateToToilet,
        calculateToiletDistance
    };
};