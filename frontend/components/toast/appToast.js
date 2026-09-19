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

    const backgroundColor = accentColor + "40";
    const borderColor = accentColor + "80";

    const Icon = isError
        ? TriangleAlert
        : isInfo
            ? Info
            : CircleCheck;

    return (
        <View style={styles.container}>

            <BlurView
                intensity={7}
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
                        borderColor: borderColor,
                    },
                ]}
            >
                <Icon
                    size={24}
                    color={accentColor}
                    strokeWidth={2.2}
                />

                <View style={styles.textContainer}>

                    <Text
                        variant="bodySmall"
                        style={[
                            styles.message,
                            {
                                color: theme.colors.onSurface,
                            },
                        ]}
                    >
                        {message}
                    </Text>

                    {text2 ? (
                        <Text
                            style={[
                                styles.text2,
                                {
                                    color: theme.colors.onSurfaceVariant,
                                },
                            ]}
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
        width: "88%",
        minHeight: 64,
        borderRadius: 24,
        overflow: "hidden",
    },

    content: {
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 16,
        paddingVertical: 12,

        borderWidth: 1,
        borderRadius: 24,
    },

    textContainer: {
        flex: 1,
        marginLeft: 12,
    },

    message: {
        fontSize: 15,
        fontWeight: "700",
    },

    text2: {
        marginTop: 2,
        fontSize: 13,
    },
});