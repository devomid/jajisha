import { useTranslation } from "react-i18next";
import { router } from "expo-router";

import { MapPin, Road, Route, Star, Timer } from "lucide-react-native";
import { useTheme, Text } from "react-native-paper";
import { View, Image, Pressable } from "react-native";

import { useWcDataStore } from "../../store/wcDataStore";
import { useTopSheetStore } from "../../store/menuStore";
import { useSettingsStore } from "../../store/settingsStore";
import { formatDistance } from "../../src/utils/distance";

import ButtonComponent from "../Button/Button";


const ToiletCard = ({ toilet, onPress }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const setNavigationTarget = useWcDataStore(state => state.setNavigationTarget);
    const toiletRouteInfo = useWcDataStore(state => state.toiletRouteInfo);
    const { distance, duration } = toiletRouteInfo;
    const distanceUnit = useSettingsStore(state => state.distanceUnit);

    if (!toilet) return null;

    const formatDuration = () => {
        if (typeof duration !== "number") {
            return "--";
        }

        const minutes = Math.round(duration / 60);

        if (minutes < 60) {
            return `${minutes} ${t("components.toiletCard.min")}`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return `${hours}h ${remainingMinutes} ${t("components.toiletCard.min")}`;
    };
    return (
        <Pressable
            onPress={onPress}
            style={{
                width: "94%",
                height: 155,
                alignSelf: "center",
                marginVertical: 6,
                padding: 7,
                flexDirection: "row",
                borderWidth: 0.5,
                borderRadius: 24,
                borderColor: theme.colors.secondaryLight + "80",
                backgroundColor: theme.colors.secondary + "10",
                overflow: "hidden",
            }}
        >
            <Image
                source={require("../../assets/picPlaceHolder.png")}
                style={{
                    width: 120,
                    height: "100%",
                    borderRadius: 19,
                    borderWidth: 0.5,
                    borderColor: theme.colors.secondaryLight + "45",
                    resizeMode: "contain",
                }}
            />
            <View
                style={{
                    flex: 1,
                    marginLeft: 11,
                    paddingVertical: 2,
                    paddingRight: 3,
                    justifyContent: "space-between",
                }}
            >
                <View>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        variant="titleMedium"
                        style={{
                            color: theme.colors.text,
                            fontWeight: "700",
                        }}
                    >
                        {toilet.name}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            marginTop: 2,
                        }}
                    >
                        <MapPin
                            size={13}
                            color={theme.colors.text + "70"}
                            strokeWidth={2}
                        />
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            variant="bodySmall"
                            style={{
                                flex: 1,
                                color: theme.colors.text + "80",
                            }}
                        >
                            {toilet.address}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 5,
                        marginTop: 5,
                        marginBottom: 5
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <Star
                            size={13}
                            color={theme.colors.secondaryLight}
                            fill={theme.colors.secondaryLight}
                            strokeWidth={1.8}
                        />
                        <Text
                            variant="bodySmall"
                            style={{
                                color: theme.colors.text,
                                fontWeight: "600",
                            }}
                        >
                            {toilet.ratingSummary?.average?.toFixed(1) ?? "0.0"}
                        </Text>
                        <Text
                            variant="bodySmall"
                            style={{
                                color: theme.colors.text + "65",
                                marginLeft: 5
                            }}
                        >
                            ({toilet.ratingSummary?.count ?? 0}
                        </Text>
                        <Text
                            variant="bodySmall"
                            style={{
                                color: theme.colors.text + "65",
                            }}
                        >
                            {t("components.toiletCard.reviewTitle")})
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <Road
                            size={16}
                            color={
                                theme.colors.secondaryLight + "90"
                            }
                            strokeWidth={2}
                        />

                        <Text
                            variant="bodySmall"
                            style={{
                                color:
                                    theme.colors.secondaryDark + "99",
                            }}
                        >
                            {formatDistance(distance, distanceUnit, t)}
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >

                            <Timer
                                size={16}
                                strokeWidth={2}
                                color={
                                    theme.colors.secondaryLight + "90"
                                }
                            />

                            <Text
                                variant="bodySmall"
                                style={{
                                    color:
                                        theme.colors.secondaryDark + "99",
                                }}
                            >
                                {formatDuration()}
                            </Text>
                        </View>
                    </View>

                </View>

                <ButtonComponent
                    onPress={() => {
                        useTopSheetStore.getState().close();
                        router.push("/");
                        setNavigationTarget(toilet);
                    }}
                    backgroundColor={
                        theme.colors.nav + "20"
                    }
                    borderColor={
                        theme.colors.nav + "55"
                    }
                    style={{
                        width: "100%",
                        height: 31,
                        marginTop: 3,
                        marginBottom: 12,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 7,
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Route
                            size={14}
                            color={theme.colors.nav}
                            strokeWidth={2}
                        />

                        <Text
                            variant="labelMedium"
                            style={{
                                color: theme.colors.nav,
                            }}
                        >
                            {t("components.toiletCard.showRouteBtn")}
                        </Text>
                    </View>
                </ButtonComponent>
            </View>
        </Pressable>
    );
};

export default ToiletCard;