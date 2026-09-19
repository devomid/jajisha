import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";
import MapView from "react-native-maps";
import { BlurView } from "expo-blur";
import PageHeader from "../components/topNav/topNav";
import useCurrentLocation from "../src/hooks/useCurrentLocation";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { Redirect } from "expo-router";
import ToiletCard from "../components/cards/ToiletCards";
import { ScrollView } from "react-native";
import { useAuth } from "../src/hooks/useAuth";
import { useSettingsStore } from "../store/settingsStore";
import { useWcDataStore } from "../store/wcDataStore";
import { router } from "expo-router";
import { useTopSheetStore } from "../store/menuStore";

export default function Favorites() {
  const { restoreUser } = useAuth();
  const user = useUserStore((state) => state.user);
  const requestOpenToiletInfo = useWcDataStore(state => state.requestOpenToiletInfo);
  const setSelectedToilet = useWcDataStore(state => state.setSelectedToilet);
  const pageName = "Saved Toilets"
  const theme = useTheme();
  const currentLocation = useCurrentLocation();
  const [region, setRegion] = useState(null);
  const favoriteToilets = user.favoriteToilets;
  const mapType = useSettingsStore(state => state.mapType);
  const close = useTopSheetStore((state) => state.close);

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
  }

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
        mapType={mapType}
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

      {/* EVERYTHING ABOVE THE MAP */}
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
              No saved place yet.
            </Text>
          </View>
        )}

      </SafeAreaView>

    </View>
  );
}
