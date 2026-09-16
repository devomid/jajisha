import { View } from "react-native";
import { TextInput, List, Text } from "react-native-paper";
import { ChevronDown, ChevronUp, Navigation2, Compass, MapPinPen } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";


export default function MapSettings({ theme }) {
    const { t } = useTranslation();
    const [expandedAmenities, setExpandedAmenities] = useState(false);
    const [expandedRatings, setExpandedRatings] = useState(false);


    const handlePressAmenities = () => setExpandedAmenities(!expandedAmenities);

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
                        expanded={expandedAmenities}
                        onPress={handlePressAmenities}
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
                                    test
                                </Text>

                                {expandedAmenities ? (
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
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Text>
                                test
                            </Text>
                        </View>
                    </List.Accordion>
                </View>

                <View>
                    <List.Accordion
                        title={"Show my location"}
                        expanded={expandedAmenities}
                        onPress={handlePressAmenities}
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
                                    test
                                </Text>

                                {expandedAmenities ? (
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
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Text>
                                test
                            </Text>
                        </View>
                    </List.Accordion>
                </View>

                <View>
                    <List.Accordion
                        title={"Theme"}
                        expanded={expandedAmenities}
                        onPress={handlePressAmenities}
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
                                    test
                                </Text>

                                {expandedAmenities ? (
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
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Text>
                                test
                            </Text>
                        </View>
                    </List.Accordion>
                </View>

            </View>

        </View>
    )
}
