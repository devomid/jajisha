import { useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { ChevronDown, ChevronUp, RulerDimensionLine, Languages, AtSign, SunMoon, Trash, UserRoundCog, LogOut, Check } from "lucide-react-native";
import { List, Text, Divider } from "react-native-paper";
import { Pressable, View } from "react-native";

import { useSettingsStore } from "../../src/store/settingsStore";
import { useUserStore } from "../../src/store/userStore";
import { useAuth } from "../../src/hooks/useAuth";

import ButtonComponent from '../Button/Button';

export default function GeneralSettings({ theme }) {

    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const isFarsi = i18n.language === "fa";
    const { logout } = useAuth();
    const { deleteUser } = useAuth();

    const user = useUserStore((state) => state.user);
    const distanceUnit = useSettingsStore((state) => state.distanceUnit);
    const setDistanceUnit = useSettingsStore((state) => state.setDistanceUnit);
    const themeSetting = useSettingsStore(state => state.theme);
    const setTheme = useSettingsStore(state => state.setTheme);

    const [unitExpand, setUnitExpand] = useState(false);
    const [languageExpand, setLanguageExpand] = useState(false);
    const [themeExpand, setThemeExpand] = useState(false);
    const [accountExpand, setAccountExpand] = useState(false);


    const handlePressUnit = () => setUnitExpand(!unitExpand);
    const handlePressLanguage = () => setLanguageExpand(!languageExpand);
    const handlePressTheme = () => setThemeExpand(!themeExpand);
    const handlePressAccount = () => setAccountExpand(!accountExpand);

    const changeLanguage = async (lan) => {
        if (lan === i18n.language)
            return;

        await i18n.changeLanguage(lan);
        await AsyncStorage.setItem("language", lan);

    };

    return (
        <View style={{
            flex: 1,
            paddingHorizontal: 27
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
                    {t("components.settings.general.title")}
                </Text>

                <View style={{
                    marginTop: 10,
                }}>
                    <List.Accordion
                        title={isFarsi ? "" : t("components.settings.general.systemUnit")}
                        expanded={unitExpand}
                        onPress={handlePressUnit}
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
                                    {unitExpand ? (
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
                                        {t(`components.settings.general.${distanceUnit.toLowerCase()}`)}
                                    </Text>
                                </View>
                            ) : (
                                <RulerDimensionLine
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
                                        {t("components.settings.general.systemUnit")}
                                    </Text>

                                    <RulerDimensionLine
                                        size={18}
                                        color={theme.colors.secondary + '95'}
                                        style={{ transform: [{ translateY: -5 }] }}
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
                                        {t(`components.settings.general.${distanceUnit.toLowerCase()}`)}
                                    </Text>

                                    {unitExpand ? (
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
                                height: 89,
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
                                    setDistanceUnit('Metric')
                                    setUnitExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20
                                }}
                            >
                                {({ pressed }) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >

                                        <Text style={{
                                            color: pressed ?
                                                theme.colors.secondaryLight :
                                                theme.colors.primaryDarker

                                        }}>
                                            {t("components.settings.general.metric")}
                                        </Text>
                                        {distanceUnit === "Metric" &&
                                            <Check
                                                size={17}
                                                color={theme.colors.primary}
                                                strokeWidth={1.8}
                                            />
                                        }

                                    </View>
                                )}
                            </Pressable>

                            <Divider horizontalInset style={{ marginLeft: -20 }} />

                            <Pressable
                                onPress={() => {
                                    setDistanceUnit('Imperial')
                                    setUnitExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20,
                                }}>
                                {({ pressed }) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{
                                            color: pressed ?
                                                theme.colors.secondaryLight :
                                                theme.colors.primaryDarker

                                        }}>
                                            {t("components.settings.general.imperial")}
                                        </Text>

                                        {distanceUnit === "Imperial" &&
                                            <Check
                                                size={17}
                                                color={theme.colors.primary}
                                                strokeWidth={1.8}
                                            />
                                        }
                                    </View>
                                )}
                            </Pressable>
                        </View>
                    </List.Accordion>
                </View>

                <View>
                    <List.Accordion
                        title={isFarsi ? "" : t("components.settings.general.language")}
                        expanded={languageExpand}
                        onPress={handlePressLanguage}
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
                                    {languageExpand ? (
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
                                        {{
                                            fa: t("components.settings.general.farsi"),
                                            en: t("components.settings.general.english"),
                                        }[i18n.language] ?? "--"}
                                    </Text>
                                </View>
                            ) : (
                                <Languages
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
                                        {t("components.settings.general.language")}
                                    </Text>

                                    <Languages
                                        size={18}
                                        color={theme.colors.secondary + '95'}
                                        style={{ transform: [{ translateY: -3 }] }}
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
                                        {{
                                            fa: t("components.settings.general.farsi"),
                                            en: t("components.settings.general.english"),
                                        }[i18n.language] ?? "--"}
                                    </Text>

                                    {languageExpand ? (
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
                                height: 89,
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
                                    changeLanguage("fa")
                                    setLanguageExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20
                                }}
                            >
                                {({ pressed }) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{
                                            color: pressed ?
                                                theme.colors.secondaryLight :
                                                theme.colors.primaryDarker

                                        }}>
                                            {t("components.settings.general.farsi")}
                                        </Text>

                                        {isFarsi &&
                                            <Check
                                                size={17}
                                                color={theme.colors.primary}
                                                strokeWidth={1.8}
                                            />
                                        }
                                    </View>

                                )}
                            </Pressable>

                            <Divider horizontalInset style={{ marginLeft: -20 }} />

                            <Pressable
                                onPress={() => {
                                    changeLanguage("en")
                                    setLanguageExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20,
                                }}>
                                {({ pressed }) => (

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{
                                            color: pressed ?
                                                theme.colors.secondaryLight :
                                                theme.colors.primaryDarker

                                        }}>
                                            {t("components.settings.general.english")}
                                        </Text>

                                        {!isFarsi &&
                                            <Check
                                                size={17}
                                                color={theme.colors.primary}
                                                strokeWidth={1.8}
                                            />
                                        }
                                    </View>

                                )}
                            </Pressable>
                        </View>
                    </List.Accordion>
                </View>

                <View>
                    <List.Accordion
                        title={isFarsi ? "" : t("components.settings.general.theme")}
                        expanded={themeExpand}
                        onPress={handlePressTheme}
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
                                    {themeExpand ? (
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
                                        {t(`components.settings.general.${themeSetting.toLowerCase()}`)}
                                    </Text>
                                </View>
                            ) : (
                                <SunMoon
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
                                        {t("components.settings.general.theme")}
                                    </Text>

                                    <SunMoon
                                        size={18}
                                        color={theme.colors.secondary + '95'}
                                        style={{ transform: [{ translateY: -5 }] }}
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
                                        {t(`components.settings.general.${themeSetting.toLowerCase()}`)}
                                    </Text>

                                    {themeExpand ? (
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
                                    setTheme('Light')
                                    setThemeExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20
                                }}
                            >
                                {({ pressed }) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{
                                            color: pressed ?
                                                theme.colors.secondaryLight :
                                                theme.colors.primaryDarker

                                        }}>
                                            {t("components.settings.general.light")}
                                        </Text>

                                        {themeSetting === "Light" &&
                                            <Check
                                                size={17}
                                                color={theme.colors.primary}
                                                strokeWidth={1.8}
                                            />
                                        }
                                    </View>

                                )}
                            </Pressable>

                            <Divider horizontalInset style={{ marginLeft: -20 }} />

                            <Pressable
                                onPress={() => {
                                    setTheme('System')
                                    setThemeExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20,
                                }}>
                                {({ pressed }) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{
                                            color: pressed ?
                                                theme.colors.secondaryLight :
                                                theme.colors.primaryDarker

                                        }}>
                                            {t("components.settings.general.system")}
                                        </Text>

                                        {themeSetting === "System" &&
                                            <Check
                                                size={17}
                                                color={theme.colors.primary}
                                                strokeWidth={1.8}
                                            />
                                        }
                                    </View>

                                )}
                            </Pressable>

                            <Divider horizontalInset style={{ marginLeft: -20 }} />

                            <Pressable
                                onPress={() => {
                                    setTheme('Dark')
                                    setThemeExpand(false)
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    paddingVertical: 10,
                                    marginLeft: -20,
                                }}>
                                {({ pressed }) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{
                                            color: pressed ?
                                                theme.colors.secondaryLight :
                                                theme.colors.primaryDarker

                                        }}>
                                            {t("components.settings.general.dark")}
                                        </Text>

                                        {themeSetting === "Dark" &&
                                            <Check
                                                size={17}
                                                color={theme.colors.primary}
                                                strokeWidth={1.8}
                                            />
                                        }
                                    </View>

                                )}
                            </Pressable>
                        </View>
                    </List.Accordion>
                </View>

                <View>
                    <List.Accordion
                        title={isFarsi ? "" : t("components.settings.general.account")}
                        expanded={accountExpand}
                        onPress={handlePressAccount}
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
                                    {accountExpand ? (
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
                                        {user ? user.username : t("components.settings.general.guest")}
                                    </Text>
                                </View>
                            ) : (
                                <UserRoundCog
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
                                        {t("components.settings.general.account")}
                                    </Text>

                                    <UserRoundCog
                                        size={18}
                                        color={theme.colors.secondary + '95'}
                                        style={{ transform: [{ translateY: -3 }] }}
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
                                        {user ? user.username : t("components.settings.general.guest")}
                                    </Text>

                                    {accountExpand ? (
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
                        {user ? (

                            <View
                                style={{
                                    marginHorizontal: 15,
                                    marginBottom: 10,
                                    marginTop: -5,
                                    height: 170,
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
                                <View>
                                    <View style={{
                                        flexDirection: 'row',
                                        gap: 10,
                                        marginLeft: -20,
                                        alignItems: 'center'
                                    }}>
                                        <AtSign
                                            size={16}
                                            color={theme.colors.secondaryLight + '99'}
                                            strokeWidth={2}
                                        />
                                        <Text
                                            variant="bodyMedium"
                                            style={{ color: theme.colors.secondaryDark }}>
                                            {t("components.settings.general.username")} :
                                        </Text>
                                        <Text style={{
                                            color: theme.colors.text
                                        }}>
                                            {user.username}
                                        </Text>
                                    </View>

                                </View>

                                <Divider horizontalInset style={{ marginLeft: -20 }} />

                                <ButtonComponent
                                    onPress={() => {
                                        router.push("/Settings");
                                        logout();
                                    }}
                                    backgroundColor={theme.colors.primaryDarker + "23"}
                                    borderColor={theme.colors.error + "30"}
                                    style={{
                                        width: "100%",
                                        marginTop: '24',
                                        marginLeft: -20,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <LogOut
                                            size={18}
                                            color={theme.colors.primaryDarker}
                                            strokeWidth={2}
                                        />

                                        <Text
                                            style={{
                                                color: theme.colors.primaryDarker,
                                                fontSize: 15,
                                                fontWeight: "500",
                                                marginLeft: 15
                                            }}
                                        >
                                            {t("components.settings.general.signout")}
                                        </Text>

                                    </View>
                                </ButtonComponent>

                                <ButtonComponent
                                    onPress={() => {
                                        router.push("/Settings");
                                        deleteUser();
                                    }}
                                    backgroundColor={theme.colors.error + '15'}
                                    borderColor={theme.colors.error + '50'}
                                    style={{
                                        width: '100%',
                                        marginTop: '8',
                                        marginLeft: -20,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Trash
                                            size={18}
                                            color={theme.colors.error}
                                            strokeWidth={2}
                                        />
                                        <Text
                                            style={{
                                                color: theme.colors.error,
                                                marginLeft: 15
                                            }}>
                                            {t("components.settings.general.deleteAccount")}
                                        </Text>
                                    </View>
                                </ButtonComponent>

                            </View>
                        ) : (
                            <View style={{
                                marginHorizontal: 15,
                                marginBottom: 10,
                                marginTop: -5,
                                height: 150,
                                width: '91%',
                                justifyContent: 'center',
                                borderWidth: 0.5,
                                borderTopWidth: 0,
                                borderBottomLeftRadius: 24,
                                borderBottomRightRadius: 24,
                                borderColor: theme.colors.secondaryLight + '80',
                                backgroundColor: theme.colors.surface + '20',
                                gap: 10,
                                paddingRight: 45
                            }}>
                                <Text variant="titleMedium"
                                    style={{
                                        color: theme.colors.error,
                                        textAlign: 'center'
                                    }}>
                                    {t("components.settings.general.nothingToShow")}
                                </Text>
                                <Pressable onPress={() => router.push("/SignIn")}>
                                    <Text
                                        style={{
                                            color: theme.colors.secondaryDarker,
                                            fontWeight: "600",
                                            textAlign: 'center'
                                        }}
                                    >
                                        {t("components.settings.general.signin")}
                                    </Text>
                                </Pressable>
                                <Text style={{ textAlign: 'center' }}>
                                    or
                                </Text>
                                <Pressable onPress={() => router.push("/SignUp")}>
                                    <Text
                                        style={{
                                            color: theme.colors.secondaryDarker,
                                            fontWeight: "600",
                                            textAlign: 'center'
                                        }}
                                    >
                                        {t("components.settings.general.createAccount")}
                                    </Text>
                                </Pressable>
                                <Text style={{ textAlign: 'center' }}>
                                    {t("components.settings.general.toSee")}
                                </Text>
                            </View>
                        )}
                    </List.Accordion>
                </View>

            </View>

        </View>
    )
}
