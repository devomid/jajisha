import * as Location from "expo-location";
import { useState, useEffect } from "react";
import { useWcDataStore } from "../../store/wcDataStore";
import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigateToToilet } from "../../src/hooks/useNavigateWc";

import { View, Pressable, Text } from "react-native";
import { Image } from "react-native";
import { BlurView } from "expo-blur";
import MapView, { Marker } from "react-native-maps";

export default function MapOfToilets({ currentLocation, onMarkerPress, isPickingLocation, onAddWcPress }) {

    const { t } = useTranslation();
    const theme = useTheme();
    const toilets = useWcDataStore(state => state.toilets);
    const setSelectedToilet = useWcDataStore(state => state.setSelectedToilet);
    const mapCenter = useWcDataStore(state => state.mapCenter);
    const setMapCenter = useWcDataStore(state => state.setMapCenter);
    const stopPickingLocation = useWcDataStore(state => state.stopPickingLocation);
    const setPickedLocation = useWcDataStore(state => state.setPickedLocation);
    const navigationTarget = useWcDataStore(state => state.navigation.target);
    const navigationRoute = useWcDataStore(state => state.navigation.route);
    const navigationActive = useWcDataStore(state => state.navigation.active);
    const { navigateToToilet } = useNavigateToToilet();
    const [latitudeDelta, setLatitudeDelta] = useState(0.02);
    const [region, setRegion] = useState({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

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

    const routeCoordinates =
        navigationRoute?.coordinates?.map(
            ([longitude, latitude]) => ({
                latitude,
                longitude,
            })
        ) || [];

    if (!location) return null;
    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                showsUserLocation={false}
                followsUserLocation={!isPickingLocation}
                initialRegion={region}
                onRegionChangeComplete={(newRegion) => {
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
}



