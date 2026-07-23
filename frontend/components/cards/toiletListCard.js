import React from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { MapPin, Star } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useThemeColor from '../../hooks/useThemeColor';
import { Image } from "react-native";
import Spacing from '../../constants/spacing';


const { width, height } = Dimensions.get("window");

export default function ToiletCard({ item, onPress }) {
    const color = useThemeColor();

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={onPress} style={{ justifyContent: "center", alignItems: 'center' }}>
                <View
                    style={{
                        width: width - 40, // 👈 small margin around
                        height: height * 0.18, // 👈 18% of screen height

                        backgroundColor: color.surface,
                        borderWidth: '0.5',
                        borderColor: color.secondaryLight,
                        borderRadius: 18,

                        padding: Spacing.md,
                        marginVertical: -37,

                        shadowColor: color.black,
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 5 },
                        elevation: 4,

                        flexDirection: "row",
                        alignItems: "flex-start",
                    }}
                >
                    {/* LEFT ICON AREA */}
                    <View
                    style={{
                        width: '45%',
                        height: '100%',
                        borderRadius: 12,
                        justifyContent: "center",
                            alignItems: "center",
                        paddingRight: Spacing.sm
                    }}
                    >
                        <Image
                            source={require("../../../assets/picPlaceHolder.png")}
                            style={{ width: 150, height: 170 }}
                        />

                        {/* <MapPin size={24} color={color.primaryDarker} /> */}
                    </View>

                    {/* CONTENT */}
                    <View
                        style={{
                            flex: 1,
                            height: '100%'

                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: color.text,
                                textAlign: 'right',
                                width: '100%',
                            }}
                            numberOfLines={1}
                        >
                            توالت عمومی
                            {/* {item.name || "Public Toilet"} */}
                        </Text>

                        <Text
                            style={{
                                fontSize: 13,
                                color: color.text,
                                textAlign: 'right',
                                marginTop: 25,
                            }}
                            numberOfLines={2}
                        >
                            {/* {item.address || "Unknown location"} */}
                            خیابان اول - نبش پارک
                        </Text>

                        {/* FOOTER INFO */}
                        <View
                            style={{
                                flexDirection: "row",
                                marginTop: 10,
                                justifyContent: 'space-between',
                            }}
                        >
                            <Star size={14} color={color.secondary} style={{
                                width: "100%"
                            }} />

                            <Text style={{
                                fontSize: 14,
                                color: color.textSecondary,
                            }}
                            >
                                رایگان
                            </Text>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            flex: 1,
                            marginTop: 20,
                            width: "100%",
                            justifyContent: 'space-between'
                        }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: color.text,
                                }}
                            >
                                {/* {item.rating || "4.2"} */}
                                4.2 (1842)
                            </Text>

                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontSize: 12,
                                    color: color.textSecondary,
                                }}
                            >
                                {/* • {item.distance || "1.2 km"} */}
                                1.2 km
                            </Text>
                        </View>
                    </View>

                    {/* RIGHT SIDE BADGE */}
                    {/* <View
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            backgroundColor: "#10B98120",
                            borderRadius: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                color: "#10B981",
                                fontWeight: "600",
                            }}
                        >
                            Open
                        </Text>
                    </View> */}
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}