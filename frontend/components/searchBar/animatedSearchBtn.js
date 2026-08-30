import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { TextInput, useTheme } from "react-native-paper";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { Search } from "lucide-react-native";

export default function SearchButton() {
    const theme = useTheme();

    const inputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const width = useSharedValue(40);

    const toggleSearch = () => {
        if (!isOpen) {
            // OPEN
            setIsOpen(true);

            width.value = withTiming(280, {
                duration: 220,
            });

            // Focus input -> keyboard opens
            setTimeout(() => {
                inputRef.current?.focus();
            }, 220);

        } else {
            // CLOSE
            inputRef.current?.blur();

            width.value = withTiming(40, {
                duration: 220,
            });

            setIsOpen(false);
        }
    };

    const containerStyle = useAnimatedStyle(() => ({
        width: width.value,
    }));

    return (
        <SafeAreaView
            style={{
                position: "absolute",
                top: 10,
                left: 85,
                zIndex: 1000,
            }}
        >
            <Animated.View
                style={[
                    {
                        height: 45,
                        borderRadius: 17,
                        overflow: "hidden",

                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 8,
                        },
                        shadowOpacity: 0.12,
                        shadowRadius: 18,
                        elevation: 10,

                        flexDirection: "row",
                        alignItems: "center",
                    },
                    containerStyle,
                ]}
            >
                {/* Blur background */}
                <BlurView
                    intensity={8}
                    tint="dark"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor:
                            theme.colors.secondaryLighter + "40",
                    }}
                />

                {/* Search button */}
                <Pressable
                    onPress={toggleSearch}
                    style={{
                        width: 40,
                        height: 45,
                        borderRadius: 17,
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 2,
                    }}
                >
                    {({ pressed }) => (
                        <Search
                            size={23}
                            color={theme.colors.primary}
                            style={{
                                transform: [
                                    {
                                        scale: pressed ? 0.9 : 1,
                                    },
                                ],
                            }}
                        />
                    )}
                </Pressable>

                {/* Search input */}
                <View
                    style={{
                        flex: 1,
                        height: 45,
                        marginLeft: 5,
                        justifyContent: "center",
                    }}
                >
                    <TextInput
                        ref={inputRef}
                        mode="flat"
                        placeholder="Search..."
                        cursorColor={theme.colors.primary}
                        selectionColor={theme.colors.primary}
                        style={{
                            height: 45,
                            backgroundColor: "transparent",
                        }}
                        contentStyle={{
                            paddingHorizontal: 5,
                        }}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                    />
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}