import React, { forwardRef, useMemo, useCallback, useEffect, useRef, useState, } from "react";
import { BottomSheetModal, BottomSheetBackdrop, } from "@gorhom/bottom-sheet";
import { View, Pressable, StyleSheet, ActivityIndicator, } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme, Text } from "react-native-paper";
import MapView, { Polyline, Marker, } from "react-native-maps";
import { Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useWcDataStore } from "../../store/wcDataStore";
import GlassBackground from "../../components/blur/blurView";
import { Navigation, Road, Timer, MapPin, Toilet } from 'lucide-react-native';
import { useSettingsStore } from "../../store/settingsStore";
import { formatDistance } from "../../src/utils/distance";
import ButtonComponent from "../Button/Button";


const RoutePreview = forwardRef(
    ({ curentLocation, toiletInfoBottomSheetRef, onDismiss, onReopenToiletInfo }, ref) => {

        const { t } = useTranslation();
        const theme = useTheme();
        const mapRef = useRef(null);
        const [mapReady, setMapReady] = useState(false);
        const navigation = useWcDataStore(state => state.navigation);
        const toilet = useWcDataStore((state) => state.selectedToilet);
        const { target, route, distance, duration, status, } = navigation;
        const snapPoints = useMemo(() => ["75%"], []);
        const shouldReopenToiletInfo = useRef(false);

        const origin = useMemo(() => {
            const latitude = curentLocation?.coords?.latitude;
            const longitude = curentLocation?.coords?.longitude;

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
            ) {
                return null;
            }

            return {
                latitude,
                longitude,
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
            const coordinates = target?.location?.coordinates;

            if (
                !Array.isArray(coordinates) ||
                coordinates.length < 2 ||
                !Number.isFinite(coordinates[0]) ||
                !Number.isFinite(coordinates[1])
            ) {
                return null;
            }

            return {
                latitude: coordinates[1],
                longitude: coordinates[0],
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

            useWcDataStore.getState().clearNavigation();
            onReopenToiletInfo?.();
            ref.current?.dismiss();
        };

        const handleStartNavigation = () => {
            console.log("ROUTE PREVIEW >>> START NAVIGATION");

            useWcDataStore.getState().startNavigation();

            ref.current?.dismiss();
        };


        const renderBackdrop = useCallback(
            (props) => {
                return (
                    <BottomSheetBackdrop
                        {...props}
                        opacity={0.3}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        pressBehavior="close"
                        style={{ backgroundColor: theme.colors.primaryLighter + '60' }}

                    />)
            }, []);

        const distanceUnit = useSettingsStore(
            state => state.distanceUnit
        );

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
                onDismiss={() => {
                    if (useWcDataStore.getState().navigation.status === "preview") {
                        useWcDataStore.getState().clearNavigation();
                    }

                    onDismiss?.();
                }}

                backgroundComponent={(props) => (
                    <GlassBackground {...props} theme={theme} />
                )}
                containerStyle={{
                    borderRadius: 48,
                    marginBottom: 12,
                    marginHorizontal: 12,
                    overflow: "hidden",
                }}

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
                    <View style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'centert',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: 15,
                        marginBottom: 14
                    }}>

                        <Navigation
                            color={theme.colors.secondaryDarker + '99'}
                            size={18}
                            style={{
                                marginTop: 5
                            }} />
                        <Text
                            variant="titleMedium"
                            style={{
                                color: theme.colors.secondaryDarker + '90',
                            }}>
                            Route preview
                        </Text>
                    </View>

                    <View
                        style={{
                            height: 300,
                            marginHorizontal: 20,
                            borderRadius: 24,
                            overflow: "hidden",
                            position: "relative",
                            borderWidth: 0.5,
                            borderColor: theme.colors.secondary + '80',
                            marginBottom: 10
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
                            initialRegion={
                                origin ? {
                                    latitude: origin.latitude,
                                    longitude: origin.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01
                                } : undefined}
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

                                    strokeWidth={1.5}
                                    lineDashPattern={[1, 3]}
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
                    </View>


                    {/* =========================
                    ROUTE INFORMATION
                ========================= */}

                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        gap: 5,
                        justifyContent: 'center',
                    }}>
                        <View
                            style={{
                                paddingHorizontal: 14,
                                borderWidth: 0.5,
                                borderColor: theme.colors.secondary + '70',
                                backgroundColor: theme.colors.secondary + '15',
                                width: '35%',
                                height: 44,
                                borderRadius: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: 10,
                            }}
                        >
                            <Toilet
                                size={17}
                                strokeWidth={1.8}
                                color={theme.colors.secondary + "90"}
                            />

                            <Text
                                variant="labelLarge"
                                style={{
                                    color: theme.colors.secondary,
                                }}
                            >
                                {toilet?.name}
                            </Text>
                        </View>
                        <View
                            style={{
                                paddingHorizontal: 14,
                                borderWidth: 0.5,
                                borderColor: theme.colors.secondary + '70',
                                backgroundColor: theme.colors.secondary + '15',
                                width: '54%',
                                height: 44,
                                alignSelf: 'center',
                                borderRadius: 16,
                                marginBottom: 10,

                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: 10,
                            }}
                        >
                            <MapPin
                                size={17}
                                strokeWidth={1.8}
                                color={theme.colors.secondary + "90"}
                            />

                            <Text
                                variant="bodySmall"
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={{
                                    color: theme.colors.secondary,
                                    flex: 1,
                                    flexShrink: 1,
                                }}
                            >
                                {toilet?.address}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            paddingHorizontal: 14,
                            borderWidth: 0.5,
                            borderColor: theme.colors.secondary + '70',
                            backgroundColor: theme.colors.secondary + '15',
                            width: '90%',
                            height: 44,
                            alignSelf: 'center',
                            borderRadius: 16,
                            marginBottom: 10,

                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: 10,
                        }}
                    >
                        <Road
                            size={17}
                            strokeWidth={1.8}
                            color={theme.colors.secondary + "90"}
                        />

                        <Text
                            variant="labelLarge"
                            style={{
                                color: theme.colors.secondary,
                            }}
                        >
                            Distance to WC:
                        </Text>
                        <Text
                            variant="bodyLarge"
                            style={{
                                color: theme.colors.text,
                            }}
                        >
                            {formatDistance(distance, distanceUnit)}
                        </Text>
                    </View>

                    <View
                        style={{
                            paddingHorizontal: 14,
                            borderWidth: 0.5,
                            borderColor: theme.colors.secondary + '70',
                            backgroundColor: theme.colors.secondary + '15',
                            width: '90%',
                            height: 44,
                            alignSelf: 'center',
                            borderRadius: 16,
                            marginBottom: 10,

                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: 10,
                        }}
                    >
                        <Timer
                            size={17}
                            strokeWidth={1.8}
                            color={theme.colors.secondary + "90"}
                        />

                        <Text
                            variant="labelLarge"
                            style={{
                                color: theme.colors.secondary,
                            }}
                        >
                            ETA to WC:
                        </Text>
                        <Text
                            variant="bodyLarge"
                            style={{
                                color: theme.colors.text,
                            }}
                        >
                            {formatDuration()}
                        </Text>
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
                                flexDirection: 'row',
                                gap: 10,
                                marginBottom: 20
                            }}
                        >
                            <ButtonComponent
                                onPress={handleCancel}
                                backgroundColor={theme.colors.error + '18'}
                                borderColor={theme.colors.error + '50'}
                                style={{
                                    width: '30%',
                                }}
                            >
                                <Text style={{ color: theme.colors.error }}>{t("AddWcBottomSheet.cancel")}</Text>
                            </ButtonComponent>

                            <ButtonComponent
                                onPress={handleStartNavigation}
                                backgroundColor={theme.colors.success + '18'}
                                borderColor={theme.colors.secondaryLight + '50'}
                                style={{
                                    width: '70%',
                                }}
                            >
                                <Text style={{
                                    color: theme.colors.secondaryLight
                                }}>
                                    Start Navigation
                                </Text>
                            </ButtonComponent>

                        </View>

                    </View>

                </View>

            </BottomSheetModal >
        );
    });


export default RoutePreview;


