import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";
import MapView from "react-native-maps";
import { BlurView } from "expo-blur";
import PageHeader from "../../components/topNav/topNav";
import useCurrentLocation from "../../src/hooks/useCurrentLocation";
import { useEffect, useState } from "react";

export default function SignUp() {
    const pageName = "Sign Up"
    const theme = useTheme();
    const currentLocation = useCurrentLocation();
    const [region, setRegion] = useState(null);

    useEffect(() => {
        if (!currentLocation?.coords) return;

        setRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        });
    }, [currentLocation]);

    if (!region) {
        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView>
                    <PageHeader />
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, }}>

            {/* MAP — full screen background */}
            <MapView
                style={StyleSheet.absoluteFillObject}
                showsUserLocation={false}
                initialRegion={region}
            />

            {/* PRIMARY COLOR + BLUR OVERLAY */}
            <BlurView
                intensity={15}
                tint="light"
                style={StyleSheet.absoluteFillObject}
            />

            <View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: theme.colors.primary,
                        opacity: 0.18,
                    },
                ]}
            />

            {/* EVERYTHING ABOVE THE MAP */}
            <SafeAreaView style={{ flex: 1, }}>

                <PageHeader pageName={pageName} />

                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>


                </View>

            </SafeAreaView>

        </View>
    );
}
