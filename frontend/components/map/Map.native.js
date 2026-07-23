import { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Image, View } from "react-native";

export default function Map({ location, onMarkerPress }) {
    const [latitudeDelta, setLatitudeDelta] = useState(0.02);

    if (!location) return null;

    const markerSize = Math.max(
        40,
        Math.min(
            85,
            80 * Math.pow(0.02 / latitudeDelta, 0.25)
        )
    );

    return (
        <MapView
            style={{ flex: 1 }}
            showsUserLocation
            followsUserLocation
            initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            }}
            onRegionChangeComplete={(region) => {
                setLatitudeDelta(region.latitudeDelta);
            }}
        >
            <Marker
                coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }}
                onPress={onMarkerPress}
                centerOffset={{ x: 3, y: -markerSize / 2 }}
            >
                <Image
                    source={require("../../assets/toiletLocation.png")}
                    style={{
                        width: markerSize,
                        height: markerSize,
                        resizeMode: "contain",
                        // iOS shadow
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 8,
                            height: 8,
                        },
                        shadowOpacity: 0.14,
                        shadowRadius: 5,

                        // Android shadow
                        elevation: 3,
                    }}
                />
            </Marker>
        </MapView>
    );
}