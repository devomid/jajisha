// components/PageHeader.js

import { View, Pressable } from "react-native";
import { router } from "expo-router";
import { ChevronLeft, X } from "lucide-react-native";
import { useTheme, Text } from "react-native-paper";


export default function PageHeader({ pageName }) {
    const theme = useTheme();


    return (
        <View
            style={{
                width: '100%',
                height: 60,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
            }}
        >
            <Pressable onPress={() => {
                router.back();
            }}>

                <ChevronLeft
                    size={32}
                    color={theme.colors.secondary}
                />
            </Pressable>

            <Text
                variant="titleMedium"
                style={{
                    color:
                        theme.colors.secondary,
                }}>
                {pageName}
            </Text>

            <Pressable onPress={() => router.replace("/")}>
                <X
                    size={32}
                    color={theme.colors.secondary}
                />
            </Pressable>
        </View>
    );
}