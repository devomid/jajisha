import React, { useState } from "react";
import { Pressable, View, ImageBackground } from "react-native";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItemList, DrawerItem, } from "@react-navigation/drawer";
import { useTheme, Text, } from "react-native-paper";
import { Map, Heart, Settings, CircleHelp, User, Info } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import CountryFlag from "react-native-country-flag";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../../store/userStore";


const CustomDrawerContent = (props) => {

    const user = useUserStore((state) => state.user);

    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const language = i18n.language;
    const theme = useTheme();
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const changeLanguage = async (lan) => {

        if (lan === i18n.language)
            return;

        await i18n.changeLanguage(lan);
        await AsyncStorage.setItem("language", lan);
    };

    // console.log(theme.colors.secondary);


    return (
        <BlurView intensity={30}
            tint="extraLight"
            style={{
                flex: 1,
                backgroundColor: "rgba(251, 238, 62, 0.25)", // your primary with alpha
                borderRightWidth: 1,
                borderRightColor: "rgba(255, 255, 255, 0.3)"
            }}>
            <View style={{ flex: 1 }}>

                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingTop: 90,
                        paddingBottom: 20,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.secondary,
                            fontSize: 22,
                            fontWeight: "700",
                        }}
                    >
                        {t("drawer.hello")} {user ? (user.name) : ("Guest user")} 👋
                    </Text>

                    <Text
                        style={{
                            color: theme.colors.secondary,
                            fontSize: 15,
                            marginTop: 6,
                            opacity: user ? 0.8 : 0,
                        }}
                    >
                        {user ? `${t("drawer.welcome")} Omid` : ""}
                    </Text>
                </View>

                {/* Main drawer items */}
                <DrawerContentScrollView
                    {...props}
                    contentContainerStyle={{
                        paddingTop: 30,
                    }}
                >
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>



                <View
                    style={{
                        borderRadius: 20,

                        shadowColor: "#FFFFFF",
                        shadowOffset: {
                            width: -4,
                            height: -4,
                        },
                        shadowOpacity: 0.9,
                        shadowRadius: 6,
                    }}
                >

                    <View
                        style={{
                            marginVertical: 30,
                            marginHorizontal: 18,
                            borderRadius: 20,

                            shadowColor: "#000",
                            shadowOffset: {
                                width: 4,
                                height: 4,
                            },
                            shadowOpacity: 0.18,
                            shadowRadius: 8,
                            elevation: 6,
                        }}
                    >

                        {user ? (
                        <Pressable
                            onPress={() => {
                                props.navigation.closeDrawer();
                                router.push("/Account");
                            }}
                            style={{
                                height: 84,
                                borderRadius: 20,
                                // backgroundColor: theme.colors.primary,
                                backgroundColor: "rgba(255, 251, 197, 0.25)",
                                justifyContent: 'space-evenly',
                                flexDirection: "row",
                                alignItems: "center",
                                paddingHorizontal: 20,
                                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <User
                                color={theme.colors.secondary}
                                size={35}
                            />

                            <Text
                                style={{
                                    marginLeft: 16,
                                    fontSize: 19,
                                    fontWeight: "600",
                                    color: theme.colors.secondary,
                                }}
                            >
                                {t("drawer.account")}
                            </Text>
                        </Pressable>
                        ):(<></>)}
                    </View>
                </View>

                <View style={{
                    marginHorizontal: 20,
                    marginBottom: 30,
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <Pressable
                        onPress={() => {
                            changeLanguage("en");
                        }}
                        style={{ flex: 1 }}>
                        {({ pressed }) => (
                            <BlurView
                                intensity={30}
                                tint={language === "en" ? "dark" : "extraLight"}
                                style={{
                                    // borderRadius: 34,
                                    borderBottomLeftRadius: 18,
                                    borderTopLeftRadius: 18,
                                    overflow: 'hidden',
                                    transform: [{ scale: pressed ? 0.95 : 1 }],
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        borderBottomLeftRadius: 18,
                                        borderTopLeftRadius: 18,
                                        // borderRadius: 38,
                                        borderLeftWidth: 1,
                                        borderTopWidth: 1,
                                        borderBottomWidth: 1,
                                        borderRightWidth: 0,
                                        borderColor: theme.colors.border,
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                        gap: 20,
                                        flexDirection: "row"
                                    }}
                                >
                                    <CountryFlag isoCode="us" size={10} />
                                    <Text>English</Text>
                                </View>
                            </BlurView>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            changeLanguage("fa")
                        }}
                        style={{ flex: 1 }}>
                        {({ pressed }) => (
                            <BlurView
                                intensity={30}
                                tint={language === "fa" ? "dark" : "extraLight"}
                                style={{
                                    // borderRadius: 34,
                                    borderBottomRightRadius: 18,
                                    borderTopRightRadius: 18,
                                    overflow: 'hidden',
                                    transform: [{ scale: pressed ? 0.95 : 1 }],
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        borderBottomRightRadius: 18,
                                        borderTopRightRadius: 18,
                                        // borderRadius: 38,
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                        gap: 20,
                                        flexDirection: "row"
                                    }}
                                >
                                    <Text>فارسی</Text>
                                    <CountryFlag isoCode="ir" size={10} />
                                </View>
                            </BlurView>
                        )}
                    </Pressable>
                </View>

            </View>
        </BlurView>

    );
};



const MenuDrawer = () => {
    const theme = useTheme();
    const { t } = useTranslation();


    return (

        <Drawer

            drawerContent={(props) => (
                <CustomDrawerContent {...props} />
            )}


            screenOptions={{
                headerShown: false,
                swipeEnabled: false,
                drawerType: "front",

                drawerActiveTintColor: theme.colors.secondary,
                drawerInactiveTintColor: theme.colors.secondary,


                drawerStyle: {
                    width: 280,
                    // backgroundColor: theme.colors.primary,
                    backgroundColor: "transparent",
                    // backgroundColor: 'rgba(255, 255, 255, 0.6)'
                },


                drawerItemStyle: {
                    height: 52,
                    borderRadius: 14,
                    marginHorizontal: 8,
                    marginVertical: 8,
                },


                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: "500",
                    marginLeft: 10,
                },


                drawerIconStyle: {
                    marginRight: 8,
                },


                overlayColor: "rgba(0,0,0,0.15)",
            }}
        >


            <Drawer.Screen
                name="index"
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                    title: "Map",
                    drawerLabel: "Map",

                    drawerIcon: ({ color, size }) => (
                        <Map
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />


            <Drawer.Screen
                name="Settings"
                options={{
                    title: t("drawer.settings"),
                    drawerLabel: t("drawer.settings"),

                    drawerIcon: ({ color, size }) => (
                        <Settings
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />


            <Drawer.Screen
                name="Favorites"
                options={{
                    title: t("drawer.favorites"),
                    drawerLabel: t("drawer.favorites"),

                    drawerIcon: ({ color, size }) => (
                        <Heart
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name="About"
                options={{
                    title: t("drawer.about"),
                    drawerLabel: t("drawer.about"),

                    drawerIcon: ({ color, size }) => (
                        <Info
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />



            {/* Hidden from the normal list */}
            <Drawer.Screen
                name="Account"
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            />

            <Drawer.Screen
                name="(auth)"
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            />


        </Drawer>
    );
};


export default MenuDrawer;