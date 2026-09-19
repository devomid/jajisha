import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme, Text } from "react-native-paper";
import {
    CircleCheck,
    TriangleAlert,
    Info,
} from "lucide-react-native";

export default function AppToast({
    message,
    data,
}) {
    const theme = useTheme();

    const type = data?.type || "success";
    const text2 = data?.text2;

    const isError = type === "error";
    const isInfo = type === "info";

    const accentColor = isError
        ? theme.colors.error
        : isInfo
            ? theme.colors.warning
            : theme.colors.success;

    const backgroundColor = accentColor + "20";
    const borderColor = accentColor + "80";

    const Icon = isError
        ? TriangleAlert
        : isInfo
            ? Info
            : CircleCheck;

    return (
        <View style={styles.container}>

            <BlurView
                intensity={15}
                tint={theme.dark ? "dark" : "light"}
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: backgroundColor,
                    },
                ]}
            />

            <View
                style={[
                    styles.content,
                    {
                        borderColor: theme.colors.surface + '80',
                    },
                ]}
            >
                <Icon
                    size={23}
                    color={accentColor}
                    strokeWidth={2}
                />

                <View style={styles.textContainer}>

                    <Text
                        variant="titleSmall"
                        style={{
                            color: accentColor,
                            marginTop:2
                        }}
                    >
                        {message}
                    </Text>

                    {text2 ? (
                        <Text variant="bodySmall"
                            style={{
                                color: accentColor + '80',
                                marginBottom: 2
                            }}
                        >
                            {text2}
                        </Text>
                    ) : null}

                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "84%",
        height: 68,
        borderRadius: 24,
        overflow: "hidden",
    },

    content: {
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 14,
        paddingVertical: 5,

        borderWidth: 1,
        borderRadius: 24,
    },

    textContainer: {
        flex: 1,
        marginLeft: 18,
    },

});