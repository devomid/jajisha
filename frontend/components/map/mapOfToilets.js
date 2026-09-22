import { useState, useEffect, forwardRef, useImperativeHandle, useRef, } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import MapView, { Marker, Polyline, } from "react-native-maps";
import * as Location from "expo-location";

import { useTheme } from "react-native-paper";
import { View, Pressable, Text, Image, Platform, } from "react-native";
import { BlurView } from "expo-blur";

import { useWcDataStore } from "../../store/wcDataStore";
import { useNavigateToToilet } from "../../src/hooks/useNavigateWc";
import { useSettingsStore } from "../../store/settingsStore";
import logger from "../../src/utils/logger";
import ButtonComponent from "../Button/Button";


const MapOfToilets = forwardRef(({ currentLocation, onMarkerPress, isPickingLocation, onAddWcPress, }, ref) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const toast = useToast();

    const mapRef = useRef(null);
    const { navigateToToilet, calculateToiletDistance } = useNavigateToToilet();

    const toilets = useWcDataStore(state => state.toilets);
    const setSelectedToilet = useWcDataStore(state => state.setSelectedToilet);
    const clearNavigation = useWcDataStore(state => state.clearNavigation);
    const mapCenter = useWcDataStore(state => state.mapCenter);
    const mapRegion = useWcDataStore(state => state.mapRegion);
    const setMapCenter = useWcDataStore(state => state.setMapCenter);
    const stopPickingLocation = useWcDataStore(state => state.stopPickingLocation);
    const setPickedLocation = useWcDataStore(state => state.setPickedLocation);
    const navigation = useWcDataStore(state => state.navigation);
    const mapType = useSettingsStore(state => state.mapType);
    const showMyLocation = useSettingsStore(state => state.showMyLocation);
    const showCompass = useSettingsStore(state => state.showCompass);

    const regionRef = useRef(initialRegion);
    const navigationLocationRef = useRef(null);
    const headingRef = useRef(0);
    const [heading, setHeading] = useState(0);
    const navigationAltitudeRef = useRef(700);
    const navigationPitchRef = useRef(55);
    const cameraAnimationRef = useRef(false);
    const locationSubscriptionRef = useRef(null);
    const headingSubscriptionRef = useRef(null);
    const routeRequestedRef = useRef(null);

    const {
        target: navigationTarget,
        route: navigationRoute,
        status: navigationStatus,
    } = navigation;

    const initialRegion = {
        latitude: mapRegion?.latitude ?? currentLocation.coords.latitude,
        longitude: mapRegion?.longitude ?? currentLocation.coords.longitude,
        latitudeDelta: mapRegion?.latitudeDelta ?? 0.02,
        longitudeDelta: mapRegion?.longitudeDelta ?? 0.02,
    };

    const [latitudeDelta, setLatitudeDelta] = useState(initialRegion.latitudeDelta);
    const [navigationLocation, setNavigationLocation] = useState(null);
    const [region, setRegion] = useState(initialRegion);

    const markerSize = Math.max(40, Math.min(85, 60 * Math.pow(0.02 / latitudeDelta, 0.25)));
    const navigationRouteCoordinates = navigationRoute?.coordinates?.map(
        ([longitude, latitude]) => ({
            latitude,
            longitude,
        })
    ) || [];

    const navigationCoordinate =
        navigationLocation?.coords ? {
            latitude: navigationLocation.coords.latitude,
            longitude: navigationLocation.coords.longitude,
        } : null;

    // camera update
    const updateNavigationCamera = (
        center,
        newHeading = headingRef.current,
        duration = 300) => {

        if (navigationStatus !== "navigating") { return; }
        if (!mapRef.current) { return; }
        if (!center) { return; }

        const camera = {
            center,
            heading: newHeading,
            pitch: navigationPitchRef.current,
        };

        if (Platform.OS === "ios") {
            camera.altitude = navigationAltitudeRef.current;
        } else {
            camera.zoom = Math.max(12, Math.min(21, 19 - Math.log2(navigationAltitudeRef.current / 250)));
        }

        cameraAnimationRef.current = true;
        mapRef.current.animateCamera(camera, { duration, });

        setTimeout(() => {
            cameraAnimationRef.current = false;
        }, duration + 50);
    };

    //map controls
    useImperativeHandle(
        ref,
        () => ({

            zoomIn: async () => {

                if (!mapRef.current) return;

                // =========================
                // NAVIGATION MODE
                // =========================
                if (navigationStatus === "navigating") {

                    const camera = await mapRef.current.getCamera();

                    navigationAltitudeRef.current = Math.max(
                        180,
                        navigationAltitudeRef.current * 0.65
                    );

                    const newCamera = {
                        center: camera.center,
                        heading: camera.heading,
                        pitch: camera.pitch,
                    };

                    if (Platform.OS === "ios") {

                        newCamera.altitude =
                            navigationAltitudeRef.current;

                    } else {

                        newCamera.zoom = Math.min(
                            21,
                            (camera.zoom ?? 18) + 1
                        );
                    }

                    mapRef.current.animateCamera(
                        newCamera,
                        { duration: 250 }
                    );

                    return;
                }


                // =========================
                // NORMAL / EXPLORING MODE
                // =========================

                const current = regionRef.current;

                if (!current) return;

                const newRegion = {
                    ...current,

                    latitudeDelta: Math.max(
                        current.latitudeDelta * 0.5,
                        0.001
                    ),

                    longitudeDelta: Math.max(
                        current.longitudeDelta * 0.5,
                        0.001
                    ),
                };

                regionRef.current = newRegion;
                setLatitudeDelta(newRegion.latitudeDelta);
                setRegion(newRegion);
                setMapCenter(newRegion);

                mapRef.current.animateToRegion(
                    newRegion,
                    300
                );
            },


            zoomOut: async () => {

                if (!mapRef.current) return;

                // =========================
                // NAVIGATION MODE
                // =========================
                if (navigationStatus === "navigating") {

                    const camera = await mapRef.current.getCamera();

                    navigationAltitudeRef.current = Math.min(
                        3000,
                        navigationAltitudeRef.current * 1.5
                    );

                    const newCamera = {
                        center: camera.center,
                        heading: camera.heading,
                        pitch: camera.pitch,
                    };

                    if (Platform.OS === "ios") {

                        newCamera.altitude =
                            navigationAltitudeRef.current;

                    } else {

                        newCamera.zoom = Math.max(
                            12,
                            (camera.zoom ?? 18) - 1
                        );
                    }

                    mapRef.current.animateCamera(
                        newCamera,
                        { duration: 250 }
                    );

                    return;
                }


                // =========================
                // NORMAL / EXPLORING MODE
                // =========================

                const current = regionRef.current;

                if (!current) return;

                const newRegion = {
                    ...current,

                    latitudeDelta: Math.min(
                        current.latitudeDelta * 2,
                        2
                    ),

                    longitudeDelta: Math.min(
                        current.longitudeDelta * 2,
                        2
                    ),
                };

                regionRef.current = newRegion;
                setMapCenter(newRegion);

                setLatitudeDelta(0.02);
                setRegion(newRegion);

                mapRef.current.animateToRegion(
                    newRegion,
                    500
                );
            },


            recenter: () => {

                // =========================
                // NAVIGATION MODE
                // =========================
                if (navigationStatus === "navigating") {

                    const location =
                        navigationLocationRef.current;

                    if (!location) return;

                    updateNavigationCamera(
                        {
                            latitude:
                                location.coords.latitude,

                            longitude:
                                location.coords.longitude,
                        },

                        headingRef.current,

                        400
                    );

                    return;
                }


                // =========================
                // NORMAL MODE
                // =========================

                const newRegion = {

                    latitude:
                        currentLocation.coords.latitude,

                    longitude:
                        currentLocation.coords.longitude,

                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                };

                regionRef.current = newRegion;

                setLatitudeDelta(0.02);
                setRegion(newRegion);

                mapRef.current.animateToRegion(
                    newRegion,
                    500
                );
            },

        }),

        [
            navigationStatus,
            currentLocation,
            navigationCoordinate,
        ]
    );

    // navigation tracking
    useEffect(() => {

        if (navigationStatus !== "navigating") { return; }

        let mounted = true;

        navigationAltitudeRef.current = 700;
        navigationPitchRef.current = 55;
        headingRef.current = 0;
        setHeading(0);

        const startTracking = async () => {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();

                if (!mounted) {
                    return;
                }

                if (status !== "granted") {
                    if (toast?.show) {
                        toast.show("Location Permission must be granted!", {
                            type: "custom",
                            data: {
                                type: "warning",
                                text2: "Please allow location access in Settings.",
                            },
                        })
                    };

                    clearNavigation();
                    return;
                }


                // GPS
                const locationSubscription =
                    await Location.watchPositionAsync(
                        {
                            accuracy: Location.Accuracy.BestForNavigation,
                            distanceInterval: 2,
                            timeInterval: 500,
                        },
                        location => {

                            if (!mounted) {
                                return;
                            }

                            const { latitude, longitude } = location.coords;

                            if (
                                !Number.isFinite(latitude) ||
                                !Number.isFinite(longitude)
                            ) {
                                return;
                            }

                            navigationLocationRef.current = location;
                            setNavigationLocation(location);

                            const gpsHeading = location.coords.heading;
                            const speed = location.coords.speed;

                            if (
                                Number.isFinite(gpsHeading) &&
                                gpsHeading >= 0 &&
                                Number.isFinite(speed) &&
                                speed > 1
                            ) {
                                headingRef.current = gpsHeading;
                                setHeading(gpsHeading);
                                return;
                            }

                            updateNavigationCamera(
                                {
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                },
                                headingRef.current,
                                300
                            );
                        }
                    );

                if (!mounted) {
                    locationSubscription.remove();
                    return;
                }

                locationSubscriptionRef.current = locationSubscription;


                // Compass
                const headingSubscription =
                    await Location.watchHeadingAsync(
                        headingData => {

                            if (!mounted) {
                                return;
                            }

                            let newHeading = headingData.trueHeading;

                            if (
                                !Number.isFinite(newHeading) ||
                                newHeading < 0
                            ) {
                                newHeading = headingData.magHeading;
                            }

                            if (
                                !Number.isFinite(newHeading) ||
                                newHeading < 0
                            ) {
                                return;
                            }

                            // normalize
                            newHeading = (newHeading + 360) % 360;

                            headingRef.current = newHeading;
                            setHeading(newHeading);
                        }
                    );

                if (!mounted) {
                    headingSubscription.remove();
                    return;
                }

                headingSubscriptionRef.current = headingSubscription;

            } catch (error) {
                clearNavigation();
            }
        };

        startTracking();

        return () => {
            mounted = false;

            locationSubscriptionRef.current?.remove();
            headingSubscriptionRef.current?.remove();

            locationSubscriptionRef.current = null;
            headingSubscriptionRef.current = null;
        };
    }, [navigationStatus,]);

    useEffect(() => {
        if (!navigationTarget) {
            routeRequestedRef.current = null;
            return;
        }

        // Already calculated/requested this exact target
        if (routeRequestedRef.current === navigationTarget._id) {
            return;
        }

        routeRequestedRef.current = navigationTarget._id;

        navigateToToilet(navigationTarget);
    }, [navigationTarget, navigateToToilet]);

    //initial navigation camera
    useEffect(() => {

        if (navigationStatus !== "navigating") { return; }
        if (!navigationCoordinate) { return; }

        updateNavigationCamera(
            navigationCoordinate,
            headingRef.current,
            700
        );
    }, [
        navigationStatus,
        navigationCoordinate,
    ]);

    // compass camera update
    useEffect(() => {

        if (navigationStatus !== "navigating") { return; }
        if (!navigationCoordinate) { return; }

        updateNavigationCamera(
            navigationCoordinate,
            heading,
            200
        );
    }, [heading,]);

    const handleToiletPress = async (toilet) => {
        logger.debug("Toilet selected", {
            toiletId: toilet._id,
        });

        useWcDataStore.getState().clearToiletRouteInfo();

        const currentSelectedToilet =
            useWcDataStore.getState().selectedToilet;

        if (currentSelectedToilet?._id === toilet._id) {
            setSelectedToilet({
                ...toilet,
                reviews: currentSelectedToilet.reviews ?? [],
                userReview: currentSelectedToilet.userReview ?? null,
            });
        } else {
            setSelectedToilet(toilet);
        }

        calculateToiletDistance(toilet);
        onMarkerPress(toilet);
    };

    const handleCancelNavigation = () => {
        // Stop GPS
        locationSubscriptionRef.current?.remove();
        locationSubscriptionRef.current = null;

        // Stop compass
        headingSubscriptionRef.current?.remove();
        headingSubscriptionRef.current = null;

        navigationLocationRef.current = null;
        setNavigationLocation(null);

        // Reset navigation values
        navigationAltitudeRef.current = 700;
        navigationPitchRef.current = 55;
        headingRef.current = 0;
        setHeading(0);

        cameraAnimationRef.current = false;

        const normalRegion = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        };

        regionRef.current = normalRegion;
        setRegion(normalRegion);
        setLatitudeDelta(0.02);

        // Restore normal camera
        mapRef.current?.animateToRegion(
            normalRegion,
            500
        );

        clearNavigation();
    };

    const handleAddLocation = async () => {
        try {

            if (!mapCenter) { return; }

            const results = await Location.reverseGeocodeAsync({
                latitude: mapCenter.latitude,
                longitude: mapCenter.longitude,
            });

            const place = results[0];

            if (!place) {
                toast.show("Could not determine this location", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Please choose another location.",
                    },
                });
                return;
            }

            const address = [
                place.name,
                place.street,
                place.city,
                place.region,
                place.country,
            ].filter(Boolean).join(", ");

            setPickedLocation({
                latitude: mapCenter.latitude,
                longitude: mapCenter.longitude,
                address,
            });

            onAddWcPress();

        } catch (error) {
            toast.show("Could not determine this location", {
                type: "custom",
                data: {
                    type: "error",
                    text2: "Please check your location services and try again.",
                },
            });
        }
    };


    return (

        <View style={{ flex: 1, }}>
            <MapView
                userInterfaceStyle={theme.dark ? "dark" : "light"}
                mapType={mapType}
                ref={mapRef}
                style={{ flex: 1, }}
                showsUserLocation={false}
                showsCompass={showCompass}
                followsUserLocation={false}
                initialRegion={region}
                rotateEnabled={navigationStatus !== "navigating"}
                pitchEnabled={navigationStatus !== "navigating"}
                onRegionChangeComplete={
                    newRegion => {
                        if (navigationStatus === "navigating") { return; }
                        regionRef.current = newRegion;
                        setLatitudeDelta(newRegion.latitudeDelta);
                        setRegion(newRegion);
                        setMapCenter(newRegion);
                    }}>

                {(navigationCoordinate || currentLocation) && showMyLocation && (
                    <Marker
                        coordinate={navigationCoordinate || {
                            latitude: currentLocation.coords.latitude,
                            longitude: currentLocation.coords.longitude,
                        }}
                        anchor={{ x: 0.5, y: 0.5, }}
                        rotation={navigationStatus === "navigating" ? heading : 0}
                        flat={navigationStatus === "navigating"}
                    >
                        <Image
                            source={require("../../assets/locationMarker.png")}
                            style={{
                                width: 80,
                                height: 80,
                                resizeMode: "contain",
                            }}
                        />
                    </Marker>
                )}

                {navigationStatus === "navigating" &&
                    navigationRouteCoordinates.length > 0 && (
                        <Polyline
                            coordinates={navigationRouteCoordinates}
                            strokeWidth={5}
                            strokeColor={theme.colors.secondaryDarker}
                            fillColor={theme.colors.primary}
                            lineCap="round"
                            lineJoin="round"
                        />
                    )}

                {!isPickingLocation &&
                    navigationStatus !== "navigating" &&
                    toilets
                        .filter(toilet => toilet.location?.coordinates)
                        .map(toilet => (
                            <Marker
                                key={toilet._id}
                                coordinate={{
                                    latitude: toilet.location.coordinates[1],
                                    longitude: toilet.location.coordinates[0],
                                }}
                                anchor={{
                                    x: 0.5,
                                    y: 1,
                                }}
                            >
                                <Pressable
                                    onPress={() => handleToiletPress(toilet)}
                                    hitSlop={10}
                                >
                                    {({ pressed }) => (
                                        <Image
                                            source={require("../../assets/toiletLocation.png")}
                                            style={{
                                                width: markerSize,
                                                height: markerSize,
                                                resizeMode: "contain",
                                                transform: [
                                                    { scale: pressed ? 0.9 : 1 }
                                                ],
                                            }}
                                        />
                                    )}
                                </Pressable>
                            </Marker>
                        ))}

                {navigationStatus === "navigating" &&
                    navigationTarget?.location?.coordinates && (
                        <Marker
                            coordinate={{
                                latitude: navigationTarget.location.coordinates[1],
                                longitude: navigationTarget.location.coordinates[0],
                            }}
                            centerOffset={{ x: 3, y: -20, }}
                        >
                            <Image
                                source={require("../../assets/toiletLocation.png")}
                                style={{
                                    width: 50,
                                    height: 50,
                                    resizeMode: "contain",
                                }}
                            />
                        </Marker>
                    )}
            </MapView>

            {navigationStatus === "navigating" && (
                <View
                    pointerEvents="box-none"
                    style={{
                        position: "absolute",
                        left: 24,
                        right: 135,
                        bottom: 35,
                    }}>

                    {!isPickingLocation && (
                        <Pressable onPress={handleCancelNavigation}>
                            {({ pressed }) => (
                                <BlurView
                                    intensity={12}
                                    tint="extraLight"
                                    style={{
                                        borderRadius: 14,
                                        overflow: "hidden",
                                        transform: [{ scale: pressed ? 0.95 : 1 }]
                                    }}
                                >
                                    <View
                                        style={{
                                            height: 44,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: 14,
                                            borderWidth: 0.5,
                                            borderColor: theme.colors.error + '80',
                                            backgroundColor: theme.colors.error + "25",
                                        }}
                                    >
                                        <Text style={{
                                            color: theme.colors.error + '99'
                                        }}>
                                            {t("components.mapOfToilets.cancelNavBtn")}
                                        </Text>
                                    </View>
                                </BlurView>
                            )}
                        </Pressable>
                    )}
                </View>
            )}

            {isPickingLocation && (
                <>
                    <View
                        pointerEvents="box-none"
                        style={{
                            position: "absolute",
                            left: 24,
                            right: 24,
                            bottom: 30,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 10,
                                marginBottom: 20
                            }}
                        >
                            <ButtonComponent
                                onPress={() => {
                                    onAddWcPress();
                                    stopPickingLocation();
                                }}
                                backgroundColor={theme.colors.error + '18'}
                                borderColor={theme.colors.error + '50'}
                                style={{
                                    width: '30%',
                                }}
                            >
                                <Text style={{
                                    color: theme.colors.error
                                }}>
                                    {t("components.mapOfToilets.cancelBtn")}
                                </Text>
                            </ButtonComponent>

                            <ButtonComponent
                                onPress={handleAddLocation}
                                backgroundColor={theme.colors.success + '18'}
                                borderColor={theme.colors.success + '50'}
                                style={{
                                    width: '70%',
                                }}
                            >
                                <Text style={{
                                    color: theme.colors.success
                                }}>{
                                        t("components.mapOfToilets.addLocationBtn")}
                                </Text>
                            </ButtonComponent>
                        </View>
                    </View>

                    <View
                        pointerEvents="none"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginLeft: -markerSize / 2,
                            marginTop: -markerSize,
                        }}>
                        <Image
                            source={require("../../assets/toiletLocation1.png")}
                            style={{
                                width: markerSize,
                                height: markerSize,
                                resizeMode: "contain",
                                shadowColor: "#000",
                                shadowOffset: { width: 8, height: 8, },
                                shadowOpacity: 0.14,
                                shadowRadius: 5,
                                elevation: 3,
                            }}
                        />
                    </View>
                </>
            )}
        </View>
    );
});

export default MapOfToilets;