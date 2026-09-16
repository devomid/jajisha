import { View } from "react-native";
import { TextInput, List, Text } from "react-native-paper";
import { ChevronDown, ChevronUp, RulerDimensionLine, Languages, SunMoon, UserRoundCog } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";


export default function GeneralSettings({ theme }) {
    const { t } = useTranslation();
    const [expandedAmenities, setExpandedAmenities] = useState(false);
    const [expandedRatings, setExpandedRatings] = useState(false);


    const handlePressAmenities = () => setExpandedAmenities(!expandedAmenities);

    return (
        <View style={{
            flex: 1,
            paddingHorizontal: 27
        }}>

            <View style={{
                padding: 12,
                borderRadius:24,
                borderWidth: 0.5,
                borderColor: theme.colors.secondaryLight + '80',
                backgroundColor: theme.colors.secondaryLight + '10'
            }}>
                <Text style={{
                    marginTop: 5,
                    color: theme.colors.text
                }}>
                    General
                </Text>

                <View style={{
                    marginTop: 10,
                }}>
                    <List.Accordion
                        title={"Distance unit"}
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
                        left={() => (<RulerDimensionLine
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
                        title={"Language"}
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
                        left={() => (<Languages
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
                        left={() => (<SunMoon
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
                        title={"Account"}
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
                        left={() => (<UserRoundCog
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
