import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItemList, DrawerItem, } from "@react-navigation/drawer";
import { useTheme, Text } from "react-native-paper";
import { Map, Heart, Settings, CircleHelp, User, Info } from "lucide-react-native";
import { BlurView } from "expo-blur";



const CustomDrawerContent = (props) => {
    const theme = useTheme();

    console.log(theme.colors.secondary);


    return (
        <BlurView intensity={30}
            tint="extraLight"
            style={{
                flex: 1,
                backgroundColor: "rgba(251, 238, 62, 0.25)", // your primary with alpha
                borderRightWidth: 1,
                borderRightColor:"rgba(255, 255, 255, 0.3)"
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
                        Hello 👋
                    </Text>

                    <Text
                        style={{
                            color: theme.colors.secondary,
                            fontSize: 15,
                            marginTop: 6,
                            opacity: 0.8,
                        }}
                    >
                        Welcome back, Omid
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
                            marginVertical: 40,
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
                                Account
                            </Text>
                        </Pressable>
                    </View>
                </View>

            </View>
        </BlurView>

    );
};



const MenuDrawer = () => {
    const theme = useTheme();


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
                    title: "Settings",
                    drawerLabel: "Settings",

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
                    title: "Favorites",
                    drawerLabel: "Favorites",

                    drawerIcon: ({ color, size }) => (
                        <Heart
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />


            <Drawer.Screen
                name="Help"
                options={{
                    title: "Help",
                    drawerLabel: "Help",

                    drawerIcon: ({ color, size }) => (
                        <CircleHelp
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />


            <Drawer.Screen
                name="About"
                options={{
                    title: "About",
                    drawerLabel: "About",

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


        </Drawer>
    );
};


export default MenuDrawer;