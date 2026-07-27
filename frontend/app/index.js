import 'react-native-reanimated';
import 'expo-router/entry';
import { useNavigation } from "expo-router";
import { View, Pressable, Image, Text } from "react-native";
import useCurrentLocation from '../src/hooks/useCurrentLocation';
import { Button } from "react-native-paper";
import { Menu } from 'lucide-react-native';
import { useTheme } from "react-native-paper";
import Colors from '../src/constants/colors';
import ToiletInfo from "../components/bottomSheet/ToiletLocationBottomSheet";
import AddWc from "../components/bottomSheet/AddWcBottomSheet";
import React, { useRef } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useDrawerStore } from "../store/drawerStore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import MapOfToilets from '../components/map/mapOfToilets';
import { useWcDataStore } from '../store/wcDataStore';
import { useGetWc } from '../src/hooks/useGetWc';


export default function Home() {
    useGetWc()
    const isPickingLocation =
        useWcDataStore(state => state.isPickingLocation);

    const { t } = useTranslation();
    const location = useCurrentLocation();
    const theme = useTheme();
    const toiletInfoBottomSheetRef = useRef(null);
    const addWcBottomSheetRef = useRef(null);
    const navigation = useNavigation();

    const shouldOpenDrawer = useDrawerStore(
        (state) => state.shouldOpenDrawer
    );

    const reset = useDrawerStore(
        (state) => state.reset
    );

    useFocusEffect(
        useCallback(() => {
            if (shouldOpenDrawer) {
                navigation.openDrawer();
                reset();
            }
        }, [shouldOpenDrawer])
    );

    const onMarkerPress = (toilet) => {
        // setSelectedToilet(toilet);
        toiletInfoBottomSheetRef.current?.present();
    };

    const onAddWcPress = (toilet) => {
        // setSelectedToilet(toilet);
        addWcBottomSheetRef.current?.present();
        // console.log("onAddWcPress");
    };


    if (!location) return null;

    return (
        <View style={{ flex: 1 }}>

            <MapOfToilets
                location={location}
                onMarkerPress={onMarkerPress}
                isPickingLocation={isPickingLocation}
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
                        backgroundColor: "rgba(255, 238, 0, 0.20)",
                        width: 55,
                        height: 55,
                        borderRadius: 28,
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
                        onPress={() => navigation.openDrawer()}
                        style={{
                            height: 55,
                            width: 55,
                            borderRadius: 60,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.35)",
                        }}
                    >

                        <Menu size={28} color={theme.colors.primary} />
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

                            backgroundColor: "rgba(255, 238, 0, 0.20)",

                            width: 100,
                            height: 100,

                            borderRadius: 60,

                            // borderBottomLeftRadius: 45,
                            // borderBottomRightRadius: 60,
                            // borderTopLeftRadius: 80,
                            // borderTopRightRadius:50,
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
                            <Image source={require("../assets/selected-tab-splash.png")} style={{ width: 95, height: 95 }} />
                        </Pressable>
                    </BlurView>
                )}
            </View>
            <ToiletInfo ref={toiletInfoBottomSheetRef} location={location} />
            <AddWc ref={addWcBottomSheetRef} />
        </View>
    )
};





