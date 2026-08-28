import * as Location from "expo-location";
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { useWcDataStore } from "../../store/wcDataStore";
import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigateToToilet } from "../../src/hooks/useNavigateWc";

import { View, Pressable, Text } from "react-native";
import { Image } from "react-native";
import { BlurView } from "expo-blur";
import MapView, { Marker } from "react-native-maps";

const MapOfToilets = forwardRef(({ currentLocation, onMarkerPress, isPickingLocation, onAddWcPress }, ref) => {
    
    const mapRef = useRef(null);
    const { t } = useTranslation();
    const theme = useTheme();
    const toilets = useWcDataStore(state => state.toilets);
    const setSelectedToilet = useWcDataStore(state => state.setSelectedToilet);
    const mapCenter = useWcDataStore(state => state.mapCenter);
    const setMapCenter = useWcDataStore(state => state.setMapCenter);
    const stopPickingLocation = useWcDataStore(state => state.stopPickingLocation);
    const setPickedLocation = useWcDataStore(state => state.setPickedLocation);
    const navigationTarget = useWcDataStore(state => state.navigation.target);
    const { navigateToToilet } = useNavigateToToilet();
    const [latitudeDelta, setLatitudeDelta] = useState(0.02);
    const regionRef = useRef({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });
    const [region, setRegion] = useState({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

    useImperativeHandle(ref, () => ({
        zoomIn: () => {
            const current = regionRef.current;

            const newRegion = {
                ...current,
                latitudeDelta: current.latitudeDelta * 0.5,
                longitudeDelta: current.longitudeDelta * 0.5,
            };

            regionRef.current = newRegion;
            setRegion(newRegion);

            mapRef.current?.animateToRegion(newRegion, 300);
        },

        zoomOut: () => {
            const current = regionRef.current;

            const newRegion = {
                ...current,
                latitudeDelta: current.latitudeDelta * 2,
                longitudeDelta: current.longitudeDelta * 2,
            };

            regionRef.current = newRegion;
            setRegion(newRegion);

            mapRef.current?.animateToRegion(newRegion, 300);
        },

        recenter: () => {
            const current = regionRef.current;

            const newRegion = {
                ...current,
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            };

            regionRef.current = newRegion;
            setRegion(newRegion);

            mapRef.current?.animateToRegion(newRegion, 500);
        },
    }));

    const markerSize = Math.max(
        40,
        Math.min(
            85,
            60 * Math.pow(0.02 / latitudeDelta, 0.25)
        )
    );

    const handleAddLocation = async () => {
        if (!mapCenter) return;
        const results = await Location.reverseGeocodeAsync({
            latitude: mapCenter.latitude,
            longitude: mapCenter.longitude,
        });

        const place = results[0];

        const address = [place.name, place.street, place.city, place.region, place.country,].filter(Boolean).join(", ");
        setPickedLocation({
            latitude: mapCenter.latitude,
            longitude: mapCenter.longitude,
            address,
        });
        onAddWcPress();
    };

    useEffect(() => {
        if (!navigationTarget) return;

        navigateToToilet(navigationTarget);
    }, [navigationTarget]);

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                showsUserLocation={false}
                followsUserLocation={!isPickingLocation}
                initialRegion={region}
                onRegionChangeComplete={(newRegion) => {
                    regionRef.current = newRegion;

                    setLatitudeDelta(newRegion.latitudeDelta);
                    setRegion(newRegion);
                    setMapCenter(newRegion);
                }}
            >
                {location && (
                    <Marker
                        coordinate={{
                            latitude: currentLocation.coords.latitude,
                            longitude: currentLocation.coords.longitude,
                        }}
                        anchor={{ x: 0.5, y: 0.5 }}
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

                {!isPickingLocation &&
                    toilets
                        .filter(toilet => toilet.location?.coordinates)
                        .map((toilet) => (
                            <Marker
                                key={toilet._id}
                                coordinate={{
                                    latitude: toilet.location.coordinates[1],
                                    longitude: toilet.location.coordinates[0],
                                }}
                                onPress={() => {
                                    setSelectedToilet(toilet);
                                    // console.log(toilet);
                                    onMarkerPress(toilet);
                                }}
                                centerOffset={{ x: 3, y: -markerSize / 2 }}
                            >
                                <Image
                                    source={require("../../assets/toiletLocation.png")}
                                    style={{
                                        width: markerSize,
                                        height: markerSize,
                                        resizeMode: "contain",
                                    }}
                                />
                            </Marker>
                        ))
                }

            </MapView>

            {isPickingLocation && (
                <>
                    <View
                        pointerEvents="box-none"
                        style={{
                            position: 'absolute',
                            left: 24,
                            right: 24,
                            bottom: 30,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 10
                            }}
                        >
                            <Pressable
                                style={{ flex: 1 }}
                                onPress={handleAddLocation}
                            >
                                {({ pressed }) => (
                                    <BlurView
                                        intensity={15}
                                        tint="extraLight"
                                        style={{
                                            borderRadius: 34,
                                            overflow: 'hidden',
                                            transform: [{ scale: pressed ? 0.95 : 1 }],
                                        }}
                                    >
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                borderRadius: 38,
                                                borderWidth: 0.5,
                                                borderColor: theme.colors.success,
                                                alignItems: 'center',
                                                paddingVertical: 30,
                                                backgroundColor:
                                                    pressed
                                                        ? theme.colors.success + '70'
                                                        : theme.colors.success + '45',
                                            }}
                                        >
                                            <Text>{t("AddWcBottomSheet.add")}</Text>
                                        </View>
                                    </BlurView>
                                )}
                            </Pressable>

                            <Pressable
                                style={{ flex: 1 }}
                                onPress={() => {
                                    onAddWcPress();
                                    stopPickingLocation()
                                }}
                            >
                                {({ pressed }) => (
                                    <BlurView
                                        intensity={15}
                                        tint="extraLight"
                                        style={{
                                            borderRadius: 34,
                                            overflow: 'hidden',
                                            transform: [{ scale: pressed ? 0.95 : 1 }],
                                        }}
                                    >
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                borderRadius: 38,
                                                borderWidth: 0.5,
                                                borderColor: theme.colors.error,
                                                alignItems: 'center',
                                                paddingVertical: 30,
                                                backgroundColor:
                                                    pressed
                                                        ? theme.colors.error + '70'
                                                        : theme.colors.error + '45',
                                            }}
                                        >
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
                        }}
                    >
                        <Image
                            source={require("../../assets/toiletLocation1.png")}
                            style={{
                                width: markerSize,
                                height: markerSize,
                                resizeMode: "contain",

                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 8,
                                    height: 8,
                                },
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
})
export default MapOfToilets;

