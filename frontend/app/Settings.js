import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";
import MapView from "react-native-maps";
import { BlurView } from "expo-blur";
import PageHeader from "../components/topNav/topNav";
import useCurrentLocation from "../src/hooks/useCurrentLocation";
import { useEffect, useState } from "react";
import GeneralSettings from "../components/setting/general";
import MapSettings from "../components/setting/map";
import AboutSettings from "../components/setting/about";

export default function Settings() {
  const pageName = "Settings"
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
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          margin: 12,
          borderRadius: 48
        }}
      />

      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: theme.colors.primary,
            opacity: 0.23,
            margin: 12,
            borderRadius: 48
          },
        ]}
      />

      {/* EVERYTHING ABOVE THE MAP */}
      <SafeAreaView style={{ flex: 1, }}>

        <PageHeader pageName={pageName} />

        <ScrollView style={{
          marginBottom:10
        }}>

          <GeneralSettings theme={theme} />
          <MapSettings theme={theme} />
          <AboutSettings theme={theme} />

        </ScrollView>

        <Text style={{
          fontSize: 9,
          color: theme.colors.text + '60',
          alignSelf: 'center',
        }}>
          Developed by: devom. 2026
        </Text>

      </SafeAreaView>

    </View>
  );
}
