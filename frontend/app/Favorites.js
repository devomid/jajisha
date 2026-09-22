import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Redirect, router } from "expo-router";

import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { ScrollView } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

import useCurrentLocation from "../src/hooks/useCurrentLocation";
import { useUserStore } from "../store/userStore";
import { useSettingsStore } from "../store/settingsStore";
import { useWcDataStore } from "../store/wcDataStore";
import { useTopSheetStore } from "../store/menuStore";

import ToiletCard from "../components/cards/ToiletCards";
import PageHeader from "../components/topNav/topNav";

export default function Favorites() {
  const { t } = useTranslation();
  const pageName = t("app.favorites.pageName")
  const theme = useTheme();
  const currentLocation = useCurrentLocation();

  const [region, setRegion] = useState(null);
  const requestOpenToiletInfo = useWcDataStore(state => state.requestOpenToiletInfo);
  const setSelectedToilet = useWcDataStore(state => state.setSelectedToilet);
  const mapType = useSettingsStore(state => state.mapType);
  const close = useTopSheetStore((state) => state.close);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!currentLocation?.coords) return;

    setRegion({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  }, [currentLocation]);

  if (!user) {
    return <Redirect href="/SignIn" />;
  };

  const favoriteToilets = user.favoriteToilets;

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
        style={StyleSheet.absoluteFillObject}
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
          borderRadius: 48,
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
            borderRadius: 48,
          },
        ]}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <PageHeader pageName={pageName} />

        {favoriteToilets?.length ? (
          <ScrollView contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: 10,
            paddingHorizontal: 16
          }}>

            {favoriteToilets.map((toilet) => (

              <ToiletCard
                key={toilet._id}
                toilet={toilet}
                onPress={() => {
                  setSelectedToilet(toilet);
                  requestOpenToiletInfo();
                  close();
                  router.replace("/");
                }}
              />
            ))}

          </ScrollView>
        ) : (
          <View style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text>
              {t("app.favorites.noFavoritesText")}
            </Text>
          </View>
        )}

      </SafeAreaView>

    </View>
  );
}
