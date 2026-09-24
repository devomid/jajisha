import 'react-native-reanimated';
import 'expo-router/entry';
import { useEffect, useRef } from "react";

import { Menu, LocateFixed, ZoomOut, ZoomIn } from 'lucide-react-native';
import { useTheme } from "react-native-paper";
import { View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

import { useTopSheetStore } from '../src/store/menuStore';
import { useManagingWc } from '../src/hooks/useManagingWc';
import useCurrentLocation from '../src/hooks/useCurrentLocation';
import { useWcDataStore } from '../src/store/wcDataStore';
import logger from "../src/utils/logger";

import MapOfToilets from '../components/map/mapOfToilets';
import ToiletInfo from "../components/bottomSheet/ToiletLocationBottomSheet";
import AddWc from "../components/bottomSheet/AddWcBottomSheet";
import RoutePreview from '../components/bottomSheet/RoutePreview';
// import SearchButton from '../components/searchBar/animatedSearchBtn';
// later updates should put search back
import MenuTopSheet from '../components/topSheet/MenuTopSheet';


export default function Home() {

    const { getWc } = useManagingWc();
    const mapRef = useRef(null);
    const curentLocation = useCurrentLocation();
    const theme = useTheme();
    const toiletInfoBottomSheetRef = useRef(null);
    const reopenToiletInfoAtSecondSnapRef = useRef(false);
    const addWcBottomSheetRef = useRef(null);
    const routePreviewBottomSheetRef = useRef(null);

    const clearOpenToiletInfo = useWcDataStore(state => state.clearOpenToiletInfo);
    const isPickingLocation = useWcDataStore(state => state.isPickingLocation);
    const navigationStatus = useWcDataStore(state => state.navigation.status);
    const openToiletInfo = useWcDataStore(state => state.openToiletInfo);

    const onMarkerPress = (toilet) => {

        if (navigationStatus !== "idle") {
            return;
        }

        setTimeout(() => {
            toiletInfoBottomSheetRef.current?.present();
        }, 350);

    };

    const onAddWcPress = (toilet) => {
        addWcBottomSheetRef.current?.present();
    };

    useEffect(() => {
        getWc().catch((error) => {
            logger.error("Initial toilet fetch failed", {
                error: error.message,
            });
        });
    }, []);

    useEffect(() => {

        if (!openToiletInfo) {
            return;
        }

        const timer = setTimeout(() => {

            toiletInfoBottomSheetRef.current?.present();

            clearOpenToiletInfo();

        }, 350);

        return () => clearTimeout(timer);

    }, [
        openToiletInfo,
        clearOpenToiletInfo
    ]);

    useEffect(() => {
        if (navigationStatus !== "preview") {
            return;
        }

        const timer = setTimeout(() => {
            routePreviewBottomSheetRef.current?.present();
        }, 350);

        return () => clearTimeout(timer);
    }, [navigationStatus]);

    if (!curentLocation) return null;

    return (
        <View style={{ flex: 1 }}>

            <MapOfToilets
                ref={mapRef}
                currentLocation={curentLocation}
                isPickingLocation={isPickingLocation}
                onMarkerPress={onMarkerPress}
                onAddWcPress={onAddWcPress}
            />

            <SafeAreaView
                style={{
                    position: "absolute",
                    top: 10,
                    left: 25,
                    zIndex: 1000,
                }}
            >
                <BlurView
                    intensity={8}
                    tint="dark"
                    style={{
                        backgroundColor: theme.colors.secondaryLighter + "25",
                        width: 40,
                        height: 45,
                        borderRadius: 17,
                        overflow: "hidden",
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 8,
                        },
                        shadowOpacity: 0.12,
                        shadowRadius: 18,
                        elevation: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Pressable
                        onPress={() => {
                            useTopSheetStore.getState().open();
                        }}
                        style={{
                            width: 40,
                            height: 45,
                            borderRadius: 17,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {({ pressed }) => (
                            <Menu
                                size={18}
                                strokeWidth={1.8}
                                color={theme.colors.primary}
                                style={{
                                    transform: [{ scale: pressed ? 0.9 : 1 }]
                                }}
                            />
                        )}
                    </Pressable>
                </BlurView>
            </SafeAreaView>

            {/* search bar and its button become commented out so later it would be an updated featurewhen data become searchable */}

            {/* <SearchButton /> */}


            <View
                pointerEvents="box-none"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1000,
                }}>
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        right: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <BlurView
                        intensity={5}
                        tint="light"
                        style={{
                            backgroundColor: "transparent",
                            height: 45,
                            width: 65,
                            borderRadius: 99,
                            overflow: "hidden",
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 8,
                            },
                            shadowOpacity: 0.12,
                            shadowRadius: 18,
                            elevation: 10,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Pressable
                            onPress={() => mapRef.current?.zoomIn()}
                            style={{
                                height: 45,
                                width: 65,
                                backgroundColor: theme.colors.secondaryLighter + '25',
                                borderRadius: 99,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {({ pressed }) => (
                                <ZoomIn
                                    style={{ transform: [{ scale: pressed ? 0.95 : 1 }] }}
                                    size={35}
                                    strokeWidth={1.8}
                                    color={
                                        pressed
                                            ? theme.colors.secondaryLight
                                            : theme.colors.primary
                                    }
                                />
                            )}
                        </Pressable>
                    </BlurView>

                    <BlurView
                        intensity={5}
                        tint="light"
                        style={{
                            backgroundColor: "transparent",
                            height: 50,
                            width: 50,
                            borderRadius: 99,
                            overflow: "hidden",
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 8,
                            },
                            shadowOpacity: 0.12,
                            shadowRadius: 18,
                            elevation: 10,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Pressable
                            onPress={() => mapRef.current?.recenter()}
                            style={{
                                height: 50,
                                width: 50,
                                backgroundColor: theme.colors.primaryLighter + '65',
                                borderRadius: 99,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {({ pressed }) => (
                                <LocateFixed
                                    size={35}
                                    strokeWidth={1.8}
                                    color={
                                        pressed
                                            ? theme.colors.primaryDark
                                            : theme.colors.secondaryLight
                                    }
                                    style={{
                                        transform: [{ scale: pressed ? 0.95 : 1 }]
                                    }}
                                />
                            )}
                        </Pressable>
                    </BlurView>

                    <BlurView
                        intensity={5}
                        tint="light"
                        style={{
                            backgroundColor: "transparent",
                            height: 45,
                            width: 65,
                            borderRadius: 99,
                            overflow: "hidden",
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 8,
                            },
                            shadowOpacity: 0.12,
                            shadowRadius: 18,
                            elevation: 10,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Pressable
                            onPress={() => mapRef.current?.zoomOut()}
                            style={{
                                height: 45,
                                width: 65,
                                backgroundColor: theme.colors.secondaryLighter + '25',
                                borderRadius: 99,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {({ pressed }) => (
                                <ZoomOut
                                    size={35}
                                    strokeWidth={1.8}
                                    color={
                                        pressed
                                            ? theme.colors.secondaryLight
                                            : theme.colors.primary
                                    }
                                    style={{
                                        transform: [{ scale: pressed ? 0.95 : 1 }]
                                    }}
                                />
                            )}
                        </Pressable>
                    </BlurView>
                </View>

                {!isPickingLocation && (
                    <BlurView
                        intensity={0}
                        tint="dark"
                        style={{
                            position: "absolute",
                            bottom: 20,
                            right: 25,
                            backgroundColor: 'transparent',
                            width: 100,
                            height: 100,
                            borderRadius: 60,
                            overflow: "hidden",
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 8,
                            },
                            shadowOpacity: 0.12,
                            shadowRadius: 18,
                            elevation: 10,
                        }}
                    >
                        <Pressable
                            onPress={onAddWcPress}
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {({ pressed }) => (
                                <Image source={require("../../assets/selected-tab-splash.png")}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        transform: [{ scale: pressed ? 0.8 : 1 }]
                                    }} />
                            )}
                        </Pressable>
                    </BlurView>
                )}
            </View>

            <ToiletInfo
                ref={toiletInfoBottomSheetRef}
                curentLocation={curentLocation}
                onPresent={(index) => {
                    if (index === 0 && reopenToiletInfoAtSecondSnapRef.current) {
                        reopenToiletInfoAtSecondSnapRef.current = false;
                        toiletInfoBottomSheetRef.current?.snapToIndex(1);
                    }
                }}
            />
            <AddWc ref={addWcBottomSheetRef} />
            <RoutePreview
                ref={routePreviewBottomSheetRef}
                curentLocation={curentLocation}
                toiletInfoBottomSheetRef={toiletInfoBottomSheetRef}
                onReopenToiletInfo={() => {
                    reopenToiletInfoAtSecondSnapRef.current = true;
                }}
            />
            <MenuTopSheet />
        </View>
    )
};





