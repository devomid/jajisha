// components/PageHeader.js

import { View, Pressable } from "react-native";
import { router } from "expo-router";
import { ChevronLeft, X } from "lucide-react-native";
import { useTheme } from "react-native-paper";
import { useDrawerStore } from "../../store/drawerStore";

export default function PageHeader() {
    const theme = useTheme();

    const openDrawerOnReturn = useDrawerStore(
        (state) => state.openDrawerOnReturn
    );

    return (
        <View
            style={{
                width:'100%',
                height: 60,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
            }}
        >
            <Pressable onPress={() => {
                openDrawerOnReturn();
                router.back();
            }}>
                <ChevronLeft
                    size={32}
                    color={theme.colors.secondary}
                />
            </Pressable>

            <Pressable onPress={() => router.replace("/")}>
                <X
                    size={32}
                    color={theme.colors.secondary}
                />
            </Pressable>
        </View>
    );
}