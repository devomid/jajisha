import { useState } from "react";
import { View, Image, ScrollView, Pressable, Modal, Dimensions, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function PhotoGallery({ photos = [] }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    return (
        <>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    gap: 12,
                    paddingVertical: 10,
                }}
            >
                {photos.length > 0 ? (
                    photos.map((photo, index) => (
                        <Pressable
                            key={index}
                            onPress={() => setSelectedPhoto(photo)}
                        >
                            <Image
                                source={{ uri: photo }}
                                style={{
                                    width: 110,
                                    height: 110,
                                    borderRadius: 16,
                                }}
                            />
                        </Pressable>
                    ))
                ) : (
                    <View style={{
                        justifyContent: "center",
                        alignItems: 'center',
                        height: 250,
                    }}>
                        <Image
                            source={require("../../assets/picPlaceHolder.png")}
                            style={{
                                width: 350,
                                height: 300,
                                resizeMode: "contain",
                            }} />
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={selectedPhoto !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedPhoto(null)}
            >
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.95)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => setSelectedPhoto(null)}
                >
                    {selectedPhoto && (
                        <Image
                            source={{ uri: selectedPhoto }}
                            resizeMode="contain"
                            style={{
                                width: width,
                                height: "100%",
                            }}
                        />
                    )}
                </Pressable>
            </Modal>
        </>
    );
}