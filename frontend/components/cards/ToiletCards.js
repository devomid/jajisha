import { View, Image } from "react-native";
import { useWcDataStore } from "../../store/wcDataStore";
import { useTheme, Text } from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import { Toilet } from "lucide-react-native";
import ButtonComponent from "../Button/Button";
import { useTopSheetStore } from "../../store/menuStore";
import { router } from "expo-router";

const ToiletCard = ({toilet}) => {
    const theme = useTheme();
    const setNavigationTarget = useWcDataStore(state => state.setNavigationTarget);

    const navigation = useWcDataStore(
        (state) => state.navigation
    );

    const { distance, duration } = navigation || {};

    if (!toilet) return null;

    const formattedDistance =
        distance == null
            ? "--"
            : distance < 1000
                ? `${Math.round(distance)} m`
                : `${(distance / 1000).toFixed(1)} km`;

    const formatDuration = () => {
        if (duration == null) return "--";

        const minutes = Math.round(duration / 60);

        if (minutes < 60) {
            return `${minutes} min`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return remainingMinutes === 0
            ? `${hours}h`
            : `${hours}h ${remainingMinutes}min`;
    };

    return (
        <View
            style={{
                flexDirection: "row",

                width: "96%",
                height: 128,

                alignSelf: "center",

                marginVertical: 5,

                padding: 6,

                borderWidth: 0.5,
                borderRadius: 14,

                backgroundColor:
                    theme.colors.secondary + "30",

                borderColor:
                    theme.colors.secondary + "80",
            }}
        >

            {/* IMAGE */}
            <Image
                source={require("../../assets/picPlaceHolder.png")}
                style={{
                    width: "29%",
                    height: "100%",

                    marginRight: 7,

                    borderWidth: 0.5,
                    borderRadius: 12,

                    borderColor:
                        theme.colors.secondary + "80",

                    resizeMode: "contain",
                }}
            />


            {/* RIGHT SIDE */}
            <View
                style={{
                    flex: 1,
                    paddingVertical: 2,
                    gap: 12
                }}
            >

                {/* NAME / DISTANCE / DURATION */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",

                        width: "100%",
                    }}
                >
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        variant="titleLarge"
                        style={{
                            flex: 1,

                            color: theme.colors.surface,

                            marginRight: 5,
                        }}
                    >
                        {toilet.name}
                    </Text>

                    {/* RATING */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 3,
                            marginRight: 30
                        }}
                    >
                        <Text
                            variant="bodySmall"
                            style={{
                                color: theme.colors.text,
                            }}
                        >
                            {toilet.ratingSummary.average.toFixed(1)} / 5
                        </Text>

                        <Text
                            variant="bodySmall"
                            style={{
                                color: theme.colors.text,
                            }}
                        >
                            ({toilet.ratingSummary.count} vote)
                        </Text>
                    </View>

                    <Text
                        variant="bodySmall"
                        style={{
                            color: theme.colors.text,
                        }}
                    >
                        {formattedDistance}
                    </Text>

                    <Text
                        variant="bodySmall"
                        style={{
                            color: theme.colors.text,

                            marginLeft: 5,
                        }}
                    >
                        {formatDuration()}
                    </Text>
                </View>


                {/* ADDRESS */}
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    variant="bodySmall"
                    style={{
                        color:
                            theme.colors.secondaryDarker,
                    }}
                >
                    {toilet.address}
                </Text>

                {/* BUTTON */}
                <ButtonComponent
                    onPress={() => {
                        useTopSheetStore.getState().close();
                        router.push('/');
                        setNavigationTarget(toilet);
                    }}
                    backgroundColor={
                        theme.colors.secondary + "40"
                    }
                    borderColor={
                        theme.colors.secondaryLighter + "80"
                    }
                    style={{
                        width: "100%",
                        height: 32,
                    }}
                >
                    <Text
                        variant="labelSmall"
                        style={{
                            color:
                                theme.colors.primaryLighter,
                        }}
                    >
                        Show route to WC
                    </Text>
                </ButtonComponent>

            </View>
        </View>
    );
};

export default ToiletCard;