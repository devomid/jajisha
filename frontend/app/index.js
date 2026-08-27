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

import { View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Menu } from 'lucide-react-native';

import MapOfToilets from '../components/map/mapOfToilets';
import ToiletInfo from "../components/bottomSheet/ToiletLocationBottomSheet";
import AddWc from "../components/bottomSheet/AddWcBottomSheet";
import RoutePreview from '../components/bottomSheet/RoutePreview';

export default function Home() {

    useGetWc()

    const isPickingLocation = useWcDataStore(state => state.isPickingLocation);
    const navigationStatus = useWcDataStore(state => state.navigation.status);
    const shouldOpenDrawer = useDrawerStore((state) => state.shouldOpenDrawer);
    const reset = useDrawerStore((state) => state.reset);

    const { t } = useTranslation();
    const curentLocation = useCurrentLocation();
    const theme = useTheme();
    const toiletInfoBottomSheetRef = useRef(null);
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
        if (navigationStatus === "preview") {
            routePreviewBottomSheetRef.current?.present();
        }
    }, [navigationStatus]);


    const onMarkerPress = (toilet) => {
        // setSelectedToilet(toilet);
        toiletInfoBottomSheetRef.current?.present();
    };

    const onAddWcPress = (toilet) => {
        // setSelectedToilet(toilet);
        addWcBottomSheetRef.current?.present();
        // console.log("onAddWcPress");
    };

    const onNavigatePress = (location) => {
        routePreviewBottomSheetRef.current?.present();
    }


    if (!curentLocation) return null;

    return (
        <View style={{ flex: 1 }}>

            <MapOfToilets
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
                        backgroundColor: "rgba(255, 238, 0, 0.1)",
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
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.35)",
                        }}
                    >
                        <Menu size={20} color={theme.colors.primary} />
                    </Pressable>
                </BlurView>
            </SafeAreaView>

            <View>
                {!isPickingLocation && (
                    <BlurView
                        intensity={8}
                        tint="dark"
                        style={{
                            position: "absolute",
                            bottom: 20,
                            right: 20,
                            backgroundColor: "rgba(255, 238, 0, 0.1)",
                            width: 95,
                            height: 95,
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
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.35)",
                            }}
                        >
                            <Image source={require("../assets/selected-tab-splash.png")} style={{ width: 90, height: 90 }} />
                        </Pressable>
                    </BlurView>
                )}
            </View>
            <ToiletInfo ref={toiletInfoBottomSheetRef} curentLocation={curentLocation} onNavigatePress={onNavigatePress} />
            <AddWc ref={addWcBottomSheetRef} />
            <RoutePreview ref={routePreviewBottomSheetRef} curentLocation={curentLocation} toiletInfoBottomSheetRef={toiletInfoBottomSheetRef} />
        </View>
    )
};





