import React, { forwardRef, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming, interpolateColor, } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import GlassBackground from "../../components/blur/blurView";
import { useTopSheetStore } from "../../store/menuStore";
import { useUserStore } from "../../store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import CountryFlag from "react-native-country-flag";
import { router } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonComponent from '../Button/Button';


const TopSheet = forwardRef((props, ref) => {


    const { i18n } = useTranslation();
    const language = i18n.language;
    const theme = useTheme();
    const backdropOpacity = useSharedValue(0);
    const translateY = useSharedValue(0);
    const { logout } = useAuth();

    const [sheetHeight, setSheetHeight] = useState(0);

    const close = useTopSheetStore((state) => state.close);
    const user = useUserStore((state) => state.user);
    const isOpen = useTopSheetStore((state) => state.isOpen);

    const SHEET_HEIGHT = user ? "39%" : "33%"

    const languageProgress = useSharedValue(language === "fa" ? 1 : 0);

    useEffect(() => {
        languageProgress.value = withTiming(
            language === "fa" ? 1 : 0,
            {
                duration: 300,
            }
        );
    }, [language]);

    const animatedSelectorStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: `${languageProgress.value * 100}%`,
                },
            ],
            backgroundColor: interpolateColor(
                languageProgress.value,
                [0, 1],
                [
                    theme.colors.secondary + "40",
                    theme.colors.secondary + "40",
                ]
            ),
        };
    });

    useEffect(() => {

        if (sheetHeight === 0) { return; }

        if (isOpen) {
            translateY.value = withTiming(0, { duration: 300, });
            backdropOpacity.value = withTiming(1, { duration: 300, });
        } else {
            translateY.value = withTiming(-sheetHeight, { duration: 250, });
            backdropOpacity.value = withTiming(0, { duration: 250, });
        }
    }, [isOpen, sheetHeight]);

    const sheetAnimatedStyle =
        useAnimatedStyle(() => {
            return { transform: [{ translateY: translateY.value, }] };
        });

    const backdropAnimatedStyle =
        useAnimatedStyle(() => {
            return { opacity: backdropOpacity.value, };
        });

    const panGesture =
        Gesture.Pan().onUpdate((event) => {
            if (event.translationY < 0) {
                translateY.value = event.translationY;
            } else {
                translateY.value = 0;
            }
        }).onEnd((event) => {
            const draggedEnough = event.translationY < -(sheetHeight * 0.20);
            const swipedFastEnough = event.velocityY < -700;
            if (draggedEnough || swipedFastEnough) {
                translateY.value =
                    withTiming(-sheetHeight, { duration: 220 },
                        (finished) => {
                            if (finished) { runOnJS(close)(); }
                        }
                    );
                backdropOpacity.value = withTiming(0, { duration: 220, });
            } else {
                translateY.value = withTiming(0, { duration: 200, });
            }
        });

    const handleBackdropPress = () => {
        close();
    };

    const changeLanguage = async (lan) => {

        if (lan === i18n.language)
            return;

        await i18n.changeLanguage(lan);
        await AsyncStorage.setItem("language", lan);
    };

    const handleSheetLayout = (event) => {
        const height = event.nativeEvent.layout.height;
        if (height !== sheetHeight) {
            setSheetHeight(height);
        }
    };

    return (

        <View
            pointerEvents={isOpen ? "box-none" : "none"}
            style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 9999,
                elevation: 9999,
            }}
        >
            <Animated.View
                pointerEvents={isOpen ? "auto" : "none"}
                style={[{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: theme.colors.primaryLighter + '20'

                },
                    backdropAnimatedStyle,
                ]}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={handleBackdropPress}
                />
            </Animated.View>

            <Animated.View
                onLayout={handleSheetLayout}
                style={[
                    {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: SHEET_HEIGHT,
                        overflow: "hidden",
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 0.18,
                        shadowRadius: 10,
                        elevation: 10,
                    },
                    sheetAnimatedStyle,
                ]}
            >

                <GlassBackground
                    theme={theme}
                    style={StyleSheet.absoluteFill}
                />

                <SafeAreaView style={{
                    flex: 1,
                    width: "100%",
                    alignItems: "stretch",
                    justifyContent: "flex-start",
                    paddingHorizontal: 20,
                }}>
                    <View style={{
                        width: "100%",
                        marginBottom: 25,
                        marginTop: 5
                    }}>

                        <Text
                            variant="headlineSmall"
                            style={{ color: theme.colors.secondaryDark, }}
                        >
                            Hello,{" "}
                        </Text>

                        <Text
                            variant="titleSmall"
                            style={{ color: theme.colors.secondaryDarker, }}
                        >
                            welcome back dear {user ? (user.firstName) : ('Guest')}
                        </Text>

                    </View>

                    {!user ? (
                        <ButtonComponent
                            onPress={() => { router.push('/SignIn'); }}
                            backgroundColor={theme.colors.secondary + '40'}
                            borderColor={theme.colors.secondaryLighter + '80'}
                            style={{ width: '100%' }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.primaryLighter,
                                    fontSize: 15,
                                    fontWeight: "500",
                                }}
                            >
                                Sign In
                            </Text>
                        </ButtonComponent>
                    ) : (
                        <ButtonComponent
                            onPress={() => { router.push('/SignIn'); }}
                            backgroundColor={theme.colors.error + '40'}
                            borderColor={theme.colors.error + '30'}
                            style={{ width: '100%' }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.primaryLighter,
                                    fontSize: 15,
                                    fontWeight: "500",
                                }}
                            >
                                Sign Out
                            </Text>
                        </ButtonComponent>
                    )}

                    <View
                        style={{
                            width: "100%",
                            height: 44,
                            flexDirection: "row",
                            alignItems: "stretch",
                            gap: 10,
                            marginTop: 10,
                        }}
                    >

                        {/* SETTINGS */}

                        <ButtonComponent
                            onPress={() => { router.push('/Settings'); }}
                            backgroundColor={theme.colors.secondary + '40'}
                            borderColor={theme.colors.secondaryLighter + '80'}
                            style={{
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.primaryLighter,
                                    fontSize: 15,
                                    fontWeight: "500",
                                }}
                            >
                                Settings
                            </Text>
                        </ButtonComponent>


                        {/* LANGUAGE SWITCH */}

                        <View
                            style={{
                                flex: 1,
                                minWidth: 0,
                                height: 44,
                            }}
                        >
                            <BlurView
                                intensity={30}
                                tint={theme.dark ? "dark" : "light"}
                                style={{
                                    width: "100%",
                                    height: 44,
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    borderWidth: 0.5,
                                    borderColor: theme.colors.secondaryLighter + '80',
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        width: "100%",
                                        flexDirection: "row",
                                    }}
                                >

                                    {/* ANIMATED SELECTOR */}
                                    <Animated.View
                                        pointerEvents="none"
                                        style={[
                                            {
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                                width: "50%",
                                                borderRadius: 14,
                                            },
                                            animatedSelectorStyle,
                                        ]}
                                    />

                                    {/* ENGLISH */}
                                    <Pressable
                                        onPress={() => { changeLanguage("en"); }}
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >

                                        {({ pressed }) => (

                                            <View
                                                style={{
                                                    opacity: pressed ? 0.55 : 1,
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 6,
                                                }}
                                            >
                                                <CountryFlag isoCode="us" size={10} />
                                                <Text
                                                    style={{
                                                        color: language === "en" ? theme.colors.primaryLighter : theme.colors.secondary + '80',
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    EN
                                                </Text>
                                            </View>
                                        )}
                                    </Pressable>


                                    {/* PERSIAN */}
                                    <Pressable
                                        onPress={() => { changeLanguage("fa"); }}
                                        style={{
                                            flex: 1, minWidth: 0, alignItems: "center", justifyContent: "center",
                                        }}
                                    >
                                        {({ pressed }) => (
                                            <View
                                                style={
                                                    {
                                                        opacity: pressed ? 0.55 : 1,
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: 6,
                                                    }}
                                            >
                                                <Text
                                                    style={{
                                                        color: language === "fa" ? theme.colors.primaryLighter : theme.colors.secondary + '80',
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    FA
                                                </Text>
                                                <CountryFlag isoCode="ir" size={10} />
                                            </View>
                                        )}
                                    </Pressable>
                                </View>
                            </BlurView>
                        </View>
                    </View>

                    {user && (
                        <ButtonComponent
                            onPress={() => { router.push('/Favorites'); }}
                            backgroundColor={theme.colors.secondary + '40'}
                            borderColor={theme.colors.secondaryLighter + '80'}
                            style={{
                                width: "100%",
                                marginTop: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.primaryLighter,
                                    fontSize: 15,
                                    fontWeight: "500",
                                }}
                            >
                                Saved Toilets
                            </Text>
                        </ButtonComponent>
                    )}
                </SafeAreaView>


                <View
                    pointerEvents="box-only"
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 45,
                        zIndex: 999999,
                        elevation: 999999,
                    }}
                >
                    <GestureDetector gesture={panGesture}>
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <View
                                style={{
                                    width: 55,
                                    height: 5,
                                    borderRadius: 999,
                                    backgroundColor: theme.colors.surface + "CC",
                                }}
                            />
                        </View>
                    </GestureDetector>
                </View>
            </Animated.View>
        </View>
    );
});


export default TopSheet;