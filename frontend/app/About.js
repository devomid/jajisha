import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";
import MapView from "react-native-maps";
import { BlurView } from "expo-blur";
import PageHeader from "../components/topNav/topNav";
import useCurrentLocation from "../src/hooks/useCurrentLocation";
import { useEffect, useState } from "react";

export default function About() {
  const pageName = "About"
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
          padding: 20,
          gap: 15
        }}>
          <Text>
            This app was built by tears and blood, during a war in my country.
          </Text>
          <Text>
            The initial idea was from Mohsen, I worked on it and here it is. Use it to not to wet your pants.
          </Text>
        </View>

      </SafeAreaView>

    </View>
  );
}
