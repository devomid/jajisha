import { useState, useEffect, forwardRef, useImperativeHandle, useRef, } from "react";
import { useWcDataStore } from "../../store/wcDataStore";
import { useTheme } from "react-native-paper";
import { useNavigateToToilet } from "../../src/hooks/useNavigateWc";
import { useTranslation } from "react-i18next";

import * as Location from "expo-location";
import { View, Pressable, Text, Image, Platform, } from "react-native";
import { BlurView } from "expo-blur";
import MapView, { Marker, Polyline, } from "react-native-maps";


const MapOfToilets = forwardRef(({ currentLocation, onMarkerPress, isPickingLocation, onAddWcPress, }, ref) => {

    const mapRef = useRef(null);
    const { t } = useTranslation();
    const theme = useTheme();
    const { navigateToToilet } = useNavigateToToilet();

    const toilets = useWcDataStore(state => state.toilets);
    const setSelectedToilet = useWcDataStore(state => state.setSelectedToilet);
    const mapCenter = useWcDataStore(state => state.mapCenter);
    const setMapCenter = useWcDataStore(state => state.setMapCenter);
    const stopPickingLocation = useWcDataStore(state => state.stopPickingLocation);
    const setPickedLocation = useWcDataStore(state => state.setPickedLocation);
    const clearNavigation = useWcDataStore(state => state.clearNavigation);
    const navigation = useWcDataStore(state => state.navigation);
    const {
        target: navigationTarget,
        route: navigationRoute,
        status: navigationStatus,
    } = navigation;

    const handleToiletPress = (toilet) => {
        setSelectedToilet(toilet);
        onMarkerPress(toilet);
    };
    // nprmal map
    const [latitudeDelta, setLatitudeDelta] = useState(0.02);
    const initialRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    };

    const regionRef = useRef(initialRegion);
    const [region, setRegion] = useState(initialRegion);

    // navigation location
    const navigationLocationRef = useRef(null);
    const [navigationLocation, setNavigationLocation] = useState(null);


    // navigation heading
    const headingRef = useRef(0);
    const [heading, setHeading] = useState(0);


    // navigation camer
    const navigationAltitudeRef = useRef(700);
    const navigationPitchRef = useRef(55);

    // camera animation lock
    const cameraAnimationRef = useRef(false);


    //subscription
    const locationSubscriptionRef = useRef(null);
    const headingSubscriptionRef = useRef(null);

    // route
    const navigationRouteCoordinates = navigationRoute?.coordinates?.map(
        ([longitude, latitude]) => ({
            latitude,
            longitude,
        })
    ) || [];


    //current navigation coordinates
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

                setLatitudeDelta(newRegion.latitudeDelta);
                setRegion(newRegion);

                mapRef.current.animateToRegion(
                    newRegion,
                    300
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


    // marker size
    const markerSize = Math.max(40, Math.min(85, 60 * Math.pow(0.02 / latitudeDelta, 0.25)));


    // add location
    const handleAddLocation = async () => {

        if (!mapCenter) { return; }

        const results = await Location.reverseGeocodeAsync({
            latitude: mapCenter.latitude,
            longitude: mapCenter.longitude,
        }
        );

        const place = results[0];
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
    };


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
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== "granted") {
                    console.log("Location permission denied");
                    return;
                }


                // GPS
                locationSubscriptionRef.current = await Location.watchPositionAsync({
                    accuracy: Location.Accuracy.BestForNavigation,
                    distanceInterval: 2,
                    timeInterval: 500,
                },
                    location => {

                        if (!mounted) { return; }

                        navigationLocationRef.current = location;
                        setNavigationLocation(location);

                        const gpsHeading = location.coords.heading;
                        const speed = location.coords.speed;
                        if (
                            gpsHeading != null &&
                            gpsHeading >= 0 &&
                            speed != null &&
                            speed > 1
                        ) {
                            headingRef.current = gpsHeading;
                            setHeading(gpsHeading);
                            return;
                        }

                        updateNavigationCamera({
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        },
                            headingRef.current,
                            300
                        );
                    }
                );

                headingSubscriptionRef.current = await Location.watchHeadingAsync(headingData => {

                    if (!mounted) { return; }
                    let newHeading = headingData.trueHeading;
                    if (newHeading < 0) { newHeading = headingData.magHeading; }
                    if (newHeading == null || newHeading < 0) { return; }

                    // normalize
                    newHeading = (newHeading + 360) % 360;
                    headingRef.current = newHeading;
                    setHeading(newHeading);
                });

            } catch (error) {
                console.error("NAVIGATION TRACKING ERROR:", error);
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

    // route calculation
    const routeRequestedRef = useRef(null);

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
        updateNavigationCamera(navigationCoordinate, headingRef.current, 700);
    }, [navigationStatus,
        navigationCoordinate,]);


    // compass camera update
    useEffect(() => {

        if (navigationStatus !== "navigating") { return; }
        if (!navigationCoordinate) { return; }
        updateNavigationCamera(navigationCoordinate, heading, 200);
    }, [heading,]);


    // cancel navigation
    // const handleCancelNavigation = () => {

    //     locationSubscriptionRef.current?.remove();
    //     headingSubscriptionRef.current?.remove();
    //     locationSubscriptionRef.current = null;
    //     headingSubscriptionRef.current = null;
    //     navigationLocationRef.current = null;

    //     clearNavigation();

    //     // restore normal camer
    //     if (mapRef.current && currentLocation) {
    //         const normalRegion = {
    //             latitude: currentLocation.coords.latitude,
    //             longitude: currentLocation.coords.longitude,
    //             latitudeDelta: 0.02,
    //             longitudeDelta: 0.02,
    //         };

    //         regionRef.current = normalRegion;
    //         setRegion(normalRegion);
    //         setLatitudeDelta(0.02);
    //         mapRef.current.animateCamera({
    //             center: {
    //                 latitude: currentLocation.coords.latitude,
    //                 longitude: currentLocation.coords.longitude,
    //             },
    //             heading: 0,
    //             pitch: 0,
    //             altitude: 1000,
    //         },
    //             {
    //                 duration: 500,
    //             }
    //         );
    //     }
    // };
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
        // Restore normal camera
        mapRef.current?.animateToRegion(
            normalRegion,
            500
        );

        clearNavigation();
    };


    // map
    return (

        <View style={{ flex: 1, }}>
            <MapView
                ref={mapRef}
                style={{ flex: 1, }}
                showsUserLocation={false}
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

                {(navigationCoordinate || currentLocation) && (

                    <Marker
                        coordinate={navigationCoordinate || {
                            latitude: currentLocation.coords.latitude,
                            longitude: currentLocation.coords.longitude,
                        }}
                        anchor={{ x: 0.5, y: 0.5, }}
                        rotation={navigationStatus === "navigating" ? heading : 0}
                        flat={navigationStatus === "navigating"}
                    >

                        <Image source={require("../../assets/locationMarker.png")}
                            style={{
                                width: 80,
                                height: 80,
                                resizeMode: "contain",
                            }} />

                    </Marker>
                )}


                {navigationStatus === "navigating" && navigationRouteCoordinates.length > 0 && (

                    <Polyline
                        coordinates={navigationRouteCoordinates}
                        strokeWidth={7}
                        strokeColor={theme.colors.secondaryDarker}
                        fillColor={theme.colors.primary}
                        lineCap="round"
                        lineJoin="round"
                    />)}


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
                                onPress={() => {
                                    console.log("========== MARKER PRESSED ==========");
                                    console.log(toilet._id);
                                    handleToiletPress(toilet);
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

                {navigationStatus === "navigating" && navigationTarget?.location?.coordinates && (

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
                            }} />
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

                    <Pressable onPress={handleCancelNavigation}>

                        {({ pressed }) => (

                            <BlurView
                                intensity={20}
                                tint="extraLight"
                                style={{
                                    borderRadius: 34,
                                    overflow: "hidden",
                                    transform: [{ scale: pressed ? 0.95 : 1 }]
                                }}
                            >

                                <View
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        paddingVertical: 22,
                                        borderRadius: 38,
                                        borderWidth: 0.5,
                                        borderColor: theme.colors.error,
                                        backgroundColor: theme.colors.error + "55",
                                    }}
                                >
                                    <Text>
                                        Cancel Navigation
                                    </Text>
                                </View>
                            </BlurView>
                        )}
                    </Pressable>
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

                        <View style={{ flexDirection: "row", gap: 10, }}>
                            <Pressable
                                style={{ flex: 1, }}
                                onPress={handleAddLocation}
                            >
                                {({ pressed }) => (
                                    <BlurView
                                        intensity={15}
                                        tint="extraLight"
                                        style={{
                                            borderRadius: 34,
                                            overflow: "hidden",
                                            transform: [{ scale: pressed ? 0.95 : 1 }]
                                        }}>
                                        <View
                                            style={{
                                                justifyContent: "center",
                                                borderRadius: 38,
                                                borderWidth: 0.5,
                                                borderColor: theme.colors.success,
                                                alignItems: "center",
                                                paddingVertical: 30,
                                                backgroundColor: pressed ? theme.colors.success + "70" : theme.colors.success + "45"
                                            }}>
                                            <Text>{t("AddWcBottomSheet.add")}</Text>
                                        </View>
                                    </BlurView>
                                )}
                            </Pressable>


                            <Pressable
                                style={{ flex: 1, }}
                                onPress={() => {
                                    onAddWcPress();
                                    stopPickingLocation();
                                }}>
                                {({ pressed }) => (

                                    <BlurView
                                        intensity={15}
                                        tint="extraLight"
                                        style={{
                                            borderRadius: 34,
                                            overflow: "hidden",
                                            transform: [{ scale: pressed ? 0.95 : 1, }]
                                        }}>

                                        <View
                                            style={{
                                                justifyContent: "center",
                                                borderRadius: 38,
                                                borderWidth: 0.5,
                                                borderColor: theme.colors.error,
                                                alignItems: "center",
                                                paddingVertical: 30,
                                                backgroundColor: pressed ? theme.colors.error + "70" : theme.colors.error + "45",
                                            }}>
                                            <Text>{t("AddWcBottomSheet.cancel")}</Text>
                                        </View>
                                    </BlurView>
                                )}
                            </Pressable>
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
                            }} />

                    </View>

                </>
            )}

        </View>
    );
}
);

export default MapOfToilets;