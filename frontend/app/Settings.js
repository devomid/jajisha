import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Text, useTheme } from "react-native-paper";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import { BlurView } from "expo-blur";

import useCurrentLocation from "../src/hooks/useCurrentLocation";
import { useSettingsStore } from "../store/settingsStore";

import PageHeader from "../components/topNav/topNav";
import GeneralSettings from "../components/setting/general";
import MapSettings from "../components/setting/map";
import AboutSettings from "../components/setting/about";

export default function Settings() {
  const { t } = useTranslation();
  const theme = useTheme();

  const pageName = t("components.settings.pageName") 
  const currentLocation = useCurrentLocation();

  const [region, setRegion] = useState(null);
  const mapType = useSettingsStore(state => state.mapType);

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

      <MapView
        mapType={mapType}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
        showsUserLocation={false}
        initialRegion={region}
      />

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
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: theme.colors.primary,
          opacity: 0.23,
          margin: 12,
          borderRadius: 48
        }}
      />

      <SafeAreaView style={{ flex: 1, }}>
        <PageHeader pageName={pageName} />
        <ScrollView style={{
          marginBottom: 10
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
