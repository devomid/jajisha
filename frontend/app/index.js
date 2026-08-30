import 'react-native-reanimated';
import 'expo-router/entry';
import { useCallback, useEffect, useRef } from "react";
import { useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import { useDrawerStore } from "../store/drawerStore";
import { useTranslation } from "react-i18next";
import { useWcDataStore } from '../store/wcDataStore';
import { useGetWc } from '../src/hooks/useGetWc';
import useCurrentLocation from '../src/hooks/useCurrentLocation';
import { useAuth } from '../src/hooks/useAuth';

import { View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Menu, LocateFixed, ZoomOut, ZoomIn, Search } from 'lucide-react-native';

import MapOfToilets from '../components/map/mapOfToilets';
import ToiletInfo from "../components/bottomSheet/ToiletLocationBottomSheet";
import AddWc from "../components/bottomSheet/AddWcBottomSheet";
import RoutePreview from '../components/bottomSheet/RoutePreview';
import SearchButton from '../components/searchBar/animatedSearchBtn';


export default function Home() {

    useGetWc()

    const isPickingLocation = useWcDataStore(state => state.isPickingLocation);
    const navigationStatus = useWcDataStore(state => state.navigation.status);
    const shouldOpenDrawer = useDrawerStore((state) => state.shouldOpenDrawer);
    const reset = useDrawerStore((state) => state.reset);


    const { t } = useTranslation();
    const { restoreUser } = useAuth();
    const mapRef = useRef(null);
    const curentLocation = useCurrentLocation();
    const theme = useTheme();
    const toiletInfoBottomSheetRef = useRef(null);
    const reopenToiletInfoAtSecondSnapRef = useRef(false);
    const addWcBottomSheetRef = useRef(null);
    const routePreviewBottomSheetRef = useRef(null);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            if (shouldOpenDrawer) {
                navigation.openDrawer();
                reset();
            }
        }, [shouldOpenDrawer])
    );

    useEffect(() => {
        if (navigationStatus !== "preview") {
            return;
        }

        const timer = setTimeout(() => {
            routePreviewBottomSheetRef.current?.present();
        }, 350);

        return () => clearTimeout(timer);
    }, [navigationStatus]);

    useEffect(() => {
        restoreUser()
    }, [])


    // const onMarkerPress = (toilet) => {
    //     // setSelectedToilet(toilet);
    //     toiletInfoBottomSheetRef.current?.present();
    // };
    // const onMarkerPress = (toilet) => {
    //     console.log("1. marker pressed");

    //     toiletInfoBottomSheetRef.current?.present();

    //     console.log(
    //         "2. present called",
    //         !!toiletInfoBottomSheetRef.current
    //     );
    // };

    const onMarkerPress = (toilet) => {
        console.log("1. marker pressed");

        if (navigationStatus !== "idle") {
            console.log("Navigation still active:", navigationStatus);
            return;
        }

        setTimeout(() => {
            toiletInfoBottomSheetRef.current?.present();
        }, 350);

        console.log(
            "2. ref exists:",
            !!toiletInfoBottomSheetRef.current
        );
    };

    const onAddWcPress = (toilet) => {
        // setSelectedToilet(toilet);
        addWcBottomSheetRef.current?.present();
        // console.log("onAddWcPress");
    };

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
                        backgroundColor: theme.colors.secondaryLighter + "40",
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
                        onPress={() => navigation.openDrawer()}
                        style={{
                            width: 40,
                            height: 45,
                            borderRadius: 17,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {({ pressed }) => (
                            <Menu style={{ transform: [{ scale: pressed ? 0.9 : 1 }] }} size={20} color={theme.colors.primary} />
                        )}
                    </Pressable>
                </BlurView>
            </SafeAreaView>

            <SearchButton />

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
                {!isPickingLocation && (
                    <>
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
                                        backgroundColor: theme.colors.secondaryLighter + '40',
                                        borderRadius: 99,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {({ pressed }) => (
                                        <ZoomIn
                                            style={{ transform: [{ scale: pressed ? 0.95 : 1 }] }}
                                            size={40}
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
                                        backgroundColor: theme.colors.primaryLighter + '40',
                                        borderRadius: 99,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {({ pressed }) => (
                                        <LocateFixed
                                            style={{ transform: [{ scale: pressed ? 0.95 : 1 }] }}
                                            size={40}
                                            color={
                                                pressed
                                                    ? theme.colors.primaryDark
                                                    : theme.colors.secondaryLight
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
                                        backgroundColor: theme.colors.secondaryLighter + '40',
                                        borderRadius: 99,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {({ pressed }) => (
                                        <ZoomOut
                                            style={{ transform: [{ scale: pressed ? 0.95 : 1 }] }}
                                            size={40}
                                            color={
                                                pressed
                                                    ? theme.colors.secondaryLight
                                                    : theme.colors.primary
                                            }
                                        />
                                    )}
                                </Pressable>
                            </BlurView>
                        </View>
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
                                    <Image source={require("../assets/selected-tab-splash.png")}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            transform: [{ scale: pressed ? 0.8 : 1 }]
                                        }} />
                                )}
                            </Pressable>
                        </BlurView>
                    </>
                )}
            </View>
            <ToiletInfo
                ref={toiletInfoBottomSheetRef}
                curentLocation={curentLocation}
                onPresent={(index) => {
                    if (
                        index === 0 &&
                        reopenToiletInfoAtSecondSnapRef.current
                    ) {
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
                onDismiss={() => {
                    console.log("HOME >>> ROUTE PREVIEW FULLY DISMISSED");
                }}
                onReopenToiletInfo={() => {
                    reopenToiletInfoAtSecondSnapRef.current = true;
                }}
            />
        </View>
    )
};





