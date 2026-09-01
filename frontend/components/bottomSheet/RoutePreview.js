import React, { forwardRef, useMemo, useCallback, useEffect, useRef, useState, } from "react";
import { BottomSheetModal, BottomSheetBackdrop, } from "@gorhom/bottom-sheet";
import { View, Pressable, Text, StyleSheet, ActivityIndicator, } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "react-native-paper";
import MapView, { Polyline, Marker, } from "react-native-maps";
import { Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useWcDataStore } from "../../store/wcDataStore";
import GlassBackground from "../../components/blur/blurView";


const RoutePreview = forwardRef(
    ({ curentLocation, toiletInfoBottomSheetRef, onDismiss, onReopenToiletInfo }, ref) => {

        const { t } = useTranslation();
        const theme = useTheme();
        const mapRef = useRef(null);
        const [mapReady, setMapReady] = useState(false);
        const navigation = useWcDataStore(state => state.navigation);
        const { target, route, distance, duration, status, } = navigation;
        const snapPoints = useMemo(() => ["65%"], []);
        const shouldReopenToiletInfo = useRef(false);

        const origin = useMemo(() => {
            if (
                !curentLocation?.coords?.latitude ||
                !curentLocation?.coords?.longitude
            ) {
                return null;
            }
            return {
                latitude: curentLocation.coords.latitude,
                longitude: curentLocation.coords.longitude,
            };

        }, [curentLocation]);

        const routeCoordinates = useMemo(() => {

            if (!route?.coordinates?.length) {
                return [];
            }

            return route.coordinates.map(
                ([longitude, latitude]) => ({
                    latitude,
                    longitude,
                })
            );

        }, [route]);

        const destination = useMemo(() => {

            if (
                !target?.location?.coordinates ||
                target.location.coordinates.length < 2
            ) {
                return null;
            }

            return {
                latitude:
                    target.location.coordinates[1],

                longitude:
                    target.location.coordinates[0],
            };

        }, [target]);


        /*
         * FIT MAP TO ROUTE
         *
         * Only do this when:
         *
         * 1. Map is ready
         * 2. Route exists
         * 3. Origin exists
         * 4. Destination exists
         */
        useEffect(() => {

            if (!mapReady) {
                return;
            }

            if (!mapRef.current) {
                return;
            }

            if (!origin) {
                return;
            }

            if (!destination) {
                return;
            }

            if (routeCoordinates.length === 0) {
                return;
            }

            const coordinates = [
                origin,
                destination,
                ...routeCoordinates,
            ];


            const timer = setTimeout(() => {

                mapRef.current?.fitToCoordinates(
                    coordinates,
                    {
                        edgePadding: {
                            top: 60,
                            right: 50,
                            bottom: 60,
                            left: 50,
                        },

                        animated: true,
                    }
                );

            }, 300);


            return () => {
                clearTimeout(timer);
            };

        }, [
            mapReady,
            origin,
            destination,
            routeCoordinates,
        ]);

        const handleMapReady = useCallback(() => {

            setMapReady(true);

        }, []);

        const handleCancel = () => {
            console.log("ROUTE PREVIEW >>> CANCEL");

            useWcDataStore.getState().clearNavigation();

            // Tell Home that the next ToiletInfo presentation
            // must open at snap point 1.
            onReopenToiletInfo?.();

            ref.current?.dismiss();

            setTimeout(() => {
                toiletInfoBottomSheetRef.current?.present();
            }, 350);
        };

        const handleStartNavigation = () => {
            console.log("ROUTE PREVIEW >>> START NAVIGATION");

            useWcDataStore.getState().startNavigation();

            ref.current?.dismiss();
        };


        const renderBackdrop = useCallback(
            (props) => (

                <BottomSheetBackdrop
                    {...props}
                    opacity={0.3}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    pressBehavior="close"
                />), []);

        const formatDistance = () => {

            if (distance == null) {
                return "--";
            }

            if (distance < 1000) {
                return `${Math.round(distance)} m`;
            }

            return `${(distance / 1000).toFixed(1)} km`;

        };

        const formatDuration = () => {

            if (duration == null) {
                return "--";
            }

            const minutes = Math.round(duration / 60);

            if (minutes < 60) {
                return `${minutes} min`;
            }

            const hours = Math.floor(minutes / 60);

            const remainingMinutes =
                minutes % 60;

            return `${hours}h ${remainingMinutes}min`;

        };

        const isRouting = status === "routing";


        return (

            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                backdropComponent={renderBackdrop}
                onPresent={() => {
                    console.log("ROUTE PREVIEW >>> PRESENTED");
                }}
                onDismiss={() => {
                    console.log("ROUTE PREVIEW >>> DISMISSED");
                    onDismiss?.();
                }}

                backgroundComponent={(props) => (
                    <GlassBackground {...props} theme={theme} />
                )}

                handleStyle={{
                    backgroundColor: "transparent",
                }}

                handleIndicatorStyle={{
                    backgroundColor:
                        "rgba(255,255,255,0.6)",

                    width: 50,
                    height: 5,
                }}
            >

                <View style={{ flex: 1, }}>

                    <View
                        style={{
                            height: 300,
                            marginHorizontal: 20,
                            borderRadius: 25,
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >

                        <MapView
                            ref={mapRef}
                            style={StyleSheet.absoluteFill}
                            onMapReady={handleMapReady}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            rotateEnabled={false}
                            pitchEnabled={false}
                            showsUserLocation={false}

                            /*
                             * Prevent the map from initially
                             * showing the whole world.
                             */
                            initialRegion={
                                origin
                                    ? {
                                        latitude:
                                            origin.latitude,

                                        longitude:
                                            origin.longitude,

                                        latitudeDelta:
                                            0.01,

                                        longitudeDelta:
                                            0.01,
                                    }
                                    : undefined
                            }
                        >



                            {/* CURRENT LOCATION */}

                            {origin && (
                                <Marker
                                    coordinate={origin}
                                    anchor={{
                                        x: 0.5,
                                        y: 0.5,
                                    }}
                                >

                                    <Image
                                        source={require(
                                            "../../assets/locationMarker.png"
                                        )}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            resizeMode:
                                                "contain",
                                        }}
                                    />

                                </Marker>
                            )}


                            {/* ROUTE */}

                            {routeCoordinates.length > 0 && (

                                <Polyline
                                    coordinates={
                                        routeCoordinates
                                    }

                                    strokeWidth={3}

                                    strokeColor={
                                        theme.colors
                                            .secondary
                                    }

                                    lineCap="round"
                                    lineJoin="round"
                                />

                            )}


                            {/* DESTINATION */}

                            {destination && (

                                <Marker
                                    coordinate={
                                        destination
                                    }

                                    centerOffset={{
                                        x: 3,
                                        y: -20,
                                    }}
                                >

                                    <Image
                                        source={require(
                                            "../../assets/toiletLocation.png"
                                        )}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            resizeMode:
                                                "contain",
                                        }}
                                    />

                                </Marker>

                            )}

                        </MapView>


                        {/* =========================
                        ROUTING OVERLAY
                    ========================= */}

                        {isRouting && (

                            <View
                                style={{
                                    ...StyleSheet.absoluteFillObject,

                                    justifyContent:
                                        "center",

                                    alignItems:
                                        "center",

                                    backgroundColor:
                                        "rgba(0,0,0,0.25)",
                                }}
                            >

                                <BlurView
                                    intensity={30}
                                    tint="dark"
                                    style={{
                                        paddingHorizontal: 25,
                                        paddingVertical: 18,

                                        borderRadius: 20,

                                        overflow: "hidden",

                                        alignItems:
                                            "center",
                                    }}
                                >

                                    <ActivityIndicator
                                        size="large"
                                        color={
                                            theme.colors
                                                .secondary
                                        }
                                    />

                                    <Text
                                        style={{
                                            marginTop: 10,
                                            color: "white",
                                        }}
                                    >
                                        Calculating route...
                                    </Text>

                                </BlurView>

                            </View>

                        )}

                    </View>


                    {/* =========================
                    ROUTE INFORMATION
                ========================= */}

                    <View
                        style={{
                            paddingHorizontal: 24,
                            paddingTop: 20,
                        }}
                    >

                        <Text
                            variant="headlineSmall"
                            style={{
                                color:
                                    theme.colors.surface,
                            }}
                        >
                            {target?.name}
                        </Text>


                        <View
                            style={{
                                flexDirection: "row",
                                marginTop: 15,
                                gap: 30,
                            }}
                        >

                            <View>

                                <Text
                                    style={{
                                        color:
                                            theme.colors
                                                .secondary,
                                    }}
                                >
                                    Distance
                                </Text>

                                <Text
                                    variant="titleLarge"
                                    style={{
                                        color:
                                            theme.colors
                                                .surface,
                                    }}
                                >
                                    {formatDistance()}
                                </Text>

                            </View>


                            <View>

                                <Text
                                    style={{
                                        color:
                                            theme.colors
                                                .secondary,
                                    }}
                                >
                                    Estimated time
                                </Text>

                                <Text
                                    variant="titleLarge"
                                    style={{
                                        color:
                                            theme.colors
                                                .surface,
                                    }}
                                >
                                    {formatDuration()}
                                </Text>

                            </View>

                        </View>

                    </View>


                    {/* =========================
                    BUTTONS
                ========================= */}

                    <View
                        pointerEvents="box-none"
                        style={{
                            position: "absolute",
                            left: 24,
                            right: 24,
                            bottom: 25,
                        }}
                    >

                        <View
                            style={{
                                flexDirection: "row",
                                gap: 10,
                            }}
                        >

                            {/* START */}

                            <Pressable
                                style={{
                                    flex: 1,
                                }}

                                disabled={
                                    isRouting ||
                                    !route
                                }

                                onPress={
                                    handleStartNavigation
                                }
                            >

                                {({ pressed }) => (

                                    <BlurView
                                        intensity={15}
                                        tint="extraLight"

                                        style={{
                                            borderRadius: 34,
                                            overflow: "hidden",

                                            transform: [
                                                {
                                                    scale:
                                                        pressed
                                                            ? 0.95
                                                            : 1,
                                                },
                                            ],
                                        }}
                                    >

                                        <View
                                            style={{
                                                justifyContent:
                                                    "center",

                                                alignItems:
                                                    "center",

                                                paddingVertical:
                                                    25,

                                                borderRadius:
                                                    38,

                                                backgroundColor:
                                                    theme.colors
                                                        .success +
                                                    "55",

                                                opacity:
                                                    isRouting
                                                        ? 0.4
                                                        : 1,
                                            }}
                                        >

                                            <Text>
                                                Navigate
                                            </Text>

                                        </View>

                                    </BlurView>

                                )}

                            </Pressable>


                            {/* CANCEL */}

                            <Pressable
                                style={{
                                    flex: 1,
                                }}

                                onPress={
                                    handleCancel
                                }
                            >

                                {({ pressed }) => (

                                    <BlurView
                                        intensity={15}
                                        tint="extraLight"

                                        style={{
                                            borderRadius: 34,
                                            overflow: "hidden",

                                            transform: [
                                                {
                                                    scale:
                                                        pressed
                                                            ? 0.95
                                                            : 1,
                                                },
                                            ],
                                        }}
                                    >

                                        <View
                                            style={{
                                                justifyContent:
                                                    "center",

                                                alignItems:
                                                    "center",

                                                paddingVertical:
                                                    25,

                                                borderRadius:
                                                    38,

                                                backgroundColor:
                                                    theme.colors
                                                        .error +
                                                    "55",
                                            }}
                                        >

                                            <Text>
                                                Cancel
                                            </Text>

                                        </View>

                                    </BlurView>

                                )}

                            </Pressable>

                        </View>

                    </View>

                </View>

            </BottomSheetModal >
        );
    });


export default RoutePreview;