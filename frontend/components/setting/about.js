import { useState, } from "react";
import { useTranslation } from "react-i18next";
import Constants from 'expo-constants';
import { router } from "expo-router";

import { ChevronDown, ChevronUp, Info, Scale, Cat, ExternalLink } from "lucide-react-native";
import { Linking, View, Pressable } from "react-native";
import { List, Text } from "react-native-paper";

import ButtonComponent from '../Button/Button';


export default function AboutSettings({ theme }) {
    const { t, i18n } = useTranslation();
    const isFarsi = i18n.language === "fa";

    const appVersion = Constants.expoConfig?.version;
    const [aboutExpand, setAboutExpand] = useState(false);

    const handlePressAbouts = () => setAboutExpand(!aboutExpand);
    const handlePressPrivacyPolicy = () => router.push("/About");

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
                    {t("components.settings.about.title")}
                </Text>

                <View style={{
                    marginTop: 10,
                }}>
                    <List.Accordion
                        title={isFarsi ? "" : t("components.settings.about.titleAbout")}
                        expanded={aboutExpand}
                        onPress={handlePressAbouts}
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
                        left={() => (
                            isFarsi ? (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    {aboutExpand ? (
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

                                    <Text
                                        style={{
                                            color: theme.colors.text + '85',
                                            fontSize: 13,
                                            transform: [{ translateY: -8 }],
                                        }}
                                    >
                                        {appVersion}
                                    </Text>
                                </View>
                            ) : (
                                <Info
                                    size={18}
                                    color={theme.colors.secondary + '95'}
                                />
                            )
                        )}

                        right={() => (
                            isFarsi ? (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: theme.colors.secondary + '99',
                                            fontSize: 14,
                                            transform: [{ translateY: -8 }],
                                        }}
                                    >
                                        {t("components.settings.about.titleAbout")}
                                    </Text>

                                    <Info
                                        size={18}
                                        color={theme.colors.secondary + '95'}
                                        style={{ transform: [{ translateY: -4 }] }}
                                    />
                                </View>
                            ) : (
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
                                        {appVersion}
                                    </Text>

                                    {aboutExpand ? (
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
                            )
                        )}
                    >
                        <View
                            style={{
                                marginHorizontal: 15,
                                marginBottom: 10,
                                marginTop: -5,
                                height: 132,
                                width: '91%',
                                justifyContent: 'center',
                                paddingHorizontal: 16,
                                borderWidth: 0.5,
                                borderTopWidth: 0,
                                borderBottomLeftRadius: 24,
                                borderBottomRightRadius: 24,
                                borderColor: theme.colors.secondaryLight + '80',
                                backgroundColor: theme.colors.surface + '20',
                            }}
                        >
                            {/* App identity */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 8,
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            color: theme.colors.text,
                                            fontSize: 15,
                                            fontWeight: '600',
                                        }}
                                    >
                                        {t("components.settings.about.jajisha")}
                                    </Text>

                                    <Text
                                        style={{
                                            color: theme.colors.text + '75',
                                            fontSize: 11,
                                            marginTop: 1,
                                        }}
                                        >
                                        {t("components.settings.about.subtitle")}
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        color: theme.colors.secondary + '90',
                                        fontSize: 11,
                                    }}
                                >
                                    v{appVersion}
                                </Text>
                            </View>

                            {/* Links */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 8,
                                }}
                            >
                                <Pressable
                                    onPress={() =>
                                        Linking.openURL('https://github.com/devomid/jajisha')
                                    }
                                    style={({ pressed }) => ({
                                        flex: 1,
                                        height: 34,
                                        borderRadius: 12,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 6,
                                        backgroundColor: pressed
                                            ? theme.colors.secondary + '18'
                                            : theme.colors.surface + '18',
                                        borderWidth: 0.5,
                                        borderColor: theme.colors.secondaryLight + '50',
                                        opacity: pressed ? 0.7 : 1,
                                    })}
                                >
                                    <Cat
                                        size={15}
                                        color={theme.colors.secondary}
                                    />

                                    <Text
                                        style={{
                                            color: theme.colors.text + '90',
                                            fontSize: 11,
                                        }}
                                    >
                                        GitHub
                                    </Text>

                                    <ExternalLink
                                        size={11}
                                        color={theme.colors.text + '55'}
                                    />
                                </Pressable>

                                <Pressable
                                    onPress={() =>
                                        Linking.openURL(
                                            'https://github.com/devomid/jajisha/blob/main/LICENSE'
                                        )
                                    }
                                    style={({ pressed }) => ({
                                        flex: 1,
                                        height: 34,
                                        borderRadius: 12,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 6,
                                        backgroundColor: pressed
                                            ? theme.colors.secondary + '18'
                                            : theme.colors.surface + '18',
                                        borderWidth: 0.5,
                                        borderColor: theme.colors.secondaryLight + '50',
                                        opacity: pressed ? 0.7 : 1,
                                    })}
                                >
                                    <Scale
                                        size={15}
                                        color={theme.colors.secondary}
                                    />

                                    <Text
                                        style={{
                                            color: theme.colors.text + '90',
                                            fontSize: 11,
                                        }}
                                    >
                                        MIT License
                                    </Text>

                                    <ExternalLink
                                        size={11}
                                        color={theme.colors.text + '55'}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    </List.Accordion>
                </View>

                <View>
                    <ButtonComponent
                        onPress={handlePressPrivacyPolicy}
                        backgroundColor={theme.colors.secondary + '18'}
                        borderColor={theme.colors.secondaryLight + '50'}
                        style={{
                            width: '100%',
                            marginTop: 9,
                            marginBottom: 9,
                        }}
                    >
                        <View style={{
                            width: '100%',
                            height: '100%',
                            flexDirection: isFarsi ? 'row-reverse' : 'row',
                            alignItems: 'center',
                            overflow: 'hidden',
                            paddingLeft: isFarsi ? 0 : 10,
                            paddingRight: isFarsi ? 10 : 0,
                            gap: 18
                        }}>
                            <Scale
                                size={18}
                                color={theme.colors.secondary + '95'}
                            />
                            <Text style={{ color: theme.colors.secondary + '99' }}>
                                {t("components.settings.about.privacyPolicy")}
                            </Text>
                        </View>
                    </ButtonComponent>
                </View>

            </View>

        </View>
    )
}
