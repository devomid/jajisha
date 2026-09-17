import { View, Pressable } from "react-native";
import { TextInput, List, Text, Divider } from "react-native-paper";
import { ChevronDown, ChevronUp, Navigation2, Compass, MapPinPen } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";


export default function MapSettings({ theme }) {
    const { t } = useTranslation();
    const [mapTypeExpand, setMapTypeExpand] = useState(false);
    const [myLocExpand, setMyLocExpand] = useState(false);
    const [compassExpand, setCompassExpand] = useState(false);

    const mapType = useSettingsStore(state => state.mapType);
    const setMapType = useSettingsStore(state => state.setMapType);

    const showMyLocation = useSettingsStore(state => state.showMyLocation);
    const setShowMyLocation = useSettingsStore(state => state.setShowMyLocation);

    const showCompass = useSettingsStore(state => state.showCompass);
    const setShowCompass = useSettingsStore(state => state.setShowCompass);

    const handlePressMapType = () => setMapTypeExpand(!mapTypeExpand);
    const handlePressShowMyLoc = () => setMyLocExpand(!myLocExpand);
    const handlePressShowCompass = () => setCompassExpand(!compassExpand);

    return (
        <View style={{
            flex: 1,
            paddingHorizontal: 27,
            marginTop: 5
        }}>

            <View style={{
                padding: 12,
                borderRadius: 24,
                borderWidth: 0.5,
                borderColor: theme.colors.secondaryLight + '80',
                backgroundColor: theme.colors.secondaryLight + '10'
            }}>
                <Text style={{
                    marginTop: 5,
                    color: theme.colors.text
                }}>
                    Map and Navigation
                </Text>

                <View style={{
                    marginTop: 10,
                }}>
                    <List.Accordion
                        title={"Map type"}
                        expanded={mapTypeExpand}
                        onPress={handlePressMapType}
                        style={{
                            height: 44,
                            backgroundColor: theme.colors.secondaryLighter + "25",
                            borderWidth: 0.5,
                            borderColor: theme.colors.surface + '99',
                            borderRadius: 14,
                            paddingHorizontal: 10,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 20,
                            },
                            shadowOpacity: 0.7,
                            shadowRadius: 15,
                            elevation: 10,
                            marginBottom: 5,
                        }}
                        theme={{
                            colors: {
                                background: 'transparent',
                                surface: 'transparent',
                            },
                        }}
                        titleStyle={{ color: theme.colors.secondary + '99', transform: [{ translateY: -8 }], fontSize: 14 }}
                        left={() => (<MapPinPen
                            size={18}
                            color={theme.colors.secondary + '95'}
                        />)} // remove default arrow
                        right={() => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.text + '85',
                                        fontSize: 13,
                                        transform: [{ translateY: -8 }],
                                    }}
                                >
                                    {mapType}
                                </Text>

                                {mapTypeExpand ? (
                                    <ChevronUp
                                        size={20}
                                        color={theme.colors.secondary}
                                        style={{ transform: [{ translateY: -4 }] }}
                                    />
                                ) : (
                                    <ChevronDown
                                        size={20}
                                        color={theme.colors.secondary}
                                        style={{ transform: [{ translateY: -4 }] }}
                                    />
                                )}
                            </View>
                        )}
                    >
                        <View style={{
                            marginHorizontal: 15,
                            marginBottom: 10,
                            marginTop: -5,
                            height: 120,
                            width: '91%',
                            justifyContent: 'center',
                            borderWidth: 0.5,
                            borderTopWidth: 0,
                            borderBottomLeftRadius: 24,
                            borderBottomRightRadius: 24,
                            borderColor: theme.colors.secondaryLight + '80',
                            backgroundColor: theme.colors.surface + '20',
                        }}
                        >
                            <Pressable
                                onPress={() => {
                                    setMapType("standard")
                                    setMapTypeExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20
                                }}
                            >
                                {({ pressed }) => (
                                    <Text style={{
                                        color: pressed ?
                                            theme.colors.secondaryLight :
                                            theme.colors.primaryDarker

                                    }}>Standard</Text>
                                )}
                            </Pressable>

                            <Divider horizontalInset style={{ marginLeft: -20 }} />

                            <Pressable
                                onPress={() => {
                                    setMapType("satellite")
                                    setMapTypeExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20,
                                }}>
                                {({ pressed }) => (
                                    <Text style={{
                                        color: pressed ?
                                            theme.colors.secondaryLight :
                                            theme.colors.primaryDarker

                                    }}>Satellite</Text>
                                )}
                            </Pressable>

                            <Divider horizontalInset style={{ marginLeft: -20 }} />

                            <Pressable
                                onPress={() => {
                                    setMapType("hybrid")
                                    setMapTypeExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20
                                }}
                            >
                                {({ pressed }) => (
                                    <Text style={{
                                        color: pressed ?
                                            theme.colors.secondaryLight :
                                            theme.colors.primaryDarker

                                    }}>Hybrid</Text>
                                )}
                            </Pressable>

                        </View>
                    </List.Accordion>
                </View>

                <View>
                    <List.Accordion
                        title={"Show my location"}
                        expanded={myLocExpand}
                        onPress={handlePressShowMyLoc}
                        style={{
                            height: 44,
                            backgroundColor: theme.colors.secondaryLighter + "25",
                            borderWidth: 0.5,
                            borderColor: theme.colors.surface + '99',
                            borderRadius: 14,
                            paddingHorizontal: 10,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 20,
                            },
                            shadowOpacity: 0.7,
                            shadowRadius: 15,
                            elevation: 10,
                            marginBottom: 5,
                        }}
                        theme={{
                            colors: {
                                background: 'transparent',
                                surface: 'transparent',
                            },
                        }}
                        titleStyle={{ color: theme.colors.secondary + '99', transform: [{ translateY: -8 }], fontSize: 14 }}
                        left={() => (<Navigation2
                            size={18}
                            color={theme.colors.secondary + '95'}
                        />)} // remove default arrow
                        right={() => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.text + '85',
                                        fontSize: 13,
                                        transform: [{ translateY: -8 }],
                                    }}
                                >
                                    {showMyLocation ? "Do" : "Don't"}
                                </Text>

                                {myLocExpand ? (
                                    <ChevronUp
                                        size={20}
                                        color={theme.colors.secondary}
                                        style={{ transform: [{ translateY: -4 }] }}
                                    />
                                ) : (
                                    <ChevronDown
                                        size={20}
                                        color={theme.colors.secondary}
                                        style={{ transform: [{ translateY: -4 }] }}
                                    />
                                )}
                            </View>
                        )}
                    >
                        <View style={{
                            marginHorizontal: 15,
                            marginBottom: 10,
                            marginTop: -5,
                            height: 88,
                            width: '91%',
                            justifyContent: 'center',
                            borderWidth: 0.5,
                            borderTopWidth: 0,
                            borderBottomLeftRadius: 24,
                            borderBottomRightRadius: 24,
                            borderColor: theme.colors.secondaryLight + '80',
                            backgroundColor: theme.colors.surface + '20',
                        }}
                        >
                            <Pressable
                                onPress={() => {
                                    setShowMyLocation(true)
                                    setMyLocExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20
                                }}
                            >
                                {({ pressed }) => (
                                    <Text style={{
                                        color: pressed ?
                                            theme.colors.secondaryLight :
                                            theme.colors.primaryDarker

                                    }}>Show my location</Text>
                                )}
                            </Pressable>

                            <Divider horizontalInset style={{ marginLeft: -20 }} />

                            <Pressable
                                onPress={() => {
                                    setShowMyLocation(false)
                                    setMyLocExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20,
                                }}>
                                {({ pressed }) => (
                                    <Text style={{
                                        color: pressed ?
                                            theme.colors.secondaryLight :
                                            theme.colors.primaryDarker

                                    }}>Don't show my location</Text>
                                )}
                            </Pressable>

                        </View>
                    </List.Accordion>
                </View>

                <View>
                    <List.Accordion
                        title={"Show Compass"}
                        expanded={compassExpand}
                        onPress={handlePressShowCompass}
                        style={{
                            height: 44,
                            backgroundColor: theme.colors.secondaryLighter + "25",
                            borderWidth: 0.5,
                            borderColor: theme.colors.surface + '99',
                            borderRadius: 14,
                            paddingHorizontal: 10,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 20,
                            },
                            shadowOpacity: 0.7,
                            shadowRadius: 15,
                            elevation: 10,
                            marginBottom: 5,
                        }}
                        theme={{
                            colors: {
                                background: 'transparent',
                                surface: 'transparent',
                            },
                        }}
                        titleStyle={{ color: theme.colors.secondary + '99', transform: [{ translateY: -8 }], fontSize: 14 }}
                        left={() => (<Compass
                            size={18}
                            color={theme.colors.secondary + '95'}
                        />)} // remove default arrow
                        right={() => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.text + '85',
                                        fontSize: 13,
                                        transform: [{ translateY: -8 }],
                                    }}
                                >
                                    {showCompass ? "Do" : "Don't"}
                                </Text>

                                {compassExpand ? (
                                    <ChevronUp
                                        size={20}
                                        color={theme.colors.secondary}
                                        style={{ transform: [{ translateY: -4 }] }}
                                    />
                                ) : (
                                    <ChevronDown
                                        size={20}
                                        color={theme.colors.secondary}
                                        style={{ transform: [{ translateY: -4 }] }}
                                    />
                                )}
                            </View>
                        )}
                    >
                        <View style={{
                            marginHorizontal: 15,
                            marginBottom: 10,
                            marginTop: -5,
                            height: 88,
                            width: '91%',
                            justifyContent: 'center',
                            borderWidth: 0.5,
                            borderTopWidth: 0,
                            borderBottomLeftRadius: 24,
                            borderBottomRightRadius: 24,
                            borderColor: theme.colors.secondaryLight + '80',
                            backgroundColor: theme.colors.surface + '20',
                        }}
                        >
                            <Pressable
                                onPress={() => {
                                    setShowCompass(true)
                                    setCompassExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20
                                }}
                            >
                                {({ pressed }) => (
                                    <Text style={{
                                        color: pressed ?
                                            theme.colors.secondaryLight :
                                            theme.colors.primaryDarker

                                    }}>Show compass</Text>
                                )}
                            </Pressable>

                            <Divider horizontalInset style={{ marginLeft: -20 }} />

                            <Pressable
                                onPress={() => {
                                    setShowCompass(false)
                                    setCompassExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20,
                                }}>
                                {({ pressed }) => (
                                    <Text style={{
                                        color: pressed ?
                                            theme.colors.secondaryLight :
                                            theme.colors.primaryDarker

                                    }}>Don't show Compass</Text>
                                )}
                            </Pressable>
                        </View>
                    </List.Accordion>
                </View>

            </View>

        </View>
    )
}
